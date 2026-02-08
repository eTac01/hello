/**
 * Valentine's Week 2026 — Main Application
 * Time-Locked Interactive Love Experience
 */

import './styles/main.css';
import './styles/emoji-animations.css';
import SceneManager from './core/SceneManager.js';
import { timeGatekeeper } from './core/TimeGatekeeper.js';
import SmoothCursor from './core/SmoothCursor.js';
import LandingScene from './components/LandingScene.js';
import { TIMELINE } from './utils/constants.js';

// Experience imports (lazy loaded)
const experienceModules = {
    RoseDay: () => import('./experiences/RoseDay.js'),
    ProposeDay: () => import('./experiences/ProposeDay.js'),
    ChocolateDay: () => import('./experiences/ChocolateDay.js'),
    TeddyDay: () => import('./experiences/TeddyDay.js'),
    PromiseDay: () => import('./experiences/PromiseDay.js'),
    HugDay: () => import('./experiences/HugDay.js'),
    KissDay: () => import('./experiences/KissDay.js'),
    ValentineDay: () => import('./experiences/ValentineDay.js')
};

class App {
    constructor() {
        this.sceneManager = null;
        this.landingScene = null;
        this.currentExperience = null;
        this.isInitialized = false;
    }

    async init() {
        // Setup manipulation detection
        timeGatekeeper.onManipulationDetected = this.onManipulationDetected.bind(this);

        // Wait for time validation
        await timeGatekeeper.validateTime();

        // Check for manipulation
        if (timeGatekeeper.isManipulated) {
            this.showManipulationWarning();
            return;
        }

        // Initialize scene
        const container = document.getElementById('canvas-container');
        this.sceneManager = new SceneManager(container);

        // Create landing scene
        this.landingScene = new LandingScene(
            this.sceneManager,
            this.onDaySelected.bind(this)
        );

        // Start render loop
        this.sceneManager.start();

        // Create custom cursor
        this.cursor = new SmoothCursor();

        // Setup countdown
        this.setupCountdown();

        // Hide loading screen
        this.hideLoadingScreen();

        this.isInitialized = true;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500); // Reduced from 1000ms to 500ms
            }, 2500); // Reduced from 500ms to 2500ms for total ~3 seconds
        }
    }

    onManipulationDetected(reason) {
        console.warn('[App] Time manipulation detected:', reason);
        this.showManipulationWarning();
    }

    showManipulationWarning() {
        const warning = document.getElementById('manipulation-warning');
        if (warning) {
            warning.classList.add('visible');
        }

        // Stop scene if running
        if (this.sceneManager) {
            this.sceneManager.stop();
        }
    }

    async onDaySelected(dayIndex) {
        const dayData = TIMELINE[dayIndex];

        // FIRST: Check if this is a past event (yesterday or earlier)
        // This check must come BEFORE canEnterExperience to allow password prompt
        const dayState = timeGatekeeper.getDayState(dayIndex);
        if (dayState === 'completed') {
            // Show password prompt for past events
            this.showPastEventPassword(dayIndex);
            return;
        }

        // THEN: Check if can enter (for future days or other restrictions)
        if (!timeGatekeeper.canEnterExperience(dayIndex)) {
            console.log('[App] Cannot enter experience:', dayData.day);
            return;
        }

        // Load experience module
        const moduleName = dayData.experience;
        const moduleLoader = experienceModules[moduleName];

        if (!moduleLoader) {
            console.error('[App] Experience not found:', moduleName);
            return;
        }

        try {
            const module = await moduleLoader();
            const ExperienceClass = module.default;

            // Create experience instance
            this.currentExperience = new ExperienceClass(
                dayIndex,
                this.sceneManager,
                this.onExperienceComplete.bind(this)
            );

            // Initialize experience
            await this.currentExperience.init();
        } catch (error) {
            console.error('[App] Failed to load experience:', error);
            this.returnToLanding();
        }
    }

    showPastEventPassword(dayIndex) {
        const dayData = TIMELINE[dayIndex];

        // Create password overlay
        const overlay = document.createElement('div');
        overlay.className = 'past-event-password-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(13, 2, 28, 0.95), rgba(32, 14, 53, 0.95));
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s;
        `;

        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #2d1b4e, #120c18);
                border: 3px solid #ff00ff;
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 0 40px rgba(255, 0, 255, 0.5);
                text-align: center;
            ">
                <div style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 2rem;
                    color: #00ffff;
                    margin-bottom: 10px;
                    text-shadow: 0 0 15px #00ffff;
                ">
                    🔒 ${dayData.day}
                </div>
                <div style="
                    font-family: 'Patrick Hand', cursive;
                    font-size: 1.2rem;
                    color: #ffffff;
                    margin-bottom: 30px;
                    opacity: 0.8;
                ">
                    This is a past event. Enter password to relive:
                </div>
                <input 
                    type="password" 
                    class="past-event-password-input"
                    placeholder="Enter password..."
                    style="
                        width: 100%;
                        padding: 15px 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 2px solid #00ffff;
                        border-radius: 10px;
                        color: #ffffff;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.1rem;
                        text-align: center;
                        margin-bottom: 20px;
                        outline: none;
                        transition: all 0.3s;
                    "
                />
                <div class="password-error" style="
                    color: #ff0055;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 0.9rem;
                    min-height: 20px;
                    margin-bottom: 15px;
                "></div>
                <div style="display: flex; gap: 15px;">
                    <button class="past-event-unlock-btn" style="
                        flex: 1;
                        padding: 15px 30px;
                        background: linear-gradient(135deg, #ff00ff, #00ffff);
                        border: none;
                        border-radius: 10px;
                        color: #ffffff;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
                    ">
                        Unlock
                    </button>
                    <button class="past-event-cancel-btn" style="
                        flex: 1;
                        padding: 15px 30px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 2px solid #ff0055;
                        border-radius: 10px;
                        color: #ff0055;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fade in
        setTimeout(() => overlay.style.opacity = '1', 10);

        const input = overlay.querySelector('.past-event-password-input');
        const errorDiv = overlay.querySelector('.password-error');
        const unlockBtn = overlay.querySelector('.past-event-unlock-btn');
        const cancelBtn = overlay.querySelector('.past-event-cancel-btn');

        // Focus input
        input.focus();

        // Handle password verification
        const verifyPassword = () => {
            const password = input.value.trim();

            // Password for past events: "memories" (you can change this)
            if (password === 'memories') {
                // Correct password - close overlay and start experience
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);

                // Load the experience (bypass past event check)
                this.loadExperienceDirect(dayIndex);
            } else {
                // Wrong password
                errorDiv.textContent = '❌ Incorrect password';
                input.value = '';
                input.focus();

                // Shake animation
                input.style.animation = 'shake 0.5s';
                setTimeout(() => input.style.animation = '', 500);
            }
        };

        // Event listeners
        unlockBtn.addEventListener('click', verifyPassword);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') verifyPassword();
        });

        cancelBtn.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        });

        // Hover effects
        unlockBtn.addEventListener('mouseenter', () => {
            unlockBtn.style.transform = 'scale(1.05)';
            unlockBtn.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.6)';
        });
        unlockBtn.addEventListener('mouseleave', () => {
            unlockBtn.style.transform = 'scale(1)';
            unlockBtn.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.4)';
        });

        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.transform = 'scale(1.05)';
            cancelBtn.style.background = 'rgba(255, 0, 85, 0.2)';
        });
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.transform = 'scale(1)';
            cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    }

    async loadExperienceDirect(dayIndex) {
        const dayData = TIMELINE[dayIndex];
        const moduleName = dayData.experience;
        const moduleLoader = experienceModules[moduleName];

        if (!moduleLoader) {
            console.error('[App] Experience not found:', moduleName);
            return;
        }

        try {
            const module = await moduleLoader();
            const ExperienceClass = module.default;

            // Create experience instance
            this.currentExperience = new ExperienceClass(
                dayIndex,
                this.sceneManager,
                this.onExperienceComplete.bind(this)
            );

            // Initialize experience
            await this.currentExperience.init();
        } catch (error) {
            console.error('[App] Failed to load experience:', error);
            this.returnToLanding();
        }
    }

    onExperienceComplete(dayIndex, exitedEarly = false) {
        console.log('[App] Experience complete:', TIMELINE[dayIndex].day, exitedEarly ? '(exited early)' : '');

        // Clean up current experience
        if (this.currentExperience) {
            this.currentExperience.dispose();
            this.currentExperience = null;
        }

        // Return to landing
        this.returnToLanding();
    }

    returnToLanding() {
        if (this.landingScene) {
            this.landingScene.returnFromExperience();
        }
    }

    setupCountdown() {
        const updateCountdown = () => {
            const countdown = timeGatekeeper.formatCountdown();

            let countdownEl = document.querySelector('.countdown');
            if (!countdownEl) {
                countdownEl = document.createElement('div');
                countdownEl.className = 'countdown';
                countdownEl.innerHTML = `
          <div class="label">Time remaining</div>
          <div class="time"></div>
        `;
                document.getElementById('ui-overlay').appendChild(countdownEl);
            }

            const timeEl = countdownEl.querySelector('.time');
            if (timeEl) {
                timeEl.textContent = countdown.formatted;
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(console.error);
});

export default App;
