/**
 * ProposeDay — February 8th Experience
 * Theme: Confession
 * A simple romantic proposal experience
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class ProposeDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);

        // 3D Objects
        this.heart = null;
        this.particles = [];
    }

    getInstruction() {
        return 'Click the heart to reveal the message...';
    }

    getCompletionMessage() {
        return 'A moment of courage,<br>a lifetime of love.';
    }

    /**
     * Initialize Propose Day experience
     */
    async init() {
        this.createFloatingHeart();
        this.createRomanticParticles();
        this.setupInteraction();

        await super.init();

        // Start update loop
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    /**
     * Create floating heart
     */
    createFloatingHeart() {
        // Create heart shape
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 0.5, y + 0.5);
        heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
        heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
        heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
            depth: 0.3,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 2,
            bevelSize: 0.05,
            bevelThickness: 0.05
        };

        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        geometry.center();

        const material = new THREE.MeshStandardMaterial({
            color: COLORS_HEX.roseRed,
            metalness: 0.3,
            roughness: 0.4,
            emissive: COLORS_HEX.roseRed,
            emissiveIntensity: 0.5
        });

        this.heart = new THREE.Mesh(geometry, material);
        this.heart.position.set(0, 0, 0);
        this.heart.userData.clickable = true;
        this.group.add(this.heart);

        // Add glow
        const glowGeometry = geometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: COLORS_HEX.roseRed,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.scale.multiplyScalar(1.1);
        this.heart.add(glow);
    }

    /**
     * Create romantic particles
     */
    createRomanticParticles() {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: COLORS_HEX.champagneGold,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.group.add(particles);
        this.particles.push(particles);
    }

    /**
     * Setup interaction
     */
    setupInteraction() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('click', this.onHeartClick.bind(this));
    }

    /**
     * Handle heart click
     */
    onHeartClick(event) {
        if (!this.isActive || this.isCompleted) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
        const intersects = this.raycaster.intersectObject(this.heart);

        if (intersects.length > 0) {
            this.showProposal();
        }
    }

    /**
     * Show proposal message
     */
    showProposal() {
        const overlay = document.createElement('div');
        overlay.className = 'proposal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(18, 12, 24, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        overlay.innerHTML = `
            <div style="
                text-align: center;
                color: #ffffff;
                font-family: 'Patrick Hand', cursive;
                max-width: 600px;
                padding: 40px;
            ">
                <h1 style="
                    font-size: 3rem;
                    color: ${COLORS_HEX.roseRed};
                    margin-bottom: 30px;
                    text-shadow: 0 0 20px ${COLORS_HEX.roseRed};
                ">Will You Be Mine?</h1>
                <p style="
                    font-size: 1.5rem;
                    line-height: 1.8;
                    margin-bottom: 40px;
                ">
                    In this moment, I ask you to share this journey with me.
                    Every day with you is a gift, and I want to cherish them all.
                </p>
                <button id="accept-btn" style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.3rem;
                    padding: 15px 50px;
                    background: linear-gradient(135deg, #ff00ff, #ff69b4);
                    border: 2px solid #ffffff;
                    border-radius: 50px;
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
                    transition: all 0.3s;
                ">Accept ❤️</button>
            </div>
        `;

        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);

        overlay.querySelector('#accept-btn').addEventListener('click', () => {
            gsap.to(overlay, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    overlay.remove();
                    this.complete();
                }
            });
        });
    }

    /**
     * Update loop
     */
    update(delta, elapsed) {
        if (!this.isActive) return;

        // Rotate heart
        if (this.heart) {
            this.heart.rotation.y += delta * 0.5;
            this.heart.position.y = Math.sin(elapsed * 2) * 0.1;
        }

        // Animate particles
        this.particles.forEach(p => {
            p.rotation.y += delta * 0.1;
        });
    }

    /**
     * Dispose resources
     */
    dispose() {
        window.removeEventListener('click', this.onHeartClick.bind(this));

        if (this.unsubscribeUpdate) {
            this.unsubscribeUpdate();
        }

        super.dispose();
    }
}

export default ProposeDay;
