/**
 * Enemy Detection System for Browser Automation
 * This script reads enemy positions in real-time from the game
 */

// This script should be run in the browser console or via browser automation
// After the game.js has been loaded with the exposed gameState

function getEnemyPositions() {
    if (!window.gameState) {
        return { error: 'Game state not exposed. Make sure game.js has been loaded with the modifications.' };
    }
    
    const player = window.gameState.getPlayer();
    const enemies = window.gameState.getEnemies();
    
    if (!player) {
        return { error: 'Player not found. Start the game first.' };
    }
    
    // Calculate enemy distances and directions
    const enemyData = enemies.map(enemy => {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx); // Angle from player to enemy (in radians)
        const angleDeg = (angle * 180 / Math.PI + 360) % 360; // Convert to degrees (0-360)
        
        return {
            x: Math.round(enemy.x),
            y: Math.round(enemy.y),
            radius: enemy.radius,
            distance: Math.round(distance),
            angle: Math.round(angleDeg),
            direction: getDirectionFromAngle(angleDeg),
            threatLevel: calculateThreatLevel(distance, enemy.radius)
        };
    });
    
    // Sort by distance (closest first)
    enemyData.sort((a, b) => a.distance - b.distance);
    
    // Calculate safe direction (away from closest enemies)
    const safeDirection = calculateSafeDirection(player, enemyData);
    
    return {
        player: {
            x: Math.round(player.x),
            y: Math.round(player.y),
            radius: player.radius
        },
        enemyCount: enemies.length,
        closestEnemy: enemyData[0] || null,
        enemies: enemyData.slice(0, 10), // Top 10 closest enemies
        safeDirection: safeDirection,
        recommendedMovement: getRecommendedMovement(safeDirection)
    };
}

function getDirectionFromAngle(angleDeg) {
    if (angleDeg >= 45 && angleDeg < 135) return 'DOWN';      // Enemy below player
    if (angleDeg >= 135 && angleDeg < 225) return 'LEFT';     // Enemy to the left
    if (angleDeg >= 225 && angleDeg < 315) return 'UP';       // Enemy above player
    return 'RIGHT'; // Enemy to the right
}

function calculateThreatLevel(distance, radius) {
    const dangerZone = 150; // Distance where enemies are dangerous
    if (distance < dangerZone) return 'HIGH';
    if (distance < dangerZone * 2) return 'MEDIUM';
    return 'LOW';
}

function calculateSafeDirection(player, enemyData) {
    if (enemyData.length === 0) return { direction: 'CENTER', angle: 0 };
    
    // Weight enemies by proximity (closer = more dangerous)
    let weightedX = 0;
    let weightedY = 0;
    let totalWeight = 0;
    
    enemyData.slice(0, 5).forEach(enemy => { // Only consider 5 closest enemies
        const weight = 1000 / (enemy.distance + 1); // Inverse distance weighting
        const angle = enemy.angle * Math.PI / 180;
        weightedX += Math.cos(angle) * weight;
        weightedY += Math.sin(angle) * weight;
        totalWeight += weight;
    });
    
    if (totalWeight === 0) return { direction: 'CENTER', angle: 0 };
    
    // Normalize
    weightedX /= totalWeight;
    weightedY /= totalWeight;
    
    // Calculate angle away from enemies (opposite direction)
    const escapeAngle = Math.atan2(-weightedY, -weightedX);
    const escapeAngleDeg = (escapeAngle * 180 / Math.PI + 360) % 360;
    
    return {
        direction: getDirectionFromAngle(escapeAngleDeg),
        angle: Math.round(escapeAngleDeg),
        vector: { x: -weightedX, y: -weightedY }
    };
}

function getRecommendedMovement(safeDirection) {
    // Convert safe direction to WASD keys
    const angle = safeDirection.angle;
    
    // Determine which keys to press based on angle
    // 0° = right, 90° = down, 180° = left, 270° = up
    
    const keys = [];
    
    if (angle >= 315 || angle < 45) {
        keys.push('d'); // Right
    } else if (angle >= 45 && angle < 135) {
        keys.push('s'); // Down
    } else if (angle >= 135 && angle < 225) {
        keys.push('a'); // Left
    } else if (angle >= 225 && angle < 315) {
        keys.push('w'); // Up
    }
    
    // Add diagonal movements for smoother evasion
    if (angle >= 337.5 || angle < 22.5) {
        keys.push('d'); // Pure right
    } else if (angle >= 22.5 && angle < 67.5) {
        keys.push('s', 'd'); // Down-right
    } else if (angle >= 67.5 && angle < 112.5) {
        keys.push('s'); // Pure down
    } else if (angle >= 112.5 && angle < 157.5) {
        keys.push('s', 'a'); // Down-left
    } else if (angle >= 157.5 && angle < 202.5) {
        keys.push('a'); // Pure left
    } else if (angle >= 202.5 && angle < 247.5) {
        keys.push('w', 'a'); // Up-left
    } else if (angle >= 247.5 && angle < 292.5) {
        keys.push('w'); // Pure up
    } else if (angle >= 292.5 && angle < 337.5) {
        keys.push('w', 'd'); // Up-right
    }
    
    return keys.length > 0 ? keys : ['w', 'd']; // Default to up-right if unclear
}

// Expose to window for browser automation
window.enemyDetector = {
    getEnemyPositions: getEnemyPositions,
    getSafeDirection: () => {
        const data = getEnemyPositions();
        return data.safeDirection;
    },
    getRecommendedKeys: () => {
        const data = getEnemyPositions();
        return data.recommendedMovement;
    }
};

// Auto-run detection every 100ms for real-time updates
if (typeof window.startEnemyDetection === 'undefined') {
    window.enemyDetectionActive = false;
    
    window.startEnemyDetection = function() {
        window.enemyDetectionActive = true;
        const detectionLoop = setInterval(() => {
            if (!window.enemyDetectionActive) {
                clearInterval(detectionLoop);
                return;
            }
            
            const data = getEnemyPositions();
            window.latestEnemyData = data;
            
            // Log to console (can be disabled)
            if (window.enemyDetectionLogging) {
                console.log('Enemies:', data.enemyCount, '| Closest:', 
                    data.closestEnemy ? data.closestEnemy.distance + 'px' : 'none',
                    '| Safe:', data.safeDirection.direction);
            }
        }, 100); // Update every 100ms (10 times per second)
        
        console.log('Enemy detection started! Access latest data via window.latestEnemyData');
    };
    
    window.stopEnemyDetection = function() {
        window.enemyDetectionActive = false;
        console.log('Enemy detection stopped');
    };
}

console.log('Enemy detector loaded! Use:');
console.log('  - window.enemyDetector.getEnemyPositions() - Get current enemy data');
console.log('  - window.startEnemyDetection() - Start real-time detection');
console.log('  - window.latestEnemyData - Access latest detection results');

