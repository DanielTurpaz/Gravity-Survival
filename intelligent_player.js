/**
 * Intelligent AI Player using Real-Time Enemy Detection
 * This AI reads enemy positions and moves away from them intelligently
 */

(function() {
    'use strict';
    
    if (!window.gameState) {
        console.error('Game state not exposed! Make sure game.js has been loaded with the modifications.');
        return;
    }
    
    let aiActive = false;
    let aiInterval = null;
    let lastDirection = { keys: ['w', 'd'], timestamp: 0 };
    
    // Get enemy data with safe direction calculation
    function getEnemyData() {
        const player = window.gameState.getPlayer();
        const enemies = window.gameState.getEnemies();
        
        if (!player || !enemies || enemies.length === 0) {
            return {
                player: player ? { x: player.x, y: player.y } : null,
                enemyCount: 0,
                safeDirection: { keys: ['w', 'd'], angle: 45 }
            };
        }
        
        // Calculate enemy distances and directions
        const enemyData = enemies.map(enemy => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx); // Angle from player to enemy
            return { enemy, dx, dy, distance, angle };
        }).sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)
        
        // Calculate weighted average direction away from enemies
        // Closer enemies have more weight
        let weightedX = 0;
        let weightedY = 0;
        let totalWeight = 0;
        
        // Consider top 5 closest enemies
        enemyData.slice(0, Math.min(5, enemyData.length)).forEach(data => {
            // Weight by inverse distance (closer = more dangerous)
            const weight = 1000 / (data.distance + 1);
            weightedX += Math.cos(data.angle) * weight;
            weightedY += Math.sin(data.angle) * weight;
            totalWeight += weight;
        });
        
        // Normalize to get average direction toward enemies
        if (totalWeight > 0) {
            weightedX /= totalWeight;
            weightedY /= totalWeight;
        }
        
        // Calculate angle AWAY from enemies (opposite direction)
        const escapeAngle = Math.atan2(-weightedY, -weightedX);
        const escapeAngleDeg = ((escapeAngle * 180 / Math.PI) + 360) % 360;
        
        // Convert angle to WASD keys
        const keys = angleToKeys(escapeAngleDeg);
        
        // Check for imminent danger (very close enemies)
        const dangerZone = 100; // pixels
        const imminentDangers = enemyData.filter(data => data.distance < dangerZone);
        
        // If enemy is very close, use more aggressive evasion
        let urgency = 'normal';
        if (imminentDangers.length > 0) {
            urgency = 'high';
            // If enemy is directly in path, make sharp turn
            const closest = imminentDangers[0];
            const relativeAngle = Math.abs(escapeAngle - closest.angle);
            if (relativeAngle < Math.PI / 3) { // Within 60 degrees
                // Sharp turn - add perpendicular movement
                const perpendicularAngle = escapeAngle + Math.PI / 2;
                const perpKeys = angleToKeys((perpendicularAngle * 180 / Math.PI + 360) % 360);
                return {
                    player: { x: player.x, y: player.y },
                    enemyCount: enemies.length,
                    closestEnemy: {
                        distance: Math.round(closest.distance),
                        angle: Math.round((closest.angle * 180 / Math.PI + 360) % 360)
                    },
                    safeDirection: { 
                        keys: perpKeys.length > 0 ? perpKeys : keys,
                        angle: Math.round(escapeAngleDeg),
                        urgency: 'high'
                    },
                    imminentDangers: imminentDangers.length
                };
            }
        }
        
        return {
            player: { x: player.x, y: player.y },
            enemyCount: enemies.length,
            closestEnemy: enemyData.length > 0 ? {
                distance: Math.round(enemyData[0].distance),
                angle: Math.round((enemyData[0].angle * 180 / Math.PI + 360) % 360)
            } : null,
            safeDirection: { 
                keys: keys,
                angle: Math.round(escapeAngleDeg),
                urgency: urgency
            },
            imminentDangers: imminentDangers.length
        };
    }
    
    // Convert angle (0-360 degrees) to WASD key combinations
    function angleToKeys(angleDeg) {
        const keys = [];
        
        // Diagonal movements for smoother evasion
        if (angleDeg >= 337.5 || angleDeg < 22.5) {
            // Right
            keys.push('d');
        } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
            // Down-Right
            keys.push('s', 'd');
        } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
            // Down
            keys.push('s');
        } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
            // Down-Left
            keys.push('s', 'a');
        } else if (angleDeg >= 157.5 && angleDeg < 202.5) {
            // Left
            keys.push('a');
        } else if (angleDeg >= 202.5 && angleDeg < 247.5) {
            // Up-Left
            keys.push('w', 'a');
        } else if (angleDeg >= 247.5 && angleDeg < 292.5) {
            // Up
            keys.push('w');
        } else if (angleDeg >= 292.5 && angleDeg < 337.5) {
            // Up-Right
            keys.push('w', 'd');
        }
        
        return keys.length > 0 ? keys : ['w', 'd']; // Default to up-right
    }
    
    // Execute movement based on safe direction
    function executeMovement(keys) {
        // Release all keys first
        ['w', 'a', 's', 'd'].forEach(key => {
            document.dispatchEvent(new KeyboardEvent('keyup', { 
                key: key, 
                bubbles: true,
                cancelable: true
            }));
        });
        
        // Small delay to ensure keys are released
        setTimeout(() => {
            // Press new keys
            keys.forEach(key => {
                document.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: key, 
                    bubbles: true,
                    cancelable: true
                }));
            });
            
            lastDirection = { keys: keys, timestamp: Date.now() };
        }, 10);
    }
    
    // Main AI loop
    function aiLoop() {
        if (!aiActive) return;
        
        try {
            const enemyData = getEnemyData();
            
            // Only change direction if we have meaningful enemy data
            if (enemyData.enemyCount === 0) {
                // No enemies, random movement to stay active
                if (Date.now() - lastDirection.timestamp > 1000) {
                    const randomKeys = angleToKeys(Math.random() * 360);
                    executeMovement(randomKeys);
                }
                return;
            }
            
            // Get safe direction and move
            const safeDir = enemyData.safeDirection;
            
            // Change direction more frequently if urgency is high
            const changeInterval = safeDir.urgency === 'high' ? 200 : 400;
            
            if (Date.now() - lastDirection.timestamp > changeInterval) {
                executeMovement(safeDir.keys);
            }
            
            // Log for debugging (can be disabled)
            if (window.aiDebug && Date.now() % 1000 < 100) {
                console.log(`AI: ${enemyData.enemyCount} enemies | Closest: ${enemyData.closestEnemy?.distance}px | Moving: ${safeDir.keys.join('+')}`);
            }
            
        } catch (error) {
            console.error('AI Error:', error);
        }
    }
    
    // Start AI player
    window.startIntelligentAI = function(debug = false) {
        if (aiActive) {
            console.log('AI already running!');
            return;
        }
        
        if (!window.gameState) {
            console.error('Cannot start AI: Game state not exposed!');
            return;
        }
        
        console.log('Starting Intelligent AI Player...');
        aiActive = true;
        window.aiDebug = debug;
        
        // Run AI loop every 100ms (10 times per second)
        aiInterval = setInterval(aiLoop, 100);
        
        // Start immediately
        aiLoop();
        
        console.log('Intelligent AI Player started! AI will move away from enemies automatically.');
        console.log('Use stopIntelligentAI() to stop.');
    };
    
    // Stop AI player
    window.stopIntelligentAI = function() {
        if (!aiActive) {
            console.log('AI not running.');
            return;
        }
        
        console.log('Stopping Intelligent AI Player...');
        aiActive = false;
        
        if (aiInterval) {
            clearInterval(aiInterval);
            aiInterval = null;
        }
        
        // Release all keys
        ['w', 'a', 's', 'd'].forEach(key => {
            document.dispatchEvent(new KeyboardEvent('keyup', { 
                key: key, 
                bubbles: true,
                cancelable: true
            }));
        });
        
        console.log('Intelligent AI Player stopped.');
    };
    
    // Expose enemy data function
    window.getEnemyData = getEnemyData;
    
    console.log('Intelligent AI Player loaded!');
    console.log('Usage:');
    console.log('  - startIntelligentAI() - Start the AI player');
    console.log('  - startIntelligentAI(true) - Start with debug logging');
    console.log('  - stopIntelligentAI() - Stop the AI player');
    console.log('  - getEnemyData() - Get current enemy detection data');
    
})();

