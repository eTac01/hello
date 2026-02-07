/**
 * Valentine's Week 2026 — Main Application
 * Time-Locked Interactive Love Experience
 */

import './styles/main.css';
import SceneManager from './core/SceneManager.js';
import { timeGatekeeper } from './core/TimeGatekeeper.js';
import LandingScene from './components/LandingScene.js';
import { TIMELINE, ADMIN_CONFIG } from './utils/constants.js';

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
        this.createCursor();

        // Hide loading screen
        this.hideLoadingScreen();
    }

    createCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });

        // Add hover effect for interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('.interactive')) {
                cursor.classList.add('hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('.interactive')) {
                cursor.classList.remove('hover');
            }
        });


        // Setup admin panel
        this.setupAdminPanel();

        // Setup countdown
        this.setupCountdown();

        this.isInitialized = true;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 1000);
            }, 500);
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

        // Check if can enter
        if (!timeGatekeeper.canEnterExperience(dayIndex) && !timeGatekeeper.adminMode) {
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

    setupAdminPanel() {
        if (!ADMIN_CONFIG.enabled) return;

        // Detect if touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            // Long-press for mobile devices (1 second hold on bottom-right)
            let touchStartTime = 0;
            let touchTimer = null;

            document.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                const isBottomRight = touch.clientX > window.innerWidth - 100 &&
                    touch.clientY > window.innerHeight - 100;

                if (isBottomRight) {
                    touchStartTime = Date.now();
                    touchTimer = setTimeout(() => {
                        this.showAdminInput();
                    }, 1000); // 1 second hold
                }
            }, { passive: true });

            document.addEventListener('touchend', () => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
            }, { passive: true });

            document.addEventListener('touchmove', () => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
            }, { passive: true });
        } else {
            // Triple-click for desktop (bottom-right corner)
            let clickCount = 0;
            let lastClick = 0;

            document.addEventListener('click', (e) => {
                const now = Date.now();
                const isBottomRight = e.clientX > window.innerWidth - 100 &&
                    e.clientY > window.innerHeight - 100;

                if (!isBottomRight) {
                    clickCount = 0;
                    return;
                }

                if (now - lastClick < 500) {
                    clickCount++;
                } else {
                    clickCount = 1;
                }
                lastClick = now;

                if (clickCount >= 3) {
                    this.showAdminInput();
                    clickCount = 0;
                }
            });
        }
    }

    showAdminInput() {
        let panel = document.querySelector('.admin-panel');

        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'admin-panel';
            panel.innerHTML = `
        <input type="password" class="admin-input" placeholder="Admin password...">
      `;
            document.body.appendChild(panel);

            const input = panel.querySelector('.admin-input');
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const success = timeGatekeeper.authenticateAdmin(input.value);
                    if (success) {
                        panel.remove();
                        // Unlock all days for admin
                        TIMELINE.forEach((_, i) => timeGatekeeper.adminUnlockDay(i));
                        // Refresh capsule states
                        if (this.landingScene) {
                            this.landingScene.returnFromExperience();
                        }
                    } else {
                        input.value = '';
                        input.style.borderColor = '#e63946';
                    }
                }
            });
        }

        panel.classList.add('visible');
        panel.querySelector('.admin-input').focus();
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
