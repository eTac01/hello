/**
 * TimeGatekeeper — The Authority of Time
 * UTC-based validation with anti-manipulation detection
 */

import { TIMELINE, ADMIN_CONFIG } from '../utils/constants.js';

class TimeGatekeeper {
    constructor() {
        this.currentDate = null;
        this.activeDay = null;
        this.isManipulated = false;
        this.adminMode = false;
        this.adminUnlockedDays = new Set();
        this.onManipulationDetected = null;
        this.lastCheck = performance.now();
        this.visitedToday = false;

        // Initialize
        this.init();
    }

    async init() {
        await this.validateTime();
        this.startMonitoring();
        this.checkVisitStatus();
    }

    /**
     * Get current UTC date string (YYYY-MM-DD)
     */
    getUTCDateString(date = new Date()) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Validate time using multiple sources
     */
    async validateTime() {
        const localTime = new Date();
        const localDateString = this.getUTCDateString(localTime);

        let serverTime = null;
        let serverDateString = null;

        try {
            // Fetch external time source
            const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                serverTime = new Date(data.utc_datetime);
                serverDateString = this.getUTCDateString(serverTime);

                // Check for significant drift (more than 2 minutes)
                const drift = Math.abs(localTime - serverTime);
                if (drift > 120000) {
                    console.warn('[TimeGatekeeper] Time drift detected:', drift, 'ms');
                    this.triggerManipulationWarning('drift');
                    return;
                }
            }
        } catch (error) {
            console.log('[TimeGatekeeper] External time check unavailable, using local time');
            // Fallback to local time if API unavailable
        }

        // Use server time if available, otherwise local
        this.currentDate = serverDateString || localDateString;
        this.activeDay = this.getActiveDay();
    }

    /**
     * Get the active day from timeline
     */
    getActiveDay() {
        return TIMELINE.find(day => day.date === this.currentDate) || null;
    }

    /**
     * Get capsule state for a specific day
     * @returns 'active' | 'past' | 'future' | 'locked'
     */
    getCapsuleState(dayIndex) {
        const day = TIMELINE[dayIndex];
        if (!day) return 'locked';

        // Admin override
        if (this.adminUnlockedDays.has(dayIndex)) {
            return 'active';
        }

        const dayDate = new Date(day.date + 'T00:00:00Z');
        const currentDate = new Date(this.currentDate + 'T00:00:00Z');

        if (dayDate.getTime() === currentDate.getTime()) {
            return 'active';
        } else if (dayDate < currentDate) {
            return 'past';
        } else {
            return 'future';
        }
    }

    /**
     * Check if experience can be entered
     */
    canEnterExperience(dayIndex) {
        const state = this.getCapsuleState(dayIndex);
        if (state !== 'active') return false;

        // Check if already visited today (anti-replay)
        const visitKey = `valentine_visited_${TIMELINE[dayIndex].date}`;
        const visited = localStorage.getItem(visitKey);

        if (visited && !this.adminMode) {
            // Already completed this experience
            return false;
        }

        return true;
    }

    /**
     * Mark experience as visited
     */
    markExperienceVisited(dayIndex) {
        const visitKey = `valentine_visited_${TIMELINE[dayIndex].date}`;
        localStorage.setItem(visitKey, Date.now().toString());
        this.visitedToday = true;
    }

    /**
     * Check if user has visited today's experience
     */
    checkVisitStatus() {
        if (!this.activeDay) return;
        const visitKey = `valentine_visited_${this.activeDay.date}`;
        this.visitedToday = !!localStorage.getItem(visitKey);
    }

    /**
     * Start continuous time monitoring
     */
    startMonitoring() {
        // Check for time manipulation every 10 seconds
        setInterval(() => {
            const now = performance.now();
            const elapsed = now - this.lastCheck;

            // If elapsed time is negative or way too large, something's wrong
            if (elapsed < 0 || elapsed > 60000) {
                this.triggerManipulationWarning('performance');
            }

            this.lastCheck = now;
        }, 10000);

        // Revalidate time every minute
        setInterval(() => {
            this.validateTime();
        }, 60000);
    }

    /**
     * Trigger manipulation warning
     */
    triggerManipulationWarning(reason) {
        console.warn('[TimeGatekeeper] Manipulation detected:', reason);
        this.isManipulated = true;

        if (this.onManipulationDetected) {
            this.onManipulationDetected(reason);
        }
    }

    /**
     * Admin authentication
     */
    authenticateAdmin(password) {
        if (password === ADMIN_CONFIG.passwordHash) {
            this.adminMode = true;
            console.log('[TimeGatekeeper] Admin mode activated');
            return true;
        }
        return false;
    }

    /**
     * Admin: Unlock specific day
     */
    adminUnlockDay(dayIndex) {
        if (!this.adminMode) return false;
        this.adminUnlockedDays.add(dayIndex);
        return true;
    }

    /**
     * Get time until midnight UTC
     */
    getTimeUntilMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setUTCHours(24, 0, 0, 0);
        return midnight - now;
    }

    /**
     * Format countdown time
     */
    formatCountdown() {
        const ms = this.getTimeUntilMidnight();
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        };
    }

    /**
     * Check if we're in Valentine's Week
     */
    isWithinValentineWeek() {
        if (!this.currentDate) return false;
        const current = new Date(this.currentDate);
        const start = new Date('2026-02-07');
        const end = new Date('2026-02-14');
        return current >= start && current <= end;
    }

    /**
     * Get days status summary
     */
    getDaysStatus() {
        return TIMELINE.map((day, index) => ({
            ...day,
            state: this.getCapsuleState(index),
            canEnter: this.canEnterExperience(index)
        }));
    }
}

// Singleton instance
export const timeGatekeeper = new TimeGatekeeper();
export default TimeGatekeeper;
