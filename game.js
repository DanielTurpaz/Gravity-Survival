'use strict';

(function () {
    // ============================================
    // DOM REFERENCES & BASE CONFIG
    // ============================================

    const domElements = {
        canvas: document.getElementById('canvas'),
        ctx: null,
        timeDisplay: document.getElementById('time'),
        bestDisplay: document.getElementById('best'),
        difficultyIndicator: document.getElementById('difficultyIndicator'),
        startScreen: document.getElementById('startScreen'),
        startBtn: document.getElementById('startBtn'),
        customizeBtn: document.getElementById('customizeBtn'),
        difficultyBtn: document.getElementById('difficultyBtn'),
        difficultyLabel: document.getElementById('difficultyLabel'),
        bestScoresBtn: document.getElementById('bestScoresBtn'),
        settingsBtn: document.getElementById('settingsBtn'),
        customizeModal: document.getElementById('customizeModal'),
        bestScoresModal: document.getElementById('bestScoresModal'),
        settingsModal: document.getElementById('settingsModal'),
        pauseModal: document.getElementById('pauseModal'),
        closeCustomizeBtn: document.getElementById('closeCustomizeBtn'),
        closeBestScoresBtn: document.getElementById('closeBestScoresBtn'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        resumeBtn: document.getElementById('resumeBtn'),
        restartBtn: document.getElementById('restartBtn'),
        quitBtn: document.getElementById('quitBtn'),
        playerSkinOptions: document.getElementById('playerSkinOptions'),
        enemySkinOptions: document.getElementById('enemySkinOptions'),
        bestScoresList: document.getElementById('bestScoresList'),
        lastRunInfo: document.getElementById('lastRunInfo'),
        healthBar: document.getElementById('healthBar'),
        healthFill: document.getElementById('healthFill'),
        comboDisplay: document.getElementById('comboDisplay'),
        comboCount: document.getElementById('comboCount'),
        powerUpIndicators: document.getElementById('powerUpIndicators'),
        masterVolume: document.getElementById('masterVolume'),
        masterVolumeValue: document.getElementById('masterVolumeValue'),
        sfxVolume: document.getElementById('sfxVolume'),
        sfxVolumeValue: document.getElementById('sfxVolumeValue'),
        musicVolume: document.getElementById('musicVolume'),
        musicVolumeValue: document.getElementById('musicVolumeValue'),
        particlesEnabled: document.getElementById('particlesEnabled'),
        screenShakeEnabled: document.getElementById('screenShakeEnabled'),
        trailsEnabled: document.getElementById('trailsEnabled'),
        statsDisplay: document.getElementById('statsDisplay'),
        gameModeBtn: document.getElementById('gameModeBtn'),
        gameModeLabel: document.getElementById('gameModeLabel'),
        player1UI: document.getElementById('player1UI'),
        player2UI: document.getElementById('player2UI'),
        timeDisplayP2: document.getElementById('timeP2'),
        bestDisplayP2: document.getElementById('bestP2'),
        healthBarP2: document.getElementById('healthBarP2'),
        healthFillP2: document.getElementById('healthFillP2'),
        comboDisplayP2: document.getElementById('comboDisplayP2'),
        comboCountP2: document.getElementById('comboCountP2'),
        powerUpIndicatorsP1: document.getElementById('powerUpIndicatorsP1'),
        powerUpIndicatorsP2: document.getElementById('powerUpIndicatorsP2'),
        chaosModeBtn: document.getElementById('chaosModeBtn'),
        chaosModeLabel: document.getElementById('chaosModeLabel'),
        infoBtn: document.getElementById('infoBtn'),
        infoModal: document.getElementById('infoModal'),
        closeInfoBtn: document.getElementById('closeInfoBtn'),
        gameOverModal: document.getElementById('gameOverModal'),
        winnerDisplay: document.getElementById('winnerDisplay'),
        winnerText: document.getElementById('winnerText'),
        p2Stats: document.getElementById('p2Stats'),
        closeGameOverBtn: document.getElementById('closeGameOverBtn'),
        joystickContainer: document.getElementById('joystickContainer'),
        joystickBase: document.getElementById('joystickBase'),
        joystickStick: document.getElementById('joystickStick')
    };

    if (domElements.canvas) {
        domElements.ctx = domElements.canvas.getContext('2d');
    }

    const CONFIG = {
        acceleration: 0.5,
        friction: 0.95,
        particleRadius: 20,
        spawnOffset: 20,
        moveSpeed: 10,
        gravityStrength: 900,
        spawnInterval: 4200,
        enemySpeedMultiplier: 1
    };

    // ============================================
    // STATE & CONSTANTS
    // ============================================

    const BEST_TIMES_KEY = 'gravityBestTimes';
    const BEST_TIME_DEFAULTS = { 
        easy: { normal: 0, chaos: 0 },
        medium: { normal: 0, chaos: 0 },
        hard: { normal: 0, chaos: 0 }
    };

    const DIFFICULTY_LEVELS = [
        { id: 'easy', label: 'Easy', moveSpeed: 10, gravityStrength: 900, enemySpeedMultiplier: 1, spawnInterval: 4200 },
        { id: 'medium', label: 'Medium', moveSpeed: 11, gravityStrength: 1100, enemySpeedMultiplier: 1.25, spawnInterval: 3200 },
        { id: 'hard', label: 'Hard', moveSpeed: 12, gravityStrength: 1350, enemySpeedMultiplier: 1.55, spawnInterval: 2300 }
    ];

    const PLAYER_SKINS = [
        { id: 'easy_cat_sunrise', label: 'Sunrise Cat', difficulty: 'easy', unlockTime: 0, variant: 'cat', palette: { base: '#f4c542', ears: '#d69c25', eyes: '#2b2b2b', accent: '#ffd47f' } },
        { id: 'easy_cat_comet', label: 'Comet Cat', difficulty: 'easy', unlockTime: 100, variant: 'cat', palette: { base: '#ff8a00', ears: '#d15500', eyes: '#281000', accent: '#ffe098' } },
        { id: 'easy_cat_nebula', label: 'Nebula Cat', difficulty: 'easy', unlockTime: 180, variant: 'cat', palette: { base: '#fe5bac', ears: '#d63384', eyes: '#1a0d20', accent: '#f3c1ff' } },
        { id: 'medium_dragon_verdant', label: 'Verdant Dragon', difficulty: 'medium', unlockTime: 0, variant: 'dragon', palette: { base: '#3ecf6d', spikes: '#2b8f4b', eyes: '#14210f', sclera: '#f0f078' } },
        { id: 'medium_dragon_cinder', label: 'Cinder Dragon', difficulty: 'medium', unlockTime: 120, variant: 'dragon', palette: { base: '#4b4ded', spikes: '#1f22a2', eyes: '#fbb040', sclera: '#1b1036' } },
        { id: 'medium_dragon_storm', label: 'Storm Dragon', difficulty: 'medium', unlockTime: 200, variant: 'dragon', palette: { base: '#7df1ff', spikes: '#3a9fb3', eyes: '#0b4760', sclera: '#ffffff' } },
        { id: 'hard_dog_bronze', label: 'Bronze Hound', difficulty: 'hard', unlockTime: 0, variant: 'dog', palette: { base: '#c48a55', ears: '#8c5a2b', eyes: '#1b120a', accent: '#ffbe8b' } },
        { id: 'hard_dog_iron', label: 'Iron Hound', difficulty: 'hard', unlockTime: 90, variant: 'dog', palette: { base: '#7d8da6', ears: '#4c5566', eyes: '#0f1a2f', accent: '#c7d0de' } },
        { id: 'hard_dog_void', label: 'Void Hound', difficulty: 'hard', unlockTime: 150, variant: 'dog', palette: { base: '#2f233d', ears: '#59416d', eyes: '#b08bff', accent: '#f0d4ff' } }
    ];

    const ENEMY_SKINS = [
        { id: 'easy_wolf_frost', label: 'Frost Wolf', difficulty: 'easy', unlockTime: 0, variant: 'wolf', palette: { base: '#9ea3b0', ears: '#6f7684', eyes: '#0d1117', sclera: '#fefefe' } },
        { id: 'easy_wolf_shadow', label: 'Shadow Wolf', difficulty: 'easy', unlockTime: 100, variant: 'wolf', palette: { base: '#4a4f5c', ears: '#2f343f', eyes: '#00e1ff', sclera: '#08161b' } },
        { id: 'easy_wolf_crimson', label: 'Crimson Wolf', difficulty: 'easy', unlockTime: 180, variant: 'wolf', palette: { base: '#b94141', ears: '#751e1e', eyes: '#ffe6c7', sclera: '#2a0000' } },
        { id: 'medium_bull_forge', label: 'Forge Bull', difficulty: 'medium', unlockTime: 0, variant: 'bull', palette: { base: '#b33c24', horns: '#f0d6a8', eyes: '#340c00', sclera: '#ffd6bf' } },
        { id: 'medium_bull_onyx', label: 'Onyx Bull', difficulty: 'medium', unlockTime: 110, variant: 'bull', palette: { base: '#2b2d42', horns: '#c0c7d6', eyes: '#f3b61f', sclera: '#0a0a0a' } },
        { id: 'medium_bull_storm', label: 'Storm Bull', difficulty: 'medium', unlockTime: 190, variant: 'bull', palette: { base: '#556ee6', horns: '#ebeefc', eyes: '#101a56', sclera: '#d7e4ff' } },
        { id: 'hard_demon_crimson', label: 'Crimson Demon', difficulty: 'hard', unlockTime: 0, variant: 'demon', palette: { base: '#6a1ea1', horns: '#f3f3f3', eyes: '#ffe600', sclera: '#240024' } },
        { id: 'hard_demon_glacier', label: 'Glacier Demon', difficulty: 'hard', unlockTime: 100, variant: 'demon', palette: { base: '#45c5f5', horns: '#eff9ff', eyes: '#071f2c', sclera: '#bde8f7' } },
        { id: 'hard_demon_abyss', label: 'Abyss Demon', difficulty: 'hard', unlockTime: 170, variant: 'demon', palette: { base: '#1a0026', horns: '#b084f2', eyes: '#f45b69', sclera: '#16000f' } }
    ];

    const PLAYER_SKIN_MAP = mapSkins(PLAYER_SKINS);
    const ENEMY_SKIN_MAP = mapSkins(ENEMY_SKINS);

    let selectedPlayerSkin = PLAYER_SKINS[0].id;
    let selectedEnemySkin = ENEMY_SKINS[0].id;

    const skinButtons = { player: {}, enemy: {} };
    const bestScoreLabels = {};

    const keys = { w: false, a: false, s: false, d: false };
    const keysP2 = { up: false, left: false, down: false, right: false };

    // Mobile detection
    function isMobileDevice() {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 768;
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return hasTouch && (isSmallScreen || isMobileUA);
    }

    const isMobile = isMobileDevice();

    // Joystick state
    const joystick = {
        active: false,
        x: 0,
        y: 0,
        baseX: 0,
        baseY: 0,
        stickX: 0,
        stickY: 0,
        radius: 50, // Base radius
        stickRadius: 25, // Stick radius
        maxDistance: 50 // Max distance stick can move from center
    };

    let difficultyIndex = 0;
    let bestTimes = loadBestTimes();
    migrateLegacyBestScore();

    let particles = [];
    let playerBall = null;
    let player2Ball = null;
    let gameMode = localStorage.getItem('gameMode') || 'single'; // 'single' or 'multiplayer'
    let chaosMode = localStorage.getItem('chaosMode') === 'true'; // Chaos mode toggle
    const collisionCooldown = new Map(); // Track collision cooldowns for chaos mode
    
    // Expose game state to window for browser automation
    window.gameState = {
        getParticles: () => particles,
        getPlayer: () => playerBall,
        getPlayer2: () => player2Ball,
        getEnemies: () => particles.filter(p => !p.isPlayer),
        getGameMode: () => gameMode
    };

    const gameState = {
        playing: false,
        paused: false,
        startTime: 0,
        startTimeP2: 0,
        spawnInterval: null,
        powerUpSpawnInterval: null,
        health: 3,
        healthP2: 3,
        maxHealth: 3,
        combo: 0,
        comboP2: 0,
        comboTime: 0,
        comboTimeP2: 0,
        lastDodgeTime: 0,
        lastDodgeTimeP2: 0,
        player1Dead: false,
        player2Dead: false,
        screenShake: { x: 0, y: 0, intensity: 0 },
        // Stackable power-up system (shared in multiplayer, per player in single)
        powerUpStacks: {
            shield: { count: 0, duration: 0, maxStack: 5 },
            slowmo: { count: 0, duration: 0, maxStack: 5 },
            speed: { count: 0, duration: 0, maxStack: 5 }
        },
        powerUpStacksP2: {
            shield: { count: 0, duration: 0, maxStack: 5 },
            slowmo: { count: 0, duration: 0, maxStack: 5 },
            speed: { count: 0, duration: 0, maxStack: 5 }
        },
        powerUpStatsP1: { total: 0 },
        powerUpStatsP2: { total: 0 }
    };

    // Power-ups
    const POWER_UPS = {
        SHIELD: { id: 'shield', duration: 5000, color: '#00BFFF', icon: '🛡️', spawnWeight: 30 },
        SLOW_MOTION: { id: 'slowmo', duration: 4000, color: '#9B59B6', icon: '⏱️', spawnWeight: 25 },
        SPEED_BOOST: { id: 'speed', duration: 6000, color: '#FFD700', icon: '⚡', spawnWeight: 25 },
        HEALTH: { id: 'health', restoreAmount: 1, color: '#FF4444', icon: '❤️', spawnWeight: 20 }
    };

    let powerUps = [];
    let visualParticles = [];
    let visualEffects = [];
    let trails = [];
    let stats = {
        totalPlayTime: 0,
        totalEnemiesDodged: 0,
        totalPowerUpsCollected: 0,
        bestCombo: 0,
        totalDeaths: 0
    };

    // Settings
    const settings = {
        masterVolume: 100,
        sfxVolume: 100,
        musicVolume: 70,
        particlesEnabled: true,
        screenShakeEnabled: true,
        trailsEnabled: true
    };

    // Music System - Procedural Chiptune Generator
    const musicManager = {
        currentTrack: null,
        audioContext: null,
        oscillator: null,
        gainNode: null,
        isPlaying: false,
        volume: 0.7,
        currentBPM: 120,
        noteIndex: 0,
        melodyInterval: null
    };

    // Chiptune melody patterns (frequencies in Hz)
    const melodies = {
        menu: [262, 294, 330, 349, 392, 440, 494, 523], // C major scale
        easy: [330, 349, 392, 440, 494, 523, 587, 659], // E major scale
        medium: [392, 440, 494, 523, 587, 659, 698, 784], // G major scale
        hard: [523, 587, 659, 698, 784, 880, 988, 1047], // C major scale (higher)
        gameOver: [220, 196, 175, 165, 147] // Descending notes
    };

    function initMusic() {
        try {
            if (!musicManager.audioContext) {
                musicManager.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        } catch (e) {
            console.warn('Music not supported:', e);
        }
    }

    function playMusic(trackName, bpm = 120) {
        if (!musicManager.audioContext) {
            initMusic();
            if (!musicManager.audioContext) return;
        }

        stopMusic();
        
        musicManager.currentTrack = trackName;
        musicManager.currentBPM = bpm;
        musicManager.noteIndex = 0;
        musicManager.isPlaying = true;

        const melody = melodies[trackName] || melodies.menu;
        const noteDuration = (60 / bpm) * 0.5; // Half note duration

        function playNextNote() {
            if (!musicManager.isPlaying) return;

            const frequency = melody[musicManager.noteIndex % melody.length];
            musicManager.noteIndex++;

            // Create oscillator for this note
            const osc = musicManager.audioContext.createOscillator();
            const gain = musicManager.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(musicManager.audioContext.destination);
            
            osc.type = 'square'; // Chiptune sound
            osc.frequency.value = frequency;
            
            // Envelope: quick attack, sustain, release
            const now = musicManager.audioContext.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(settings.musicVolume / 100 * 0.15, now + 0.01);
            gain.gain.linearRampToValueAtTime(settings.musicVolume / 100 * 0.1, now + noteDuration * 0.7);
            gain.gain.linearRampToValueAtTime(0, now + noteDuration);
            
            osc.start(now);
            osc.stop(now + noteDuration);

            // Schedule next note
            musicManager.melodyInterval = setTimeout(playNextNote, noteDuration * 1000);
        }

        playNextNote();
    }

    function stopMusic() {
        musicManager.isPlaying = false;
        if (musicManager.melodyInterval) {
            clearTimeout(musicManager.melodyInterval);
            musicManager.melodyInterval = null;
        }
        musicManager.currentTrack = null;
    }

    function setMusicVolume(volume) {
        settings.musicVolume = volume;
        musicManager.volume = volume / 100;
        saveSettings();
    }

    // Audio context for sound effects
    let audioContext = null;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function mapSkins(list) {
        return list.reduce((acc, skin) => {
            acc[skin.id] = skin;
            return acc;
        }, {});
    }

    function loadBestTimes() {
        try {
            const stored = localStorage.getItem(BEST_TIMES_KEY);
            if (!stored) return { ...BEST_TIME_DEFAULTS };
            const parsed = JSON.parse(stored);
            
            // Migrate old format to new format
            const migrated = { ...BEST_TIME_DEFAULTS };
            Object.keys(parsed || {}).forEach(key => {
                if (typeof parsed[key] === 'number') {
                    // Old format - migrate to new
                    migrated[key] = { normal: parsed[key], chaos: 0 };
                } else {
                    // New format
                    migrated[key] = {
                        normal: parsed[key]?.normal || 0,
                        chaos: parsed[key]?.chaos || 0
                    };
                }
            });
            return migrated;
        } catch {
            return { ...BEST_TIME_DEFAULTS };
        }
    }

    function saveBestTimes() {
        localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(bestTimes));
    }

    function migrateLegacyBestScore() {
        const legacy = localStorage.getItem('bestScore');
        if (!legacy) return;
        const value = parseInt(legacy, 10);
        if (!Number.isNaN(value)) {
            bestTimes.easy = Math.max(bestTimes.easy, value);
            saveBestTimes();
        }
        localStorage.removeItem('bestScore');
    }

    function loadStats() {
        try {
            const stored = localStorage.getItem('gravityStats');
            if (stored) {
                Object.assign(stats, JSON.parse(stored));
            }
        } catch (e) {
            console.warn('Failed to load stats', e);
        }
    }

    function saveStats() {
        try {
            localStorage.setItem('gravityStats', JSON.stringify(stats));
        } catch (e) {
            console.warn('Failed to save stats', e);
        }
    }

    function loadSettings() {
        try {
            const stored = localStorage.getItem('gravitySettings');
            if (stored) {
                Object.assign(settings, JSON.parse(stored));
                applySettings();
            }
        } catch (e) {
            console.warn('Failed to load settings', e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem('gravitySettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    }

    function applySettings() {
        if (domElements.masterVolume) {
            domElements.masterVolume.value = settings.masterVolume;
            domElements.masterVolumeValue.textContent = settings.masterVolume;
        }
        if (domElements.sfxVolume) {
            domElements.sfxVolume.value = settings.sfxVolume;
            domElements.sfxVolumeValue.textContent = settings.sfxVolume;
        }
        if (domElements.musicVolume) {
            domElements.musicVolume.value = settings.musicVolume;
            domElements.musicVolumeValue.textContent = settings.musicVolume;
        }
        if (domElements.particlesEnabled) {
            domElements.particlesEnabled.checked = settings.particlesEnabled;
        }
        if (domElements.screenShakeEnabled) {
            domElements.screenShakeEnabled.checked = settings.screenShakeEnabled;
        }
        if (domElements.trailsEnabled) {
            domElements.trailsEnabled.checked = settings.trailsEnabled;
        }
        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        if (!domElements.statsDisplay) return;
        
        domElements.statsDisplay.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Total Play Time</div>
                <div class="stat-value">${Math.floor(stats.totalPlayTime / 60)}m ${stats.totalPlayTime % 60}s</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Enemies Dodged</div>
                <div class="stat-value">${stats.totalEnemiesDodged}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Power-ups Collected</div>
                <div class="stat-value">${stats.totalPowerUpsCollected}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Best Combo</div>
                <div class="stat-value">${stats.bestCombo}x</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Deaths</div>
                <div class="stat-value">${stats.totalDeaths}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Avg Survival</div>
                <div class="stat-value">${stats.totalDeaths > 0 ? Math.floor(stats.totalPlayTime / stats.totalDeaths) : 0}s</div>
            </div>
        `;
    }

    function getCurrentDifficulty() {
        return DIFFICULTY_LEVELS[difficultyIndex];
    }

    function isSkinUnlocked(skin) {
        const required = skin.unlockTime || 0;
        const best = bestTimes[skin.difficulty] || { normal: 0, chaos: 0 };
        // Check both normal and chaos mode times
        return Math.max(best.normal, best.chaos) >= required;
    }

    function getFirstUnlockedSkinId(list) {
        const unlocked = list.find((skin) => isSkinUnlocked(skin));
        return unlocked ? unlocked.id : list[0].id;
    }

    function ensureValidSkinSelections() {
        if (!isSkinUnlocked(PLAYER_SKIN_MAP[selectedPlayerSkin])) {
            selectedPlayerSkin = getFirstUnlockedSkinId(PLAYER_SKINS);
        }
        if (!isSkinUnlocked(ENEMY_SKIN_MAP[selectedEnemySkin])) {
            selectedEnemySkin = getFirstUnlockedSkinId(ENEMY_SKINS);
        }
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // ============================================
    // AUDIO SYSTEM
    // ============================================

    function playSound(frequency, duration, type = 'sine', volume = 0.3) {
        if (!audioContext || settings.masterVolume === 0 || settings.sfxVolume === 0) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        const vol = (volume * settings.masterVolume * settings.sfxVolume) / 10000;
        gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    function playCollectSound() {
        playSound(800, 0.1, 'sine', 0.2);
    }

    function playHitSound() {
        playSound(200, 0.2, 'sawtooth', 0.4);
    }

    function playNearMissSound() {
        playSound(600, 0.15, 'sine', 0.15);
    }

    function playPowerUpSound() {
        playSound(1000, 0.2, 'sine', 0.3);
    }

    // ============================================
    // POWER-UP SYSTEM
    // ============================================

    function spawnPowerUp() {
        if (!gameState.playing || powerUps.length >= 2) return;
        
        // Weighted random selection (exclude removed shockwave)
        const types = Object.values(POWER_UPS);
        const totalWeight = types.reduce((sum, type) => sum + (type.spawnWeight || 25), 0);
        let random = Math.random() * totalWeight;
        
        let type = types[0];
        for (const t of types) {
            random -= (t.spawnWeight || 25);
            if (random <= 0) {
                type = t;
                break;
            }
        }
        
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const canvas = domElements.canvas;
        
        if (side === 0) {
            x = Math.random() * canvas.width;
            y = -CONFIG.spawnOffset;
        } else if (side === 1) {
            x = canvas.width + CONFIG.spawnOffset;
            y = Math.random() * canvas.height;
        } else if (side === 2) {
            x = Math.random() * canvas.width;
            y = canvas.height + CONFIG.spawnOffset;
        } else {
            x = -CONFIG.spawnOffset;
            y = Math.random() * canvas.height;
        }
        
        powerUps.push({
            x, y,
            type: type.id,
            radius: 15,
            color: type.color,
            icon: type.icon,
            rotation: 0,
            pulse: 0
        });
    }

    function playHealSound() {
        if (typeof playSound === 'function') {
            playSound(1200, 0.15, 'sine', 0.25);
        }
    }

    function collectPowerUp(powerUp, playerId = 1) {
        const index = powerUps.indexOf(powerUp);
        if (index > -1) {
            powerUps.splice(index, 1);
            if (typeof playPowerUpSound === 'function') {
                playPowerUpSound();
            }
            stats.totalPowerUpsCollected++;
            
            // Track power-up collection per player
            if (playerId === 1) {
                if (!gameState.powerUpStatsP1) gameState.powerUpStatsP1 = { total: 0 };
                gameState.powerUpStatsP1.total++;
            } else {
                if (!gameState.powerUpStatsP2) gameState.powerUpStatsP2 = { total: 0 };
                gameState.powerUpStatsP2.total++;
            }
            
            const now = Date.now();
            // Use appropriate power-up stack based on player
            const stack = (playerId === 2 && gameMode === 'multiplayer') ? 
                gameState.powerUpStacksP2?.[powerUp.type] : gameState.powerUpStacks?.[powerUp.type];
            
            if (!stack) return; // Safety check
            
            switch (powerUp.type) {
                case 'shield':
                    if (stack.count < stack.maxStack) {
                        stack.count++;
                        stack.duration = now + (POWER_UPS.SHIELD.duration * stack.count);
                    } else {
                        // Max stack reached, refresh duration
                        stack.duration = now + POWER_UPS.SHIELD.duration;
                    }
                    break;
                case 'slowmo':
                    if (stack.count < stack.maxStack) {
                        stack.count++;
                        stack.duration = now + (POWER_UPS.SLOW_MOTION.duration * stack.count);
                    } else {
                        stack.duration = now + POWER_UPS.SLOW_MOTION.duration;
                    }
                    break;
                case 'speed':
                    if (stack.count < stack.maxStack) {
                        stack.count++;
                        stack.duration = now + (POWER_UPS.SPEED_BOOST.duration * stack.count);
                    } else {
                        stack.duration = now + POWER_UPS.SPEED_BOOST.duration;
                    }
                    break;
                case 'health':
                    // Restore health for appropriate player
                    if (playerId === 1 || gameMode === 'single') {
                        if (gameState.health < gameState.maxHealth && !gameState.player1Dead) {
                            gameState.health = Math.min(gameState.maxHealth, gameState.health + POWER_UPS.HEALTH.restoreAmount);
                            if (typeof updateHealthBar === 'function') {
                                updateHealthBar();
                            }
                            playHealSound();
                            if (typeof createParticleExplosion === 'function' && playerBall) {
                                createParticleExplosion(playerBall.x, playerBall.y, '#FF4444', 10);
                            }
                        }
                    } else if (playerId === 2 && gameMode === 'multiplayer') {
                        if (gameState.healthP2 < gameState.maxHealth && !gameState.player2Dead) {
                            gameState.healthP2 = Math.min(gameState.maxHealth, gameState.healthP2 + POWER_UPS.HEALTH.restoreAmount);
                            if (typeof updateHealthBarP2 === 'function') {
                                updateHealthBarP2();
                            }
                            playHealSound();
                            if (typeof createParticleExplosion === 'function' && player2Ball) {
                                createParticleExplosion(player2Ball.x, player2Ball.y, '#FF4444', 10);
                            }
                        }
                    }
                    break;
            }
            if (typeof updatePowerUpIndicators === 'function') {
                updatePowerUpIndicators();
            }
        }
    }

    function updatePowerUpIndicators() {
        const now = Date.now();
        
        // Clear both containers
        if (domElements.powerUpIndicatorsP1) {
            domElements.powerUpIndicatorsP1.innerHTML = '';
        }
        if (domElements.powerUpIndicatorsP2 && gameMode === 'multiplayer') {
            domElements.powerUpIndicatorsP2.innerHTML = '';
        }
        
        // Update for Player 1
        updatePlayerPowerUpIndicators(1, now, domElements.powerUpIndicatorsP1);
        
        // Update for Player 2 (if multiplayer)
        if (gameMode === 'multiplayer' && domElements.powerUpIndicatorsP2) {
            updatePlayerPowerUpIndicators(2, now, domElements.powerUpIndicatorsP2);
        }
    }

    function updatePlayerPowerUpIndicators(playerId, now, container) {
        if (!container) return; // Safety check
        
        const stacks = playerId === 1 ? gameState.powerUpStacks : gameState.powerUpStacksP2;
        const prefix = gameMode === 'multiplayer' ? (playerId === 1 ? 'P1: ' : 'P2: ') : '';
        
        // Shield
        if (stacks.shield.count > 0 && now < stacks.shield.duration) {
            const indicator = document.createElement('div');
            indicator.className = 'powerup-indicator active';
            const count = stacks.shield.count;
            indicator.textContent = `${prefix}${POWER_UPS.SHIELD.icon} Shield${count > 1 ? ` x${count}` : ''}`;
            container.appendChild(indicator);
        }
        
        // Slow Motion
        if (stacks.slowmo.count > 0 && now < stacks.slowmo.duration) {
            const indicator = document.createElement('div');
            indicator.className = 'powerup-indicator active';
            const count = stacks.slowmo.count;
            indicator.textContent = `${prefix}${POWER_UPS.SLOW_MOTION.icon} Slow Motion${count > 1 ? ` x${count}` : ''}`;
            container.appendChild(indicator);
        }
        
        // Speed Boost
        if (stacks.speed.count > 0 && now < stacks.speed.duration) {
            const indicator = document.createElement('div');
            indicator.className = 'powerup-indicator active';
            const count = stacks.speed.count;
            indicator.textContent = `${prefix}${POWER_UPS.SPEED_BOOST.icon} Speed Boost${count > 1 ? ` x${count}` : ''}`;
            container.appendChild(indicator);
        }
    }

    // ============================================
    // VISUAL EFFECTS
    // ============================================

    function createParticleExplosion(x, y, color, count = 10, enemyType = null) {
        if (!settings.particlesEnabled) return;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            let particleColor = color;
            let particleRadius = 2 + Math.random() * 3;
            
            // Type-specific particle effects
            if (enemyType === 'fast') {
                // Fast enemies: Smaller, brighter sparks
                particleRadius = 1 + Math.random() * 2;
                particleColor = '#FFAA00';
                // Add some variety to fast enemy particles
                const rgb = hexToRgb(particleColor);
                particleColor = `rgb(${Math.min(255, rgb.r + Math.random() * 50)}, ${Math.min(255, rgb.g + Math.random() * 30)}, ${rgb.b})`;
            } else if (enemyType === 'slow') {
                // Slow enemies: Larger, chunkier particles
                particleRadius = 3 + Math.random() * 4;
                particleColor = '#8B0000';
            }
            
            visualParticles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: particleRadius,
                color: particleColor,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5
            });
        }
    }

    function addScreenShake(intensity) {
        if (!settings.screenShakeEnabled) return;
        gameState.screenShake.intensity = Math.max(gameState.screenShake.intensity, intensity);
    }

    function updateScreenShake() {
        if (gameState.screenShake.intensity > 0) {
            gameState.screenShake.x = (Math.random() - 0.5) * gameState.screenShake.intensity;
            gameState.screenShake.y = (Math.random() - 0.5) * gameState.screenShake.intensity;
            gameState.screenShake.intensity *= 0.9;
            if (gameState.screenShake.intensity < 0.1) {
                gameState.screenShake.intensity = 0;
                gameState.screenShake.x = 0;
                gameState.screenShake.y = 0;
            }
        }
    }

    // ============================================
    // UI HELPERS
    // ============================================

    function applyDifficultySettings() {
        const settings = getCurrentDifficulty();
        CONFIG.moveSpeed = settings.moveSpeed;
        CONFIG.gravityStrength = settings.gravityStrength;
        CONFIG.enemySpeedMultiplier = settings.enemySpeedMultiplier;
        CONFIG.spawnInterval = settings.spawnInterval;
        domElements.difficultyLabel.textContent = settings.label;
        domElements.difficultyIndicator.textContent = settings.label;
        updateScoreDisplays();
    }

    function updateScoreDisplays() {
        const diffId = getCurrentDifficulty().id;
        const best = bestTimes[diffId] || { normal: 0, chaos: 0 };
        const bestTime = chaosMode ? best.chaos : best.normal;
        if (domElements.bestDisplay) {
            domElements.bestDisplay.textContent = bestTime;
        }
    }

    function updateTimeDisplay(runtimeSeconds) {
        if (domElements.timeDisplay) {
            domElements.timeDisplay.textContent = runtimeSeconds;
        }
        const diffId = getCurrentDifficulty().id;
        const best = bestTimes[diffId] || { normal: 0, chaos: 0 };
        const bestTime = chaosMode ? best.chaos : best.normal;
        if (runtimeSeconds > bestTime && domElements.bestDisplay) {
            domElements.bestDisplay.textContent = runtimeSeconds;
        }
    }

    function updateBestScoresList() {
        DIFFICULTY_LEVELS.forEach((level) => {
            const labels = bestScoreLabels[level.id];
            if (labels) {
                const best = bestTimes[level.id] || { normal: 0, chaos: 0 };
                labels.normal.textContent = best.normal > 0 ? `${best.normal}s` : '--';
                labels.chaos.textContent = best.chaos > 0 ? `${best.chaos}s` : '--';
            }
        });
    }

    function buildBestScoresList() {
        if (!domElements.bestScoresList) return;
        domElements.bestScoresList.innerHTML = '';
        DIFFICULTY_LEVELS.forEach((level) => {
            const li = document.createElement('li');
            li.className = 'best-score-item';
            
            const label = document.createElement('span');
            label.className = 'best-score-label';
            label.textContent = level.label;
            
            const scoresContainer = document.createElement('div');
            scoresContainer.className = 'best-score-values';
            
            const normalScore = document.createElement('span');
            normalScore.className = 'score-value normal-score';
            const normal = bestTimes[level.id]?.normal || 0;
            normalScore.textContent = normal > 0 ? `${normal}s` : '--';
            
            const chaosScore = document.createElement('span');
            chaosScore.className = 'score-value chaos-score';
            const chaos = bestTimes[level.id]?.chaos || 0;
            chaosScore.textContent = chaos > 0 ? `${chaos}s` : '--';
            
            const separator = document.createElement('span');
            separator.className = 'score-separator';
            separator.textContent = ' | ';
            
            scoresContainer.appendChild(normalScore);
            scoresContainer.appendChild(separator);
            scoresContainer.appendChild(chaosScore);
            
            li.appendChild(label);
            li.appendChild(scoresContainer);
            domElements.bestScoresList.appendChild(li);
            
            bestScoreLabels[level.id] = { normal: normalScore, chaos: chaosScore };
        });
        updateBestScoresList();
    }

    function showModal(modal) {
        if (modal) modal.classList.remove('hidden');
    }

    function hideModal(modal) {
        if (modal) modal.classList.add('hidden');
    }

    function hideStartScreen() {
        if (domElements.startScreen) domElements.startScreen.classList.add('hidden');
        // Show game UI elements when game starts
        if (domElements.player1UI) {
            domElements.player1UI.classList.remove('hidden');
        }
        if (gameMode === 'multiplayer' && domElements.player2UI) {
            domElements.player2UI.classList.remove('hidden');
        }
    }

    function showStartScreen() {
        if (domElements.startScreen) {
            domElements.startScreen.classList.remove('hidden');
        }
        // Hide game UI elements when start screen is visible
        if (domElements.player1UI) {
            domElements.player1UI.classList.add('hidden');
        }
        if (domElements.player2UI) {
            domElements.player2UI.classList.add('hidden');
        }
        if (domElements.powerUpIndicatorsP1) {
            domElements.powerUpIndicatorsP1.innerHTML = '';
        }
        // Hide joystick when returning to menu
        if (isMobile && domElements.joystickContainer) {
            domElements.joystickContainer.classList.add('hidden');
            resetJoystick();
        }
        if (domElements.powerUpIndicatorsP2) {
            domElements.powerUpIndicatorsP2.innerHTML = '';
        }
    }

    function updateLastRunMessage(time, difficultyLabel) {
        if (typeof time === 'number') {
            domElements.lastRunInfo.textContent = `Last run: ${time}s · ${difficultyLabel}`;
            domElements.lastRunInfo.classList.remove('hidden');
        }
    }

    function createSkinButtons(list, container, type) {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        const groupedByDifficulty = {
            easy: [],
            medium: [],
            hard: []
        };

        list.forEach((skin) => {
            groupedByDifficulty[skin.difficulty].push(skin);
        });

        ['easy', 'medium', 'hard'].forEach((difficulty) => {
            if (groupedByDifficulty[difficulty].length === 0) return;

            const row = document.createElement('div');
            row.className = 'difficulty-row';

            const header = document.createElement('div');
            header.className = 'difficulty-row-header';
            header.textContent = capitalize(difficulty);

            const skinsContainer = document.createElement('div');
            skinsContainer.className = 'difficulty-row-skins';

            groupedByDifficulty[difficulty].forEach((skin) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'skin-option';
                button.dataset.difficulty = skin.difficulty;

                const preview = document.createElement('canvas');
                preview.width = 70;
                preview.height = 70;
                const previewCtx = preview.getContext('2d');
                renderSkin(previewCtx, skin, preview.width / 2, preview.height / 2, 20);

                const label = document.createElement('span');
                label.textContent = skin.label;

                const difficultyTag = document.createElement('span');
                difficultyTag.className = 'skin-difficulty';
                difficultyTag.textContent = capitalize(skin.difficulty);

                const lockIcon = document.createElement('span');
                lockIcon.className = 'lock-icon';
                lockIcon.textContent = '🔒';

                button.appendChild(preview);
                button.appendChild(label);
                button.appendChild(difficultyTag);
                button.appendChild(lockIcon);

                button.addEventListener('click', (e) => {
                    if (button.classList.contains('locked')) return;
                    createRipple(e, button);
                    if (type === 'player') {
                        setPlayerSkin(skin.id);
                    } else {
                        setEnemySkin(skin.id);
                    }
                });

                skinsContainer.appendChild(button);
                skinButtons[type][skin.id] = button;
            });

            row.appendChild(header);
            row.appendChild(skinsContainer);
            fragment.appendChild(row);
        });

        container.appendChild(fragment);
        refreshSkinLocks(type);
        updateSkinSelection(type);
    }

    function createRipple(event, button) {
        if (!button || !event) return;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function refreshSkinLocks(type) {
        const list = type === 'player' ? PLAYER_SKINS : ENEMY_SKINS;
        list.forEach((skin) => {
            const button = skinButtons[type][skin.id];
            if (!button) return;
            const unlocked = isSkinUnlocked(skin);
            button.classList.toggle('locked', !unlocked);
            button.disabled = !unlocked;
            if (!unlocked) {
                button.dataset.tooltip = `🔒 Locked\nUnlock by surviving ${skin.unlockTime}s in ${capitalize(skin.difficulty)} difficulty`;
            } else {
                button.removeAttribute('data-tooltip');
            }
        });
    }

    function refreshAllSkinLocks() {
        refreshSkinLocks('player');
        refreshSkinLocks('enemy');
        ensureValidSkinSelections();
        updateSkinSelection('player');
        updateSkinSelection('enemy');
    }

    function updateSkinSelection(type) {
        const activeId = type === 'player' ? selectedPlayerSkin : selectedEnemySkin;
        Object.entries(skinButtons[type]).forEach(([id, button]) => {
            button.classList.toggle('selected', id === activeId);
        });
    }

    function setPlayerSkin(id) {
        if (!PLAYER_SKIN_MAP[id] || !isSkinUnlocked(PLAYER_SKIN_MAP[id])) return;
        selectedPlayerSkin = id;
        updateSkinSelection('player');
        if (playerBall) {
            playerBall.skin = id;
        }
    }

    function setEnemySkin(id) {
        if (!ENEMY_SKIN_MAP[id] || !isSkinUnlocked(ENEMY_SKIN_MAP[id])) return;
        selectedEnemySkin = id;
        updateSkinSelection('enemy');
        particles.forEach((p) => {
            if (!p.isPlayer) {
                p.skin = id;
            }
        });
    }

    // ============================================
    // DRAW HELPERS
    // ============================================

    // Enhanced shadow rendering
    function drawCharacterShadow(ctx, x, y, radius) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        
        // Elliptical shadow (ground projection) for depth
        const shadowGradient = ctx.createRadialGradient(
            x, y + radius * 0.5, 0,
            x, y + radius * 0.5, radius * 1.5
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.ellipse(x, y + radius * 0.5, radius * 1.2, radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawBaseCircle(ctx, x, y, radius, color) {
        ctx.save();
        
        // Draw shadow first (beneath character)
        drawCharacterShadow(ctx, x, y, radius);
        
        // Enhanced multi-layer outline for depth
        // Outer glow outline
        ctx.strokeStyle = rgbaToString(hexToRgb(color), 0.2);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, radius + 1, 0, Math.PI * 2);
        ctx.stroke();
        
        // Main outline (darker, weighted at bottom)
        const outlineGradient = ctx.createLinearGradient(x, y - radius, x, y + radius);
        outlineGradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        outlineGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
        outlineGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.strokeStyle = outlineGradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner outline for definition
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.95, 0, Math.PI * 2);
        ctx.stroke();
        
        // Enhanced 3D sphere gradient with multiple stops
        const lightX = x - radius * 0.35;
        const lightY = y - radius * 0.35;
        const gradient = ctx.createRadialGradient(lightX, lightY, 0, x, y, radius * 1.2);
        const rgb = hexToRgb(color);
        
        // Light source (bright highlight)
        const lightColor = lighten(color, 35);
        gradient.addColorStop(0, rgbaToString(lightColor, 1));
        
        // Mid-highlight
        const midLight = lighten(color, 15);
        gradient.addColorStop(0.3, rgbaToString(midLight, 1));
        
        // Base color
        gradient.addColorStop(0.6, color);
        
        // Shadow area
        const shadowColor = darken(color, 25);
        gradient.addColorStop(0.9, rgbaToString(shadowColor, 1));
        
        // Deep shadow at edges
        const deepShadow = darken(color, 40);
        gradient.addColorStop(1, rgbaToString(deepShadow, 1));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Specular highlight (shiny spot)
        const highlightGradient = ctx.createRadialGradient(
            lightX, lightY, 0,
            lightX, lightY, radius * 0.5
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(lightX, lightY, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Rim lighting (edge glow)
        const rimGradient = ctx.createRadialGradient(x, y, radius * 0.85, x, y, radius);
        rimGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rimGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
        rimGradient.addColorStop(1, rgbaToString(lighten(color, 20), 0.3));
        ctx.fillStyle = rimGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    // Color manipulation helpers for enhanced rendering
    function lighten(color, percent) {
        const rgb = typeof color === 'string' ? hexToRgb(color) : color;
        return {
            r: Math.min(255, rgb.r + (255 - rgb.r) * percent / 100),
            g: Math.min(255, rgb.g + (255 - rgb.g) * percent / 100),
            b: Math.min(255, rgb.b + (255 - rgb.b) * percent / 100)
        };
    }

    function darken(color, percent) {
        const rgb = typeof color === 'string' ? hexToRgb(color) : color;
        return {
            r: Math.max(0, rgb.r * (1 - percent / 100)),
            g: Math.max(0, rgb.g * (1 - percent / 100)),
            b: Math.max(0, rgb.b * (1 - percent / 100))
        };
    }

    function rgbToString(rgb) {
        return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    }

    function rgbaToString(rgb, alpha) {
        return `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${alpha})`;
    }

    function drawTriangle(ctx, x, y, width, height, color) {
        ctx.save();
        
        // Enhanced triangle with gradient and outline
        const centerX = x + width / 2;
        const centerY = y + height / 3;
        
        // Gradient for depth
        const gradient = ctx.createLinearGradient(x, y, centerX, centerY);
        const rgb = hexToRgb(color);
        const lightColor = lighten(color, 20);
        const darkColor = darken(color, 15);
        gradient.addColorStop(0, rgbaToString(lightColor, 1));
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, rgbaToString(darkColor, 1));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width / 2, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Outline
        ctx.strokeStyle = rgbaToString(darken(color, 30), 0.6);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
    }

    function drawEyes(ctx, x, y, radius, pupilColor, scleraColor = '#fff', slanted = false, blinkState = 0) {
        ctx.save();
        const eyeOffsetX = radius * 0.4;
        const eyeOffsetY = radius * 0.1;
        const eyeRadiusX = radius * 0.35;
        const eyeRadiusY = slanted ? radius * 0.2 : radius * 0.3;
        
        // Apply blink animation
        const eyeScaleY = 1 - blinkState * 0.9; // Squash eyes when blinking

        // Enhanced eye rendering with depth
        function drawSingleEye(eyeX, eyeY) {
            // Eye shadow/eyelid
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY - eyeRadiusY * 0.3, eyeRadiusX * 1.1, eyeRadiusY * 0.4, slanted ? (eyeX < x ? -0.4 : 0.4) : 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Apply blink scaling
            ctx.save();
            ctx.translate(eyeX, eyeY);
            ctx.scale(1, eyeScaleY);
            ctx.translate(-eyeX, -eyeY);
            
            // Sclera (white of eye) with gradient
            const scleraGradient = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, eyeRadiusX);
            scleraGradient.addColorStop(0, '#ffffff');
            scleraGradient.addColorStop(0.7, scleraColor);
            const darkSclera = darken(scleraColor, 10);
            scleraGradient.addColorStop(1, rgbToString(darkSclera));
            ctx.fillStyle = scleraGradient;
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, eyeRadiusX, eyeRadiusY, slanted ? (eyeX < x ? -0.4 : 0.4) : 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye outline (thicker, more defined)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, eyeRadiusX, eyeRadiusY, slanted ? (eyeX < x ? -0.4 : 0.4) : 0, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner eye outline for depth
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, eyeRadiusX * 0.9, eyeRadiusY * 0.9, slanted ? (eyeX < x ? -0.4 : 0.4) : 0, 0, Math.PI * 2);
            ctx.stroke();

            // Only draw iris/pupil if not fully blinked
            if (blinkState < 0.8) {
                // Iris with detailed gradient
                const pupilRadius = radius * 0.15;
                const irisRadius = radius * 0.2;
                
                // Iris gradient (colored part)
                const irisGradient = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, irisRadius);
                const irisRgb = hexToRgb(pupilColor);
                
                // Dark center
                irisGradient.addColorStop(0, rgbaToString(darken(pupilColor, 30), 1));
                
                // Mid iris
                irisGradient.addColorStop(0.4, pupilColor);
                
                // Outer iris (lighter)
                irisGradient.addColorStop(0.8, rgbaToString(lighten(pupilColor, 20), 1));
                
                // Iris edge
                irisGradient.addColorStop(1, rgbaToString(darken(pupilColor, 15), 1));
                
                ctx.fillStyle = irisGradient;
                ctx.beginPath();
                ctx.arc(eyeX, eyeY, irisRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Iris outline
                ctx.strokeStyle = rgbaToString(darken(pupilColor, 40), 0.8);
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(eyeX, eyeY, irisRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Pupil (black center)
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(eyeX, eyeY, pupilRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Pupil highlight (main reflection)
                const highlightOffsetX = -pupilRadius * 0.35;
                const highlightOffsetY = -pupilRadius * 0.35;
                const highlightGradient = ctx.createRadialGradient(
                    eyeX + highlightOffsetX, eyeY + highlightOffsetY, 0,
                    eyeX + highlightOffsetX, eyeY + highlightOffsetY, pupilRadius * 0.5
                );
                highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
                highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = highlightGradient;
                ctx.beginPath();
                ctx.arc(eyeX + highlightOffsetX, eyeY + highlightOffsetY, pupilRadius * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Secondary smaller highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(eyeX + highlightOffsetX * 0.5, eyeY + highlightOffsetY * 1.2, pupilRadius * 0.15, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        
        // Draw both eyes
        drawSingleEye(x - eyeOffsetX, y - eyeOffsetY);
        drawSingleEye(x + eyeOffsetX, y - eyeOffsetY);
        
        ctx.restore();
    }

    function drawSpikes(ctx, x, y, radius, color) {
        const spikeWidth = radius * 0.5;
        const spikeHeight = radius * 0.8;
        for (let i = -1; i <= 1; i++) {
            const spikeX = x + i * spikeWidth * 0.6 - spikeWidth / 2;
            // Add shine/highlight to spikes
            ctx.save();
            drawTriangle(ctx, spikeX, y, spikeWidth, -spikeHeight, color);
            // Highlight on spike
            const highlightGradient = ctx.createLinearGradient(
                spikeX, y, 
                spikeX + spikeWidth / 2, y - spikeHeight * 0.3
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.moveTo(spikeX + spikeWidth * 0.2, y);
            ctx.lineTo(spikeX + spikeWidth * 0.5, y - spikeHeight * 0.3);
            ctx.lineTo(spikeX + spikeWidth * 0.8, y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    function drawDroopyEars(ctx, x, y, radius, color) {
        ctx.save();
        ctx.fillStyle = color;
        const earWidth = radius * 0.4;
        const earHeight = radius * 1.1;
        ctx.fillRect(x - radius * 1.1, y - radius * 0.2, earWidth, earHeight);
        ctx.fillRect(x + radius * 0.7, y - radius * 0.2, earWidth, earHeight);
        ctx.restore();
    }

    function drawHorns(ctx, x, y, radius, color, inverted = false) {
        const hornHeight = radius * 0.8 * (inverted ? -1 : 1);
        // Enhanced horns with metallic shine
        ctx.save();
        drawTriangle(ctx, x - radius * 0.9, y - radius * 0.2, radius * 0.8, hornHeight, color);
        drawTriangle(ctx, x + radius * 0.1, y - radius * 0.2, radius * 0.8, hornHeight, color);
        
        // Add metallic shine to horns
        const hornShine = ctx.createLinearGradient(
            x - radius * 0.9, y - radius * 0.2,
            x - radius * 0.5, y - radius * 0.2 + hornHeight * 0.3
        );
        hornShine.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        hornShine.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        hornShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = hornShine;
        ctx.beginPath();
        ctx.moveTo(x - radius * 0.9 + radius * 0.8 * 0.2, y - radius * 0.2);
        ctx.lineTo(x - radius * 0.9 + radius * 0.8 * 0.5, y - radius * 0.2 + hornHeight * 0.3);
        ctx.lineTo(x - radius * 0.9 + radius * 0.8 * 0.8, y - radius * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // Right horn shine
        const hornShine2 = ctx.createLinearGradient(
            x + radius * 0.1, y - radius * 0.2,
            x + radius * 0.5, y - radius * 0.2 + hornHeight * 0.3
        );
        hornShine2.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        hornShine2.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        hornShine2.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = hornShine2;
        ctx.beginPath();
        ctx.moveTo(x + radius * 0.1 + radius * 0.8 * 0.2, y - radius * 0.2);
        ctx.lineTo(x + radius * 0.1 + radius * 0.8 * 0.5, y - radius * 0.2 + hornHeight * 0.3);
        ctx.lineTo(x + radius * 0.1 + radius * 0.8 * 0.8, y - radius * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Texture generation functions
    function drawFurTexture(ctx, x, y, radius, baseColor) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        const furColor = darken(baseColor, 10);
        ctx.fillStyle = rgbToString(furColor);
        
        // Draw multiple small strokes to simulate fur
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const dist = radius * (0.3 + Math.random() * 0.5);
            const furX = x + Math.cos(angle) * dist;
            const furY = y + Math.sin(angle) * dist;
            const furLength = radius * (0.1 + Math.random() * 0.15);
            const furAngle = angle + (Math.random() - 0.5) * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(furX, furY);
            ctx.lineTo(
                furX + Math.cos(furAngle) * furLength,
                furY + Math.sin(furAngle) * furLength
            );
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = rgbToString(furColor);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawScaleTexture(ctx, x, y, radius, baseColor) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        const scaleColor = darken(baseColor, 15);
        ctx.fillStyle = rgbToString(scaleColor);
        
        // Draw overlapping scales
        const scaleSize = radius * 0.15;
        for (let row = -2; row <= 2; row++) {
            for (let col = -2; col <= 2; col++) {
                const scaleX = x + col * scaleSize * 0.8;
                const scaleY = y + row * scaleSize * 0.7;
                const dist = Math.sqrt((scaleX - x) ** 2 + (scaleY - y) ** 2);
                if (dist < radius * 0.9) {
                    ctx.beginPath();
                    ctx.arc(scaleX, scaleY, scaleSize * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    // Scale highlight
                    ctx.fillStyle = rgbaToString(lighten(baseColor, 10), 0.3);
                    ctx.beginPath();
                    ctx.arc(scaleX - scaleSize * 0.2, scaleY - scaleSize * 0.2, scaleSize * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = rgbToString(scaleColor);
                }
            }
        }
        ctx.restore();
    }

    function drawStripes(ctx, x, y, radius, color) {
        ctx.save();
        // Enhanced stripes with gradient
        const stripeGradient = ctx.createLinearGradient(x, y - radius, x, y + radius);
        stripeGradient.addColorStop(0, rgbaToString(hexToRgb(color), 0.3));
        stripeGradient.addColorStop(0.5, rgbaToString(hexToRgb(color), 0.25));
        stripeGradient.addColorStop(1, rgbaToString(hexToRgb(color), 0.3));
        ctx.fillStyle = stripeGradient;
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.2, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y + radius * 0.3, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawSnout(ctx, x, y, radius, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y + radius * 0.2, radius * 0.5, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Animation helpers
    function getBreathingScale(time, speed = 1) {
        return 1 + Math.sin(time * speed * 0.5) * 0.02; // 2% breathing
    }

    function getBlinkState(time) {
        const blinkCycle = time % 5; // Blink every 5 seconds
        if (blinkCycle > 4.9) {
            const blinkProgress = (blinkCycle - 4.9) * 10;
            return Math.min(1, blinkProgress * 2); // Quick blink
        }
        return 0; // Eyes open
    }

    function getIdleRotation(time) {
        return Math.sin(time * 0.3) * 0.02; // ±2 degrees gentle sway
    }

    function renderSkin(ctx, skin, x, y, radius) {
        const time = Date.now() * 0.001;
        const breathingScale = getBreathingScale(time);
        const idleRot = getIdleRotation(time);
        const blinkState = getBlinkState(time);
        
        ctx.save();
        // Apply breathing animation
        ctx.translate(x, y);
        ctx.scale(breathingScale, breathingScale);
        ctx.rotate(idleRot);
        ctx.translate(-x, -y);
        
        switch (skin.variant) {
            case 'cat':
                drawBaseCircle(ctx, x, y, radius, skin.palette.base);
                drawFurTexture(ctx, x, y, radius, skin.palette.base);
                drawTriangle(ctx, x - radius * 0.4, y - radius * 0.2, radius * 0.5, -radius * 0.7, skin.palette.ears);
                drawTriangle(ctx, x + radius * 0.4, y - radius * 0.2, -radius * 0.5, -radius * 0.7, skin.palette.ears);
                if (skin.palette.accent) {
                    drawStripes(ctx, x, y, radius, skin.palette.accent);
                }
                drawEyes(ctx, x, y, radius, skin.palette.eyes, '#fff', false, blinkState);
                break;
            case 'dragon':
                drawBaseCircle(ctx, x, y, radius, skin.palette.base);
                drawScaleTexture(ctx, x, y, radius, skin.palette.base);
                drawSpikes(ctx, x, y - radius * 0.2, radius, skin.palette.spikes);
                drawEyes(ctx, x, y + radius * 0.1, radius, skin.palette.eyes, skin.palette.sclera, true, blinkState);
                break;
            case 'dog':
                drawBaseCircle(ctx, x, y, radius, skin.palette.base);
                drawFurTexture(ctx, x, y, radius, skin.palette.base);
                drawDroopyEars(ctx, x, y, radius, skin.palette.ears);
                if (skin.palette.accent) {
                    drawSnout(ctx, x, y, radius, skin.palette.accent);
                }
                drawEyes(ctx, x, y - radius * 0.05, radius, skin.palette.eyes, '#fff', false, blinkState);
                break;
            case 'wolf':
                drawBaseCircle(ctx, x, y, radius, skin.palette.base);
                drawFurTexture(ctx, x, y, radius, skin.palette.base);
                drawTriangle(ctx, x - radius * 0.5, y - radius * 0.2, radius * 0.55, -radius * 0.8, skin.palette.ears);
                drawTriangle(ctx, x + radius * 0.5, y - radius * 0.2, -radius * 0.55, -radius * 0.8, skin.palette.ears);
                drawEyes(ctx, x, y, radius, skin.palette.eyes, skin.palette.sclera, false, blinkState);
                break;
            case 'bull':
                drawBaseCircle(ctx, x, y, radius, skin.palette.base);
                drawHorns(ctx, x, y, radius, skin.palette.horns);
                drawSnout(ctx, x, y, radius, skin.palette.horns);
                drawEyes(ctx, x, y - radius * 0.05, radius, skin.palette.eyes, skin.palette.sclera, false, blinkState);
                break;
            case 'demon':
                drawBaseCircle(ctx, x, y, radius, skin.palette.base);
                drawHorns(ctx, x, y, radius, skin.palette.horns, true);
                drawEyes(ctx, x, y - radius * 0.05, radius, skin.palette.eyes, skin.palette.sclera, true, blinkState);
                break;
            default:
                drawBaseCircle(ctx, x, y, radius, '#ffffff');
        }
        ctx.restore();
    }

    function drawParticleSprite(ctx, particle) {
        const isPlayer = particle.isPlayer;
        const map = isPlayer ? PLAYER_SKIN_MAP : ENEMY_SKIN_MAP;
        const fallbackId = isPlayer ? selectedPlayerSkin : selectedEnemySkin;
        const skin = map[particle.skin] || map[fallbackId] || Object.values(map)[0];
        
        // Visual indicators for players in multiplayer mode
        if (isPlayer && gameMode === 'multiplayer') {
            ctx.save();
            const playerId = particle.playerId || 1;
            const outlineColor = playerId === 1 ? '#0066FF' : '#00FF66'; // Blue for P1, Green for P2
            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
            
            // Name tag above player
            ctx.fillStyle = outlineColor;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`P${playerId}`, particle.x, particle.y - particle.radius - 5);
            ctx.restore();
            
            // Make players semi-transparent when overlapping
            if (playerBall && player2Ball) {
                const dx = playerBall.x - player2Ball.x;
                const dy = playerBall.y - player2Ball.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < (playerBall.radius + player2Ball.radius) * 1.5) {
                    ctx.save();
                    ctx.globalAlpha = 0.6;
                }
            }
        }
        
        // Enhanced glow effect for enemies based on type with pulsing
        if (!isPlayer && particle.enemyType) {
            ctx.save();
            const time = Date.now() * 0.005;
            let glowColor = '#FF0000';
            let glowRadius = particle.radius + 3;
            let pulseIntensity = 0.2;
            
            if (particle.enemyType === 'fast') {
                // Fast enemies: Orange/yellow glow with pulsing
                glowColor = '#FFAA00';
                glowRadius = particle.radius + 5;
                pulseIntensity = 0.3 + Math.sin(time) * 0.1;
                
                // Motion blur effect for fast-moving enemies
                const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > 5) {
                    ctx.save();
                    ctx.globalAlpha = 0.15;
                    ctx.fillStyle = '#FFAA00';
                    const angle = Math.atan2(particle.vy, particle.vx);
                    const blurLength = speed * 2;
                    ctx.beginPath();
                    ctx.ellipse(
                        particle.x - Math.cos(angle) * blurLength / 2,
                        particle.y - Math.sin(angle) * blurLength / 2,
                        blurLength / 2,
                        particle.radius * 0.4,
                        angle,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    ctx.restore();
                }
            } else if (particle.enemyType === 'slow') {
                // Slow enemies: Dark red/burgundy glow, thicker outline
                glowColor = '#8B0000';
                glowRadius = particle.radius + 8;
                pulseIntensity = 0.25;
                
                // Heavy shadow effect for slow/heavy enemies
                ctx.save();
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.ellipse(
                    particle.x + 4,
                    particle.y + 4,
                    particle.radius * 1.1,
                    particle.radius * 0.9,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.restore();
            }
            
            // Multi-layer glow for intensity
            for (let i = 3; i > 0; i--) {
                ctx.globalAlpha = pulseIntensity * (i / 3);
                ctx.fillStyle = glowColor;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, glowRadius * (i / 3), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        
        renderSkin(ctx, skin, particle.x, particle.y, particle.radius);
        
        // Draw thicker outline for slow enemies
        if (!isPlayer && particle.enemyType === 'slow') {
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    // ============================================
    // GAME INITIALIZATION
    // ============================================

    function resizeCanvas() {
        if (!domElements.canvas) return;
        domElements.canvas.width = window.innerWidth;
        domElements.canvas.height = window.innerHeight;
        if (playerBall && gameState.playing) {
            playerBall.x = Math.min(playerBall.x, domElements.canvas.width - playerBall.radius);
            playerBall.y = Math.min(playerBall.y, domElements.canvas.height - playerBall.radius);
        }
        // Update joystick position on resize
        if (isMobile && domElements.joystickContainer) {
            initJoystickPosition();
        }
    }

    // Initialize joystick position
    function initJoystickPosition() {
        if (!domElements.joystickContainer) return;
        const padding = 60;
        const baseX = padding + joystick.radius;
        const baseY = window.innerHeight - padding - joystick.radius;
        
        domElements.joystickContainer.style.left = `${baseX - joystick.radius}px`;
        domElements.joystickContainer.style.top = `${baseY - joystick.radius}px`;
        
        // Reset stick position (centered)
        if (domElements.joystickStick) {
            domElements.joystickStick.style.transform = 'translate(-50%, -50%)';
        }
    }

    // Show/hide joystick based on mobile detection
    function setupJoystick() {
        if (isMobile && domElements.joystickContainer) {
            // Initially hidden, will show when game starts
            domElements.joystickContainer.classList.add('hidden');
            initJoystickPosition();
        } else if (domElements.joystickContainer) {
            domElements.joystickContainer.classList.add('hidden');
        }
    }

    if (domElements.canvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Setup joystick for mobile
    setupJoystick();

    loadStats();
    loadSettings();
    
    // Initialize music system
    initMusic();
    playMusic('menu', 100);
    
    if (domElements.timeDisplay) {
        domElements.timeDisplay.textContent = '0';
    }
    buildBestScoresList();
    if (domElements.playerSkinOptions) {
        createSkinButtons(PLAYER_SKINS, domElements.playerSkinOptions, 'player');
    }
    if (domElements.enemySkinOptions) {
        createSkinButtons(ENEMY_SKINS, domElements.enemySkinOptions, 'enemy');
    }
    applyDifficultySettings();
    updateStatsDisplay();
    if (typeof updateGameModeButton === 'function') {
        updateGameModeButton();
    }
    if (typeof updateChaosModeButton === 'function') {
        updateChaosModeButton();
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        
        // Keyboard shortcuts
        if (key === 'c' && !gameState.playing) {
            showModal(domElements.customizeModal);
            event.preventDefault();
            return;
        } else if (key === 's' && !gameState.playing && !domElements.startScreen.classList.contains('hidden')) {
            hideStartScreen();
            hideModal(domElements.customizeModal);
            hideModal(domElements.bestScoresModal);
            startNewGame();
            event.preventDefault();
            return;
        } else if (key === 'p' && gameState.playing) {
            gameState.paused = !gameState.paused;
            if (gameState.paused) {
                showModal(domElements.pauseModal);
                // Pause music
                stopMusic();
            } else {
                hideModal(domElements.pauseModal);
                // Resume music
                const diff = getCurrentDifficulty();
                const bpm = diff.id === 'easy' ? 120 : diff.id === 'medium' ? 140 : 160;
                const track = diff.id === 'easy' ? 'easy' : diff.id === 'medium' ? 'medium' : 'hard';
                playMusic(track, bpm);
            }
            event.preventDefault();
            return;
        } else if (key === 'p' && !gameState.playing && !domElements.startScreen.classList.contains('hidden')) {
            // Prevent P from doing anything on start screen
            event.preventDefault();
            return;
        } else if (key === 'escape') {
            if (!domElements.customizeModal.classList.contains('hidden')) {
                hideModal(domElements.customizeModal);
            } else if (!domElements.bestScoresModal.classList.contains('hidden')) {
                hideModal(domElements.bestScoresModal);
            } else if (!domElements.settingsModal.classList.contains('hidden')) {
                hideModal(domElements.settingsModal);
            } else if (gameState.paused && gameState.playing) {
                gameState.paused = false;
                hideModal(domElements.pauseModal);
            }
            event.preventDefault();
            return;
        }

        // Player 1 controls (WASD) - disabled on mobile
        if (!isMobile && key in keys) {
            keys[key] = true;
            event.preventDefault();
        }
        
        // Player 2 controls (Arrow keys) - disabled on mobile
        if (!isMobile && gameMode === 'multiplayer' && gameState.playing) {
            if (event.key === 'ArrowUp') {
                keysP2.up = true;
                event.preventDefault();
            } else if (event.key === 'ArrowLeft') {
                keysP2.left = true;
                event.preventDefault();
            } else if (event.key === 'ArrowDown') {
                keysP2.down = true;
                event.preventDefault();
            } else if (event.key === 'ArrowRight') {
                keysP2.right = true;
                event.preventDefault();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        // Disable keyboard controls on mobile
        if (!isMobile && key in keys) {
            keys[key] = false;
            event.preventDefault();
        }
        
        // Player 2 controls (Arrow keys) - disabled on mobile
        if (!isMobile && gameMode === 'multiplayer') {
            if (event.key === 'ArrowUp') {
                keysP2.up = false;
                event.preventDefault();
            } else if (event.key === 'ArrowLeft') {
                keysP2.left = false;
                event.preventDefault();
            } else if (event.key === 'ArrowDown') {
                keysP2.down = false;
                event.preventDefault();
            } else if (event.key === 'ArrowRight') {
                keysP2.right = false;
                event.preventDefault();
            }
        }
    });

    // ============================================
    // TOUCH/JOYSTICK HANDLERS (MOBILE)
    // ============================================

    function getTouchPos(e) {
        const touch = e.touches ? e.touches[0] : e;
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    }

    function updateJoystick(x, y) {
        if (!domElements.joystickContainer) return;
        
        const containerRect = domElements.joystickContainer.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let stickX, stickY;
        if (distance > joystick.maxDistance) {
            const angle = Math.atan2(dy, dx);
            stickX = Math.cos(angle) * joystick.maxDistance;
            stickY = Math.sin(angle) * joystick.maxDistance;
        } else {
            stickX = dx;
            stickY = dy;
        }
        
        // Update visual position (combine centering with offset)
        if (domElements.joystickStick) {
            domElements.joystickStick.style.transform = `translate(-50%, -50%) translate(${stickX}px, ${stickY}px)`;
        }
        
        // Calculate normalized direction (-1 to 1)
        const normalizedDx = stickX / joystick.maxDistance;
        const normalizedDy = stickY / joystick.maxDistance;
        
        // Update keys based on joystick position (dead zone of 0.1)
        const deadZone = 0.1;
        keys.w = normalizedDy < -deadZone;
        keys.s = normalizedDy > deadZone;
        keys.a = normalizedDx < -deadZone;
        keys.d = normalizedDx > deadZone;
    }

    function resetJoystick() {
        joystick.active = false;
        
        if (domElements.joystickStick) {
            domElements.joystickStick.style.transform = 'translate(-50%, -50%)';
        }
        
        // Reset keys
        keys.w = false;
        keys.s = false;
        keys.a = false;
        keys.d = false;
    }

    // Touch event handlers
    if (isMobile && domElements.joystickContainer) {
        domElements.joystickContainer.addEventListener('touchstart', (e) => {
            if (!gameState.playing || gameState.paused) return;
            e.preventDefault();
            const pos = getTouchPos(e);
            joystick.active = true;
            updateJoystick(pos.x, pos.y);
        }, { passive: false });

        domElements.joystickContainer.addEventListener('touchmove', (e) => {
            if (!joystick.active || !gameState.playing || gameState.paused) return;
            e.preventDefault();
            const pos = getTouchPos(e);
            updateJoystick(pos.x, pos.y);
        }, { passive: false });

        domElements.joystickContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            resetJoystick();
        }, { passive: false });

        domElements.joystickContainer.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            resetJoystick();
        }, { passive: false });

        // Also handle touch events on canvas to prevent scrolling
        if (domElements.canvas) {
            domElements.canvas.addEventListener('touchstart', (e) => {
                if (gameState.playing && !gameState.paused) {
                    e.preventDefault();
                }
            }, { passive: false });

            domElements.canvas.addEventListener('touchmove', (e) => {
                if (gameState.playing && !gameState.paused) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }

    if (domElements.startBtn) {
        domElements.startBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.startBtn);
            hideStartScreen();
            hideModal(domElements.customizeModal);
            hideModal(domElements.bestScoresModal);
            startNewGame();
        });
    }

    if (domElements.customizeBtn) {
        domElements.customizeBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.customizeBtn);
            showModal(domElements.customizeModal);
        });
    }

    if (domElements.closeCustomizeBtn) {
        domElements.closeCustomizeBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.closeCustomizeBtn);
            hideModal(domElements.customizeModal);
        });
    }

    if (domElements.customizeModal) {
        domElements.customizeModal.addEventListener('click', (event) => {
            if (event.target === domElements.customizeModal) {
                hideModal(domElements.customizeModal);
            }
        });
    }

    if (domElements.bestScoresBtn) {
        domElements.bestScoresBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.bestScoresBtn);
            updateBestScoresList();
            showModal(domElements.bestScoresModal);
        });
    }

    if (domElements.closeBestScoresBtn) {
        domElements.closeBestScoresBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.closeBestScoresBtn);
            hideModal(domElements.bestScoresModal);
        });
    }

    if (domElements.bestScoresModal) {
        domElements.bestScoresModal.addEventListener('click', (event) => {
            if (event.target === domElements.bestScoresModal) {
                hideModal(domElements.bestScoresModal);
            }
        });
    }

    if (domElements.difficultyBtn) {
        domElements.difficultyBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.difficultyBtn);
            difficultyIndex = (difficultyIndex + 1) % DIFFICULTY_LEVELS.length;
            applyDifficultySettings();
        });
    }

    if (domElements.gameModeBtn) {
        domElements.gameModeBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.gameModeBtn);
            toggleGameMode();
        });
        updateGameModeButton(); // Initialize button text
    }

    if (domElements.chaosModeBtn) {
        domElements.chaosModeBtn.addEventListener('click', (e) => {
            if (typeof createRipple === 'function') {
                createRipple(e, domElements.chaosModeBtn);
            }
            if (typeof toggleChaosMode === 'function') {
                toggleChaosMode();
            }
        });
        // Initialize button state
        if (typeof updateChaosModeButton === 'function') {
            updateChaosModeButton();
        }
    }

    if (domElements.closeGameOverBtn) {
        domElements.closeGameOverBtn.addEventListener('click', (e) => {
            if (typeof createRipple === 'function') {
                createRipple(e, domElements.closeGameOverBtn);
            }
            if (typeof hideModal === 'function' && domElements.gameOverModal) {
                hideModal(domElements.gameOverModal);
            }
            if (typeof showStartScreen === 'function') {
                showStartScreen();
            }
        });
    }

    if (domElements.gameOverModal) {
        domElements.gameOverModal.addEventListener('click', (event) => {
            if (event.target === domElements.gameOverModal) {
                if (typeof hideModal === 'function') {
                    hideModal(domElements.gameOverModal);
                }
                if (typeof showStartScreen === 'function') {
                    showStartScreen();
                }
            }
        });
    }

    if (domElements.infoBtn) {
        domElements.infoBtn.addEventListener('click', (e) => {
            if (typeof createRipple === 'function') {
                createRipple(e, domElements.infoBtn);
            }
            if (domElements.infoModal && typeof showModal === 'function') {
                showModal(domElements.infoModal);
            }
        });
    }

    if (domElements.closeInfoBtn) {
        domElements.closeInfoBtn.addEventListener('click', (e) => {
            if (typeof createRipple === 'function') {
                createRipple(e, domElements.closeInfoBtn);
            }
            if (domElements.infoModal && typeof hideModal === 'function') {
                hideModal(domElements.infoModal);
            }
        });
    }

    if (domElements.infoModal) {
        domElements.infoModal.addEventListener('click', (event) => {
            if (event.target === domElements.infoModal) {
                if (typeof hideModal === 'function') {
                    hideModal(domElements.infoModal);
                }
            }
        });
    }

    if (domElements.settingsBtn) {
        domElements.settingsBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.settingsBtn);
            updateStatsDisplay();
            showModal(domElements.settingsModal);
        });
    }

    if (domElements.closeSettingsBtn) {
        domElements.closeSettingsBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.closeSettingsBtn);
            hideModal(domElements.settingsModal);
        });
    }

    if (domElements.settingsModal) {
        domElements.settingsModal.addEventListener('click', (event) => {
            if (event.target === domElements.settingsModal) {
                hideModal(domElements.settingsModal);
            }
        });
    }

    if (domElements.masterVolume) {
        domElements.masterVolume.addEventListener('input', (e) => {
            settings.masterVolume = parseInt(e.target.value);
            if (domElements.masterVolumeValue) {
                domElements.masterVolumeValue.textContent = settings.masterVolume;
            }
            saveSettings();
        });
    }

    if (domElements.sfxVolume) {
        domElements.sfxVolume.addEventListener('input', (e) => {
            settings.sfxVolume = parseInt(e.target.value);
            if (domElements.sfxVolumeValue) {
                domElements.sfxVolumeValue.textContent = settings.sfxVolume;
            }
            saveSettings();
        });
    }

    if (domElements.musicVolume) {
        domElements.musicVolume.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value);
            setMusicVolume(volume);
            if (domElements.musicVolumeValue) {
                domElements.musicVolumeValue.textContent = volume;
            }
        });
    }

    if (domElements.particlesEnabled) {
        domElements.particlesEnabled.addEventListener('change', (e) => {
            settings.particlesEnabled = e.target.checked;
            saveSettings();
        });
    }

    if (domElements.screenShakeEnabled) {
        domElements.screenShakeEnabled.addEventListener('change', (e) => {
            settings.screenShakeEnabled = e.target.checked;
            saveSettings();
        });
    }

    if (domElements.trailsEnabled) {
        domElements.trailsEnabled.addEventListener('change', (e) => {
            settings.trailsEnabled = e.target.checked;
            saveSettings();
        });
    }

    if (domElements.resumeBtn) {
        domElements.resumeBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.resumeBtn);
            gameState.paused = false;
            hideModal(domElements.pauseModal);
            // Resume music if it was playing
            if (gameState.playing && musicManager.currentTrack && !musicManager.isPlaying) {
                const diff = getCurrentDifficulty();
                const bpm = diff.id === 'easy' ? 120 : diff.id === 'medium' ? 140 : 160;
                const track = diff.id === 'easy' ? 'easy' : diff.id === 'medium' ? 'medium' : 'hard';
                playMusic(track, bpm);
            }
        });
    }

    if (domElements.restartBtn) {
        domElements.restartBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.restartBtn);
            hideModal(domElements.pauseModal);
            startNewGame();
        });
    }

    if (domElements.quitBtn) {
        domElements.quitBtn.addEventListener('click', (e) => {
            createRipple(e, domElements.quitBtn);
            gameState.playing = false;
            gameState.paused = false;
            stopSpawning();
            stopMusic();
            playMusic('menu', 100);
            hideModal(domElements.pauseModal);
            showStartScreen();
        });
    }

    // ============================================
    // GAME LOGIC
    // ============================================

    function createPlayerBall() {
        return {
            x: domElements.canvas.width / 2 - 30,
            y: domElements.canvas.height / 2,
            radius: CONFIG.particleRadius,
            vy: 0,
            vx: 0,
            isPlayer: true,
            playerId: 1,
            skin: selectedPlayerSkin
        };
    }

    function createPlayer2Ball() {
        return {
            x: domElements.canvas.width / 2 + 30,
            y: domElements.canvas.height / 2,
            radius: CONFIG.particleRadius,
            vy: 0,
            vx: 0,
            isPlayer: true,
            playerId: 2,
            skin: selectedPlayerSkin
        };
    }

    function toggleGameMode() {
        gameMode = gameMode === 'single' ? 'multiplayer' : 'single';
        localStorage.setItem('gameMode', gameMode);
        updateGameModeButton();
    }

    function updateGameModeButton() {
        if (domElements.gameModeLabel) {
            domElements.gameModeLabel.textContent = gameMode === 'single' ? '1 Player' : '2 Players';
        }
    }

    function toggleChaosMode() {
        if (typeof chaosMode === 'undefined') return; // Safety check
        chaosMode = !chaosMode;
        localStorage.setItem('chaosMode', String(chaosMode));
        updateChaosModeButton();
    }

    function updateChaosModeButton() {
        if (!domElements.chaosModeLabel) return; // Null check
        domElements.chaosModeLabel.textContent = chaosMode ? 'On' : 'Off';
    }

    function spawnBallFromCollision(p1, p2) {
        // Safety checks
        if (!p1 || !p2) return;
        if (typeof collisionCooldown === 'undefined') return;
        
        // REMOVE the cooldown check here - it should be checked BEFORE calling this function
        // Cooldown should already be set in checkCollision() to prevent multiple calls
        
        // Max balls limit
        const enemyCount = particles.filter(p => !p.isPlayer).length;
        if (enemyCount >= 200) return; // Cap at 200 enemies
        
        // Get current time for spawn immunity
        const now = Date.now();
        
        // Calculate spawn position (midpoint)
        const spawnX = (p1.x + p2.x) / 2;
        const spawnY = (p1.y + p2.y) / 2;
        
        // Calculate new ball properties
        const avgRadius = (p1.radius + p2.radius) / 2;
        const newRadius = Math.max(CONFIG.particleRadius * 0.5, 
                                   Math.min(CONFIG.particleRadius * 1.5, avgRadius));
        
        // Combined velocity (vector sum)
        const combinedVx = (p1.vx + p2.vx) * 0.6; // Dampened
        const combinedVy = (p1.vy + p2.vy) * 0.6;
        
        // Random enemy type (or inherit from parents)
        const newEnemyType = Math.random() < 0.5 ? 
            (p1.enemyType || 'normal') : 
            (p2.enemyType || 'normal');
        
        // Random skin from parents
        const parentSkins = [p1.skin, p2.skin].filter(s => s);
        const newSkin = parentSkins[Math.floor(Math.random() * parentSkins.length)] || selectedEnemySkin;
        
        // Create new ball with spawn immunity to prevent immediate cascading spawns
        const newBall = {
            x: spawnX,
            y: spawnY,
            radius: newRadius,
            vx: combinedVx + (Math.random() - 0.5) * 2, // Add some randomness
            vy: combinedVy + (Math.random() - 0.5) * 2,
            isPlayer: false,
            skin: newSkin,
            enemyType: newEnemyType,
            id: Date.now() + Math.random(), // Unique ID
            spawnImmunity: now + 1500 // Can't spawn other balls for 1.5 seconds after being created
        };
        
        particles.push(newBall);
        
        // Visual effects
        if (typeof createParticleExplosion === 'function') {
            createParticleExplosion(spawnX, spawnY, '#FF00FF', 15, newEnemyType);
        }
        if (typeof playSound === 'function') {
            playSound(800, 0.1, 'sine', 0.3);
        }
        
        // Screen shake
        if (typeof addScreenShake === 'function') {
            addScreenShake(5);
        }
    }

    function showGameOverScreen() {
        // Safety checks
        if (!domElements.gameOverModal) return;
        if (typeof gameState === 'undefined') return;
        
        // Hide start screen first
        if (typeof hideStartScreen === 'function') {
            hideStartScreen();
        }
        
        const survivalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
        let survivalTimeP2 = 0;
        
        if (gameMode === 'multiplayer' && player2Ball) {
            survivalTimeP2 = Math.floor((Date.now() - gameState.startTimeP2) / 1000);
            
            // Determine winner
            const winner = survivalTime > survivalTimeP2 ? 1 : 
                          survivalTimeP2 > survivalTime ? 2 : 0; // 0 = tie
            
            // Show winner display
            if (domElements.winnerDisplay && domElements.winnerText) {
                domElements.winnerDisplay.classList.remove('hidden');
                if (winner === 0) {
                    domElements.winnerText.textContent = "It's a Tie!";
                    domElements.winnerText.className = 'winner-tie';
                } else {
                    domElements.winnerText.textContent = `Winner: Player ${winner}`;
                    domElements.winnerText.className = `winner-p${winner}`;
                }
            }
            
            // Show P2 stats
            if (domElements.p2Stats) {
                domElements.p2Stats.classList.remove('hidden');
                updatePlayerStats(2, survivalTimeP2);
            }
        } else {
            // Hide winner display and P2 stats in single player
            if (domElements.winnerDisplay) domElements.winnerDisplay.classList.add('hidden');
            if (domElements.p2Stats) domElements.p2Stats.classList.add('hidden');
        }
        
        // Update P1 stats
        updatePlayerStats(1, survivalTime);
        
        // Show modal
        if (typeof showModal === 'function') {
            showModal(domElements.gameOverModal);
        }
    }

    function updatePlayerStats(playerId, time) {
        // Safety checks
        if (!playerId || typeof time !== 'number') return;
        if (typeof gameState === 'undefined') return;
        
        const prefix = playerId === 1 ? 'p1' : 'p2';
        const combo = playerId === 1 ? gameState.combo : gameState.comboP2;
        
        // Update time
        const timeEl = document.getElementById(`${prefix}Time`);
        if (timeEl) timeEl.textContent = `${time}s`;
        
        // Update combo
        const comboEl = document.getElementById(`${prefix}Combo`);
        if (comboEl) comboEl.textContent = `${combo}x`;
        
        // Update power-ups collected
        const powerUpsEl = document.getElementById(`${prefix}PowerUps`);
        if (powerUpsEl) {
            const powerUpCount = playerId === 1 ? 
                (gameState.powerUpStatsP1?.total || 0) :
                (gameState.powerUpStatsP2?.total || 0);
            powerUpsEl.textContent = powerUpCount;
        }
    }

    function spawnEnemyBall() {
        if (!gameState.playing) return;

        const side = Math.floor(Math.random() * 4);
        let x;
        let y;
        const canvas = domElements.canvas;

        if (side === 0) {
            x = Math.random() * canvas.width;
            y = -CONFIG.spawnOffset;
        } else if (side === 1) {
            x = canvas.width + CONFIG.spawnOffset;
            y = Math.random() * canvas.height;
        } else if (side === 2) {
            x = Math.random() * canvas.width;
            y = canvas.height + CONFIG.spawnOffset;
        } else {
            x = -CONFIG.spawnOffset;
            y = Math.random() * canvas.height;
        }

        // Enemy variety: 60% normal, 25% fast, 15% slow heavy
        const rand = Math.random();
        let enemyType = 'normal';
        let radius = CONFIG.particleRadius;
        let speedMultiplier = CONFIG.enemySpeedMultiplier;
        
        if (rand < 0.15) {
            enemyType = 'slow';
            radius = CONFIG.particleRadius * 1.5;
            speedMultiplier = CONFIG.enemySpeedMultiplier * 0.6;
        } else if (rand < 0.4) {
            enemyType = 'fast';
            radius = CONFIG.particleRadius * 0.7;
            speedMultiplier = CONFIG.enemySpeedMultiplier * 1.5;
        }

        particles.push({
            x,
            y,
            radius: radius,
            vy: (Math.random() - 0.5) * 4 * speedMultiplier,
            vx: (Math.random() - 0.5) * 10 * speedMultiplier,
            isPlayer: false,
            skin: selectedEnemySkin,
            enemyType: enemyType,
            id: Date.now() + Math.random() // Unique ID for chaos mode
        });
    }

    function updateHealthBar() {
        const healthPercent = (gameState.health / gameState.maxHealth) * 100;
        domElements.healthFill.style.width = healthPercent + '%';
        
        if (healthPercent > 66) {
            domElements.healthFill.style.background = 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)';
        } else if (healthPercent > 33) {
            domElements.healthFill.style.background = 'linear-gradient(90deg, #FFC107 0%, #FF9800 100%)';
        } else {
            domElements.healthFill.style.background = 'linear-gradient(90deg, #F44336 0%, #D32F2F 100%)';
        }
    }

    function updateHealthBarP2() {
        if (!domElements.healthFillP2) return;
        const healthPercent = (gameState.healthP2 / gameState.maxHealth) * 100;
        domElements.healthFillP2.style.width = healthPercent + '%';
        
        if (healthPercent > 66) {
            domElements.healthFillP2.style.background = 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)';
        } else if (healthPercent > 33) {
            domElements.healthFillP2.style.background = 'linear-gradient(90deg, #FFC107 0%, #FF9800 100%)';
        } else {
            domElements.healthFillP2.style.background = 'linear-gradient(90deg, #F44336 0%, #D32F2F 100%)';
        }
    }

    function updateComboDisplay() {
        if (gameState.combo > 0) {
            domElements.comboDisplay.classList.remove('hidden');
            domElements.comboCount.textContent = gameState.combo;
        } else {
            domElements.comboDisplay.classList.add('hidden');
        }
    }

    function updateComboDisplayP2() {
        if (!domElements.comboDisplayP2 || !domElements.comboCountP2) return;
        if (gameState.comboP2 > 0) {
            domElements.comboDisplayP2.classList.remove('hidden');
            domElements.comboCountP2.textContent = gameState.comboP2;
        } else {
            domElements.comboDisplayP2.classList.add('hidden');
        }
    }

    function checkNearMiss() {
        const nearMissDistance = 60;
        const now = Date.now();
        
        // Check near misses for Player 1
        if (playerBall && !gameState.player1Dead) {
            for (const p of particles) {
                if (!p.isPlayer) {
                    const dx = p.x - playerBall.x;
                    const dy = p.y - playerBall.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < nearMissDistance && dist > playerBall.radius + p.radius) {
                        if (now - gameState.lastDodgeTime > 500) {
                            gameState.combo++;
                            gameState.lastDodgeTime = now;
                            stats.totalEnemiesDodged++;
                            stats.bestCombo = Math.max(stats.bestCombo, gameState.combo);
                            updateComboDisplay();
                            playNearMissSound();
                            
                            // Visual feedback
                            if (settings.particlesEnabled) {
                                createParticleExplosion(playerBall.x, playerBall.y, '#00FF00', 5);
                            }
                        }
                    }
                }
            }
            
            // Combo decay for Player 1
            if (gameState.combo > 0 && now - gameState.lastDodgeTime > 2000) {
                gameState.combo = Math.max(0, gameState.combo - 1);
                updateComboDisplay();
            }
        }
        
        // Check near misses for Player 2 (multiplayer mode)
        if (gameMode === 'multiplayer' && player2Ball && !gameState.player2Dead) {
            for (const p of particles) {
                if (!p.isPlayer) {
                    const dx = p.x - player2Ball.x;
                    const dy = p.y - player2Ball.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < nearMissDistance && dist > player2Ball.radius + p.radius) {
                        if (now - gameState.lastDodgeTimeP2 > 500) {
                            gameState.comboP2++;
                            gameState.lastDodgeTimeP2 = now;
                            updateComboDisplayP2();
                            playNearMissSound();
                            
                            // Visual feedback
                            if (settings.particlesEnabled) {
                                createParticleExplosion(player2Ball.x, player2Ball.y, '#00FF00', 5);
                            }
                        }
                    }
                }
            }
            
            // Combo decay for Player 2
            if (gameState.comboP2 > 0 && now - gameState.lastDodgeTimeP2 > 2000) {
                gameState.comboP2 = Math.max(0, gameState.comboP2 - 1);
                updateComboDisplayP2();
            }
        }
    }

    function startNewGame() {
        if (gameState.spawnInterval) {
            clearInterval(gameState.spawnInterval);
        }
        if (gameState.powerUpSpawnInterval) {
            clearInterval(gameState.powerUpSpawnInterval);
        }

        gameState.playing = true;
        gameState.paused = false;
        gameState.startTime = Date.now();
        gameState.startTimeP2 = Date.now();
        gameState.health = gameState.maxHealth;
        gameState.healthP2 = gameState.maxHealth;
        gameState.combo = 0;
        gameState.comboP2 = 0;
        gameState.lastDodgeTime = 0;
        gameState.lastDodgeTimeP2 = 0;
        gameState.player1Dead = false;
        gameState.player2Dead = false;
        
        // Reset all power-up stacks
        gameState.powerUpStacks.shield = { count: 0, duration: 0, maxStack: 5 };
        gameState.powerUpStacks.slowmo = { count: 0, duration: 0, maxStack: 5 };
        gameState.powerUpStacks.speed = { count: 0, duration: 0, maxStack: 5 };
        gameState.powerUpStacksP2.shield = { count: 0, duration: 0, maxStack: 5 };
        gameState.powerUpStacksP2.slowmo = { count: 0, duration: 0, maxStack: 5 };
        gameState.powerUpStacksP2.speed = { count: 0, duration: 0, maxStack: 5 };
        gameState.powerUpStatsP1 = { total: 0 };
        gameState.powerUpStatsP2 = { total: 0 };
        if (typeof collisionCooldown !== 'undefined' && collisionCooldown.clear) {
            collisionCooldown.clear(); // Reset chaos mode cooldowns
        }
        
        // Update UI based on mode
        if (gameMode === 'multiplayer') {
            domElements.player1UI.classList.remove('hidden');
            domElements.player2UI.classList.remove('hidden');
            domElements.healthBar.classList.remove('hidden');
            if (domElements.healthBarP2) domElements.healthBarP2.classList.remove('hidden');
            if (domElements.timeDisplayP2) domElements.timeDisplayP2.textContent = '0';
        } else {
            domElements.player1UI.classList.remove('hidden');
            domElements.player2UI.classList.add('hidden');
            domElements.healthBar.classList.remove('hidden');
            if (domElements.healthBarP2) domElements.healthBarP2.classList.add('hidden');
        }
        
        domElements.timeDisplay.textContent = '0';
        if (domElements.timeDisplayP2) domElements.timeDisplayP2.textContent = '0';
        updateHealthBar();
        if (gameMode === 'multiplayer') updateHealthBarP2();
        updateComboDisplay();
        if (gameMode === 'multiplayer') updateComboDisplayP2();
        updatePowerUpIndicators();

        particles = [];
        powerUps = [];
        visualParticles = [];
        visualEffects = [];
        trails = [];
        playerBall = createPlayerBall();
        particles.push(playerBall);
        
        // Create Player 2 if multiplayer mode
        if (gameMode === 'multiplayer') {
            player2Ball = createPlayer2Ball();
            particles.push(player2Ball);
        } else {
            player2Ball = null;
        }

        Object.keys(keys).forEach((key) => {
            keys[key] = false;
        });
        Object.keys(keysP2).forEach((key) => {
            keysP2[key] = false;
        });
        
        // Show joystick on mobile when game starts
        if (isMobile && domElements.joystickContainer) {
            domElements.joystickContainer.classList.remove('hidden');
            resetJoystick();
        }

        // Start background music based on difficulty
        const diff = getCurrentDifficulty();
        const bpm = diff.id === 'easy' ? 120 : diff.id === 'medium' ? 140 : 160;
        const track = diff.id === 'easy' ? 'easy' : diff.id === 'medium' ? 'medium' : 'hard';
        playMusic(track, bpm);

        spawnEnemyBall();
        gameState.spawnInterval = setInterval(spawnEnemyBall, CONFIG.spawnInterval);
        gameState.powerUpSpawnInterval = setInterval(spawnPowerUp, 8000);
    }

    function stopSpawning() {
        if (gameState.spawnInterval) {
            clearInterval(gameState.spawnInterval);
            gameState.spawnInterval = null;
        }
    }

    function stopSpawning() {
        if (gameState.spawnInterval) {
            clearInterval(gameState.spawnInterval);
            gameState.spawnInterval = null;
        }
        if (gameState.powerUpSpawnInterval) {
            clearInterval(gameState.powerUpSpawnInterval);
            gameState.powerUpSpawnInterval = null;
        }
    }

    function gameOver() {
        if (!gameState.playing) return;

        gameState.playing = false;
        stopSpawning();
        stopMusic();
        
        // Play game over music briefly
        playMusic('gameOver', 60);
        setTimeout(() => {
            stopMusic();
            playMusic('menu', 100);
        }, 2000);
        
        stats.totalDeaths++;
        const survivalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
        stats.totalPlayTime += survivalTime;
        
        // In multiplayer mode, also track Player 2 time
        if (gameMode === 'multiplayer' && player2Ball) {
            const survivalTimeP2 = Math.floor((Date.now() - gameState.startTimeP2) / 1000);
            stats.totalPlayTime += survivalTimeP2;
        }
        
        saveStats();

        const diff = getCurrentDifficulty();
        
        // Update best scores
        if (gameMode === 'single') {
            const best = bestTimes[diff.id] || { normal: 0, chaos: 0 };
            if (chaosMode) {
                if (survivalTime > best.chaos) {
                    bestTimes[diff.id] = {
                        ...best,
                        chaos: survivalTime
                    };
                    saveBestTimes();
                    updateBestScoresList();
                }
            } else {
                if (survivalTime > best.normal) {
                    bestTimes[diff.id] = {
                        ...best,
                        normal: survivalTime
                    };
                    saveBestTimes();
                    updateBestScoresList();
                }
            }
            updateLastRunMessage(survivalTime, diff.label);
        } else {
            // Multiplayer mode - show both scores
            const survivalTimeP2 = Math.floor((Date.now() - gameState.startTimeP2) / 1000);
            updateLastRunMessage(`P1: ${survivalTime}s, P2: ${survivalTimeP2}s`, diff.label);
        }
        
        refreshAllSkinLocks();
        updateScoreDisplays();
        domElements.healthBar.classList.add('hidden');
        domElements.comboDisplay.classList.add('hidden');
        if (domElements.healthBarP2) domElements.healthBarP2.classList.add('hidden');
        if (domElements.comboDisplayP2) domElements.comboDisplayP2.classList.add('hidden');
        updatePowerUpIndicators();
        
        // Show enhanced game over screen
        if (typeof showGameOverScreen === 'function') {
            showGameOverScreen();
        } else {
            showStartScreen();
        }
    }

    function checkCollision(p1, p2) {
        // Skip player-to-player collisions
        if (p1.isPlayer && p2.isPlayer) return;
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distanceSquared = dx * dx + dy * dy;
        const minDistance = p1.radius + p2.radius;
        const minDistanceSquared = minDistance * minDistance;

        if (distanceSquared < minDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);

            // Allow players to pass through each other in multiplayer mode
            if (p1.isPlayer && p2.isPlayer) {
                return; // Skip collision between players
            }

            if ((p1.isPlayer && !p2.isPlayer) || (!p1.isPlayer && p2.isPlayer)) {
                if (gameState.playing) {
                    const enemy = p1.isPlayer ? p2 : p1;
                    const player = p1.isPlayer ? p1 : p2;
                    const playerId = player.playerId || (p1.isPlayer ? 1 : (p2.isPlayer ? 2 : null));
                    
                    // Determine which player's shield and health to check
                    const shieldStack = (playerId === 2 && gameMode === 'multiplayer') ? 
                        gameState.powerUpStacksP2.shield : gameState.powerUpStacks.shield;
                    const now = Date.now();
                    
                    if (shieldStack.count > 0 && now < shieldStack.duration) {
                        // Push enemy away
                        const angle = Math.atan2(dy, dx);
                        const force = 20;
                        enemy.vx += Math.cos(angle) * force;
                        enemy.vy += Math.sin(angle) * force;
                        createParticleExplosion(player.x, player.y, '#00BFFF', 15);
                        playSound(1200, 0.1, 'sine', 0.2);
                        // Reduce shield stack by 1 hit
                        shieldStack.count--;
                        if (shieldStack.count <= 0) {
                            shieldStack.duration = 0;
                        }
                        updatePowerUpIndicators();
                        return;
                    }
                    
                    // Take damage - handle based on player
                    if (playerId === 1 || gameMode === 'single') {
                        if (!gameState.player1Dead) {
                            gameState.health--;
                            playHitSound();
                            const shakeIntensity = enemy.enemyType === 'slow' ? 15 : enemy.enemyType === 'fast' ? 8 : 10;
                            addScreenShake(shakeIntensity);
                            createParticleExplosion(player.x, player.y, '#FF0000', 20, enemy.enemyType);
                            updateHealthBar();
                            gameState.combo = 0;
                            updateComboDisplay();
                            
                            if (gameState.health <= 0) {
                                gameState.player1Dead = true;
                                if (gameMode === 'single' || gameState.player2Dead) {
                                    gameOver();
                                    return;
                                }
                            } else {
                                // Push player away
                                const angle = Math.atan2(dy, dx);
                                const force = 15;
                                player.vx -= Math.cos(angle) * force;
                                player.vy -= Math.sin(angle) * force;
                            }
                        }
                    } else if (playerId === 2 && gameMode === 'multiplayer') {
                        if (!gameState.player2Dead) {
                            gameState.healthP2--;
                            playHitSound();
                            const shakeIntensity = enemy.enemyType === 'slow' ? 15 : enemy.enemyType === 'fast' ? 8 : 10;
                            addScreenShake(shakeIntensity);
                            createParticleExplosion(player.x, player.y, '#FF0000', 20, enemy.enemyType);
                            updateHealthBarP2();
                            gameState.comboP2 = 0;
                            updateComboDisplayP2();
                            
                            if (gameState.healthP2 <= 0) {
                                gameState.player2Dead = true;
                                if (gameState.player1Dead) {
                                    gameOver();
                                    return;
                                }
                            } else {
                                // Push player away
                                const angle = Math.atan2(dy, dx);
                                const force = 15;
                                player.vx -= Math.cos(angle) * force;
                                player.vy -= Math.sin(angle) * force;
                            }
                        }
                    }
                }
                return;
            }
            
            // Chaos Mode: Enemy-to-enemy collision spawning
            // Check FIRST before any other collision handling to prevent multiple triggers
            if (chaosMode && !p1.isPlayer && !p2.isPlayer) {
                // Check if either ball is in spawn immunity period (can't spawn immediately after being created)
                const now = Date.now();
                if (p1.spawnImmunity && now < p1.spawnImmunity) return;
                if (p2.spawnImmunity && now < p2.spawnImmunity) return;
                
                // Create a unique key for this collision pair
                const pairKey = `${Math.min(p1.id || 0, p2.id || 0)}-${Math.max(p1.id || 0, p2.id || 0)}`;
                
                // Check cooldown BEFORE spawning and set it IMMEDIATELY to prevent duplicate spawns
                if (!collisionCooldown.has(pairKey) || (now - collisionCooldown.get(pairKey) >= 1000)) {
                    // 30% chance that spawning occurs
                    if (Math.random() < 0.3) {
                        // Set cooldown IMMEDIATELY to prevent duplicate spawns
                        collisionCooldown.set(pairKey, now);
                        
                        // Only then spawn the ball
                        if (typeof spawnBallFromCollision === 'function') {
                            spawnBallFromCollision(p1, p2);
                        }
                        
                        // CRITICAL: Return early to prevent physics collision handling
                        // This stops the cascade of spawns by not processing normal collision physics
                        return;
                    } else {
                        // Even if spawn doesn't occur, set cooldown to prevent rapid retries
                        collisionCooldown.set(pairKey, now);
                    }
                }
            }

            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const vx1 = p1.vx * cos + p1.vy * sin;
            const vy1 = p1.vy * cos - p1.vx * sin;
            const vx2 = p2.vx * cos + p2.vy * sin;
            const vy2 = p2.vy * cos - p2.vx * sin;

            const finalVx1 = vx2;
            const finalVx2 = vx1;

            p1.vx = finalVx1 * cos - vy1 * sin;
            p1.vy = vy1 * cos + finalVx1 * sin;
            p2.vx = finalVx2 * cos - vy2 * sin;
            p2.vy = vy2 * cos + finalVx2 * sin;

            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;

            p1.x -= separationX;
            p1.y -= separationY;
            p2.x += separationX;
            p2.y += separationY;
        }
    }

    function animate() {
        if (!domElements.ctx || !domElements.canvas) return;
        const ctx = domElements.ctx;
        const canvas = domElements.canvas;

        // Apply screen shake
        ctx.save();
        ctx.translate(gameState.screenShake.x, gameState.screenShake.y);
        updateScreenShake();

        ctx.clearRect(-gameState.screenShake.x, -gameState.screenShake.y, canvas.width, canvas.height);

        if (gameState.playing && !gameState.paused) {
            const survivalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
            updateTimeDisplay(survivalTime);
            
            // Update Player 2 timer in multiplayer mode
            if (gameMode === 'multiplayer' && player2Ball && !gameState.player2Dead && domElements.timeDisplayP2) {
                const survivalTimeP2 = Math.floor((Date.now() - gameState.startTimeP2) / 1000);
                domElements.timeDisplayP2.textContent = survivalTimeP2;
            }
            
            // Update power-up timers (stackable system)
            const now = Date.now();
            
            // Check shield expiration
            if (gameState.powerUpStacks.shield.count > 0 && now > gameState.powerUpStacks.shield.duration) {
                gameState.powerUpStacks.shield.count = 0;
                gameState.powerUpStacks.shield.duration = 0;
                updatePowerUpIndicators();
            }
            
            // Check slow motion expiration
            if (gameState.powerUpStacks.slowmo.count > 0 && now > gameState.powerUpStacks.slowmo.duration) {
                gameState.powerUpStacks.slowmo.count = 0;
                gameState.powerUpStacks.slowmo.duration = 0;
                updatePowerUpIndicators();
            }
            
            // Check speed boost expiration
            if (gameState.powerUpStacks.speed.count > 0 && now > gameState.powerUpStacks.speed.duration) {
                gameState.powerUpStacks.speed.count = 0;
                gameState.powerUpStacks.speed.duration = 0;
                updatePowerUpIndicators();
            }
            
            // Check near misses for combo
            checkNearMiss();
        }

        if (gameState.paused) {
            ctx.restore();
            requestAnimationFrame(animate);
            return;
        }

        if (playerBall && gameState.playing) {
            let targetVx = 0;
            let targetVy = 0;
            let moveSpeed = CONFIG.moveSpeed;
            
            // Apply speed boost (stackable: +50% per stack, max 3x)
            const speedStack = gameState.powerUpStacks.speed;
            if (speedStack.count > 0 && Date.now() < speedStack.duration) {
                const speedMultiplier = 1 + (speedStack.count * 0.5);
                moveSpeed *= Math.min(speedMultiplier, 3.0); // Cap at 3x
            }

            if (keys.w) targetVy -= moveSpeed;
            if (keys.s) targetVy += moveSpeed;
            if (keys.a) targetVx -= moveSpeed;
            if (keys.d) targetVx += moveSpeed;

            playerBall.vx += (targetVx - playerBall.vx) * CONFIG.acceleration;
            playerBall.vy += (targetVy - playerBall.vy) * CONFIG.acceleration;

            if (targetVx === 0) playerBall.vx *= CONFIG.friction;
            if (targetVy === 0) playerBall.vy *= CONFIG.friction;
            
            // Add trail
            if (settings.trailsEnabled) {
                trails.push({
                    x: playerBall.x,
                    y: playerBall.y,
                    life: 0.3,
                    maxLife: 0.3
                });
            }
        }

        // Player 2 movement (multiplayer mode)
        if (player2Ball && gameState.playing && gameMode === 'multiplayer' && !gameState.player2Dead) {
            let targetVx = 0;
            let targetVy = 0;
            let moveSpeed = CONFIG.moveSpeed;
            
            // Apply speed boost for Player 2
            const speedStack = gameState.powerUpStacksP2.speed;
            if (speedStack.count > 0 && Date.now() < speedStack.duration) {
                const speedMultiplier = 1 + (speedStack.count * 0.5);
                moveSpeed *= Math.min(speedMultiplier, 3.0);
            }

            if (keysP2.up) targetVy -= moveSpeed;
            if (keysP2.down) targetVy += moveSpeed;
            if (keysP2.left) targetVx -= moveSpeed;
            if (keysP2.right) targetVx += moveSpeed;

            player2Ball.vx += (targetVx - player2Ball.vx) * CONFIG.acceleration;
            player2Ball.vy += (targetVy - player2Ball.vy) * CONFIG.acceleration;

            if (targetVx === 0) player2Ball.vx *= CONFIG.friction;
            if (targetVy === 0) player2Ball.vy *= CONFIG.friction;
            
            // Add trail for Player 2
            if (settings.trailsEnabled) {
                trails.push({
                    x: player2Ball.x,
                    y: player2Ball.y,
                    life: 0.3,
                    maxLife: 0.3
                });
            }
        }

        if (playerBall && gameState.playing) {
            // Apply slow motion to enemies (stackable: 30% → 20% → 15% per stack)
            const slowmoStack = gameState.powerUpStacks.slowmo;
            let timeScale = 1.0;
            if (slowmoStack.count > 0 && Date.now() < slowmoStack.duration) {
                // Each stack increases slowdown: 1 stack = 30%, 2 = 20%, 3+ = 15%
                if (slowmoStack.count === 1) timeScale = 0.3;
                else if (slowmoStack.count === 2) timeScale = 0.2;
                else timeScale = 0.15;
            }
            
            // Enemy gravity - gravitate toward closest player in multiplayer mode
            for (const p of particles) {
                if (!p.isPlayer) {
                    // Find closest player
                    let targetPlayer = playerBall;
                    let dx = playerBall.x - p.x;
                    let dy = playerBall.y - p.y;
                    let distanceSquared = dx * dx + dy * dy;
                    
                    // In multiplayer mode, check both players and target the closest
                    if (gameMode === 'multiplayer' && player2Ball && !gameState.player2Dead) {
                        const dx2 = player2Ball.x - p.x;
                        const dy2 = player2Ball.y - p.y;
                        const distanceSquared2 = dx2 * dx2 + dy2 * dy2;
                        
                        if (distanceSquared2 < distanceSquared) {
                            targetPlayer = player2Ball;
                            dx = dx2;
                            dy = dy2;
                            distanceSquared = distanceSquared2;
                        }
                    }
                    
                    // Only gravitate if target player exists and is alive
                    if ((targetPlayer === playerBall && !gameState.player1Dead) || 
                        (targetPlayer === player2Ball && !gameState.player2Dead)) {
                        if (distanceSquared > 0) {
                            const distance = Math.sqrt(distanceSquared);
                            const force = CONFIG.gravityStrength / (distanceSquared + 1);
                            const forceX = (dx / distance) * force;
                            const forceY = (dy / distance) * force;
                            p.vx += forceX * timeScale;
                            p.vy += forceY * timeScale;
                        }
                    }
                }
            }
            
            // Check power-up collection - either player can collect
            for (let i = powerUps.length - 1; i >= 0; i--) {
                const pu = powerUps[i];
                
                // Check Player 1 collection
                if (playerBall && !gameState.player1Dead) {
                    const dx = playerBall.x - pu.x;
                    const dy = playerBall.y - pu.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < playerBall.radius + pu.radius) {
                        collectPowerUp(pu, 1);
                        continue;
                    }
                }
                
                // Check Player 2 collection (multiplayer)
                if (gameMode === 'multiplayer' && player2Ball && !gameState.player2Dead) {
                    const dx = player2Ball.x - pu.x;
                    const dy = player2Ball.y - pu.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < player2Ball.radius + pu.radius) {
                        collectPowerUp(pu, 2);
                        continue;
                    }
                }
                
                // Move power-up towards closest player (magnet effect)
                if (playerBall && !gameState.player1Dead) {
                    const dx = playerBall.x - pu.x;
                    const dy = playerBall.y - pu.y;
                    const angle = Math.atan2(dy, dx);
                    pu.x += Math.cos(angle) * 0.3;
                    pu.y += Math.sin(angle) * 0.3;
                }
                if (gameMode === 'multiplayer' && player2Ball && !gameState.player2Dead) {
                    const dx = player2Ball.x - pu.x;
                    const dy = player2Ball.y - pu.y;
                    const angle = Math.atan2(dy, dx);
                    pu.x += Math.cos(angle) * 0.3;
                    pu.y += Math.sin(angle) * 0.3;
                }
            }
        }

        if (gameState.playing && !gameState.paused) {
            // Spatial partitioning for collision optimization
            const gridSize = 100;
            const grid = new Map();
            
            particles.forEach((p, index) => {
                const gridX = Math.floor(p.x / gridSize);
                const gridY = Math.floor(p.y / gridSize);
                const key = `${gridX},${gridY}`;
                
                if (!grid.has(key)) {
                    grid.set(key, []);
                }
                grid.get(key).push({ particle: p, index });
            });

            const checkedPairs = new Set();
            grid.forEach((cellParticles, key) => {
                const [gridX, gridY] = key.split(',').map(Number);
                
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const neighborKey = `${gridX + dx},${gridY + dy}`;
                        const neighborParticles = grid.get(neighborKey) || [];
                        
                        cellParticles.forEach(({ particle: p1, index: i1 }) => {
                            neighborParticles.forEach(({ particle: p2, index: i2 }) => {
                                if (p1 === p2 || i1 >= i2) return;
                                const pairKey = `${i1}-${i2}`;
                                if (!checkedPairs.has(pairKey)) {
                                    checkedPairs.add(pairKey);
                                    checkCollision(p1, p2);
                                }
                            });
                        });
                    }
                }
            });
        }

        // Update visual particles
        for (let i = visualParticles.length - 1; i >= 0; i--) {
            const p = visualParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.016;
            
            if (p.life <= 0) {
                visualParticles.splice(i, 1);
                continue;
            }
            
            ctx.save();
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Update game particles
        const slowmoStack = gameState.powerUpStacks.slowmo;
        let timeScale = 1.0;
        if (slowmoStack.count > 0 && Date.now() < slowmoStack.duration) {
            if (slowmoStack.count === 1) timeScale = 0.3;
            else if (slowmoStack.count === 2) timeScale = 0.2;
            else timeScale = 0.15;
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Skip movement for dead players
            if (p.isPlayer) {
                const playerId = p.playerId || 1;
                if ((playerId === 1 && gameState.player1Dead) || 
                    (playerId === 2 && gameState.player2Dead)) {
                    continue; // Don't move dead players
                }
            }
            
            p.y += p.vy * timeScale;
            p.x += p.vx * timeScale;

            if (p.y - p.radius < 0) {
                p.y = p.radius;
                p.vy = -p.vy * 0.8;
                if (settings.particlesEnabled) {
                    createParticleExplosion(p.x, p.y, '#FFFFFF', 5);
                }
            } else if (p.y + p.radius > canvas.height) {
                p.y = canvas.height - p.radius;
                p.vy = -p.vy * 0.8;
                if (settings.particlesEnabled) {
                    createParticleExplosion(p.x, p.y, '#FFFFFF', 5);
                }
            }

            if (p.x - p.radius < 0) {
                p.x = p.radius;
                p.vx = -p.vx * 0.8;
                if (settings.particlesEnabled) {
                    createParticleExplosion(p.x, p.y, '#FFFFFF', 5);
                }
            } else if (p.x + p.radius > canvas.width) {
                p.x = canvas.width - p.radius;
                p.vx = -p.vx * 0.8;
                if (settings.particlesEnabled) {
                    createParticleExplosion(p.x, p.y, '#FFFFFF', 5);
                }
            }

            // Draw glow effect for player (shield stackable)
            if (p.isPlayer) {
                const shieldStack = gameState.powerUpStacks.shield;
                if (shieldStack.count > 0 && Date.now() < shieldStack.duration) {
                    ctx.save();
                    // Glow intensity scales with stack count
                    ctx.globalAlpha = 0.2 + (shieldStack.count * 0.1);
                    ctx.fillStyle = '#00BFFF';
                    const glowRadius = p.radius + 10 + (shieldStack.count * 3);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
            
            drawParticleSprite(ctx, p);
        }
        
        // Draw trails
        if (settings.trailsEnabled && playerBall) {
            for (let i = trails.length - 1; i >= 0; i--) {
                const trail = trails[i];
                trail.life -= 0.016;
                
                if (trail.life <= 0) {
                    trails.splice(i, 1);
                    continue;
                }
                
                ctx.save();
                ctx.globalAlpha = trail.life / trail.maxLife * 0.5;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Draw power-ups
        for (const pu of powerUps) {
            pu.rotation += 0.1;
            pu.pulse += 0.2;
            
            ctx.save();
            ctx.translate(pu.x, pu.y);
            ctx.rotate(pu.rotation);
            
            // Glow effect
            ctx.globalAlpha = 0.3 + Math.sin(pu.pulse) * 0.2;
            ctx.fillStyle = pu.color;
            ctx.beginPath();
            ctx.arc(0, 0, pu.radius + 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Main circle
            ctx.globalAlpha = 1;
            ctx.fillStyle = pu.color;
            ctx.beginPath();
            ctx.arc(0, 0, pu.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Icon
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pu.icon, 0, 0);
            
            ctx.restore();
        }
        
        // Draw visual effects
        for (let i = visualEffects.length - 1; i >= 0; i--) {
            const effect = visualEffects[i];
            effect.life -= 0.016;
            effect.radius += 20;
            
            if (effect.life <= 0) {
                visualEffects.splice(i, 1);
                continue;
            }
            
            ctx.save();
            ctx.globalAlpha = effect.life / effect.maxLife;
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        ctx.restore();
        requestAnimationFrame(animate);
    }

    animate();
})();

