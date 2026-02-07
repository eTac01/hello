/**
 * Valentine's Week 2026 — Constants
 * Color palette, timeline, and configuration
 */

// STRICT Color Palette
export const COLORS = {
    charcoal: '#0b0b0f',
    charcoalRGB: { r: 11, g: 11, b: 15 },
    roseRed: '#e63946',
    roseRedRGB: { r: 230, g: 57, b: 70 },
    champagneGold: '#f1c27d',
    champagneGoldRGB: { r: 241, g: 194, b: 125 }
};

// Three.js compatible colors (0x hex)
export const COLORS_HEX = {
    charcoal: 0x0b0b0f,
    roseRed: 0xe63946,
    champagneGold: 0xf1c27d
};

// Valentine's Week Timeline (Hard-Coded)
export const TIMELINE = [
    {
        date: '2026-02-07',
        day: 'Rose Day',
        theme: 'Admiration',
        index: 0,
        experience: 'RoseDay'
    },
    {
        date: '2026-02-08',
        day: 'Propose Day',
        theme: 'Confession',
        index: 1,
        experience: 'ProposeDay'
    },
    {
        date: '2026-02-09',
        day: 'Chocolate Day',
        theme: 'Sweetness',
        index: 2,
        experience: 'ChocolateDay'
    },
    {
        date: '2026-02-10',
        day: 'Teddy Day',
        theme: 'Comfort',
        index: 3,
        experience: 'TeddyDay'
    },
    {
        date: '2026-02-11',
        day: 'Promise Day',
        theme: 'Trust',
        index: 4,
        experience: 'PromiseDay'
    },
    {
        date: '2026-02-12',
        day: 'Hug Day',
        theme: 'Warmth',
        index: 5,
        experience: 'HugDay'
    },
    {
        date: '2026-02-13',
        day: 'Kiss Day',
        theme: 'Intimacy',
        index: 6,
        experience: 'KissDay'
    },
    {
        date: '2026-02-14',
        day: 'Valentine\'s Day',
        theme: 'Union',
        index: 7,
        experience: 'ValentineDay'
    }
];

// Capsule positions in orbital ring (8 positions, evenly spaced)
export const CAPSULE_POSITIONS = TIMELINE.map((_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2; // Start from top
    const radius = 4;
    return {
        x: Math.cos(angle) * radius,
        y: 0,
        z: Math.sin(angle) * radius,
        angle
    };
});

// Animation settings
export const ANIMATION = {
    easing: 'power3.inOut',
    capsuleRotationSpeed: 0.0002,
    heartbeatDuration: 1.5,
    transitionDuration: 1.2,
    particleCount: 500
};

// Performance tiers
export const QUALITY_TIERS = {
    high: {
        particleCount: 1000,
        shadowMapSize: 2048,
        antialias: true,
        postProcessing: true
    },
    medium: {
        particleCount: 500,
        shadowMapSize: 1024,
        antialias: true,
        postProcessing: true
    },
    low: {
        particleCount: 200,
        shadowMapSize: 512,
        antialias: false,
        postProcessing: false
    }
};

// Admin override (hashed password check)
export const ADMIN_CONFIG = {
    enabled: true,
    // Simple obfuscation - in production, use proper auth
    passwordHash: 'valentine2026admin'
};
