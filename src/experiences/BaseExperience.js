/**
 * BaseExperience — Abstract base class for daily experiences
 * All day experiences extend this class
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { TIMELINE, COLORS_HEX } from '../utils/constants.js';
import { timeGatekeeper } from '../core/TimeGatekeeper.js';

class BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        this.dayIndex = dayIndex;
        this.sceneManager = sceneManager;
        this.onComplete = onComplete;
        this.dayData = TIMELINE[dayIndex];
        this.isActive = false;
        this.isCompleted = false;
        this.group = new THREE.Group();
        this.ui = null;

        // Experience lifecycle
        this.phase = 'intro'; // 'intro', 'interactive', 'outro'
    }

    /**
     * Initialize the experience
     */
    async init() {
        this.sceneManager.scene.add(this.group);
        this.createUI();
        this.isActive = true;

        // Fade in
        this.group.visible = true;

        // Play intro
        await this.playIntro();

        // Enter interactive phase
        this.phase = 'interactive';
        this.showInstruction();
    }

    /**
     * Create UI elements
     */
    createUI() {
        this.ui = document.createElement('div');
        this.ui.className = 'experience-ui';
        this.ui.innerHTML = `
      <p class="instruction"></p>
    `;
        document.getElementById('ui-overlay').appendChild(this.ui);

        // Create exit button
        this.exitButton = document.createElement('button');
        this.exitButton.className = 'exit-button';
        this.exitButton.textContent = 'Return';
        this.exitButton.addEventListener('click', () => this.exit());
        document.body.appendChild(this.exitButton);

        setTimeout(() => {
            this.exitButton.classList.add('visible');
        }, 2000);
    }

    /**
     * Show instruction text
     */
    showInstruction() {
        if (!this.ui) return;
        const instruction = this.ui.querySelector('.instruction');
        if (instruction) {
            instruction.textContent = this.getInstruction();
            gsap.to(instruction, { opacity: 1, duration: 1 });
        }
    }

    /**
     * Get instruction text — override in subclass
     */
    getInstruction() {
        return 'Experience the moment...';
    }

    /**
     * Play intro animation — override in subclass
     */
    async playIntro() {
        return new Promise(resolve => {
            gsap.from(this.group.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: 'power3.out',
                onComplete: resolve
            });
        });
    }

    /**
     * Play outro animation — override in subclass
     */
    async playOutro() {
        return new Promise(resolve => {
            gsap.to(this.group, {
                opacity: 0,
                duration: 1.5,
                ease: 'power3.inOut',
                onComplete: resolve
            });
        });
    }

    /**
     * Complete the experience
     */
    async complete() {
        if (this.isCompleted) return;
        this.isCompleted = true;
        this.phase = 'outro';

        // Mark as visited
        timeGatekeeper.markExperienceVisited(this.dayIndex);

        // Show completion message
        this.showCompletion();

        // Wait for user acknowledgment
        await this.waitForContinue();

        // Play outro
        await this.playOutro();

        // Callback
        if (this.onComplete) {
            this.onComplete(this.dayIndex);
        }
    }

    /**
     * Show completion overlay
     */
    showCompletion() {
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        overlay.innerHTML = `
      <p class="message">${this.getCompletionMessage()}</p>
    `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('visible');
        }, 100);

        this.completionOverlay = overlay;
    }

    /**
     * Get completion message — override in subclass
     */
    getCompletionMessage() {
        return 'This moment is now part of you.';
    }

    /**
     * Wait for user to click to continue
     */
    waitForContinue() {
        return new Promise(resolve => {
            const handler = () => {
                window.removeEventListener('click', handler);
                if (this.completionOverlay) {
                    gsap.to(this.completionOverlay, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            this.completionOverlay.remove();
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            };

            setTimeout(() => {
                window.addEventListener('click', handler);
            }, 2000);
        });
    }

    /**
     * Exit without completing (return to landing)
     */
    exit() {
        this.isActive = false;
        this.dispose();

        if (this.onComplete) {
            this.onComplete(this.dayIndex, true); // true = exited early
        }
    }

    /**
     * Update loop — override in subclass
     */
    update(delta, elapsed) {
        // To be implemented by subclasses
    }

    /**
     * Handle mouse/touch input — override in subclass
     */
    onPointerMove(x, y) {
        // To be implemented by subclasses
    }

    /**
     * Handle click — override in subclass
     */
    onClick(x, y) {
        // To be implemented by subclasses
    }

    /**
     * Dispose resources
     */
    dispose() {
        this.isActive = false;

        if (this.ui && this.ui.parentNode) {
            this.ui.parentNode.removeChild(this.ui);
        }

        if (this.exitButton && this.exitButton.parentNode) {
            this.exitButton.parentNode.removeChild(this.exitButton);
        }

        if (this.completionOverlay && this.completionOverlay.parentNode) {
            this.completionOverlay.parentNode.removeChild(this.completionOverlay);
        }

        this.group.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });

        if (this.group.parent) {
            this.sceneManager.scene.remove(this.group);
        }
    }
}

export default BaseExperience;
