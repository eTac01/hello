/**
 * Custom easing functions for GSAP and animations
 */

// Cubic bezier easing
export const easeInOutExpo = (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) {
        return Math.pow(2, 20 * t - 10) / 2;
    }
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

export const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const easeInExpo = (t) => {
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
};

// Smooth step (for shader transitions)
export const smoothstep = (edge0, edge1, x) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

// Elastic easing (for bouncy effects)
export const easeOutElastic = (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
        ? 0
        : t === 1
            ? 1
            : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// Breathing animation (for heartbeat)
export const breathe = (t, intensity = 1) => {
    return (Math.sin(t * Math.PI * 2) * 0.5 + 0.5) * intensity;
};

// Map value from one range to another
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Clamp value between min and max
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

// Linear interpolation
export const lerp = (a, b, t) => {
    return a + (b - a) * t;
};

// Damped lerp for smooth following
export const damp = (a, b, lambda, dt) => {
    return lerp(a, b, 1 - Math.exp(-lambda * dt));
};
