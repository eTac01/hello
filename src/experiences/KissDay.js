/**
 * KissDay — February 13th
 * Theme: Intimacy — Particle dance convergence
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class KissDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);
        this.particles1 = null;
        this.particles2 = null;
    }

    getInstruction() { return 'Draw them closer...'; }
    getCompletionMessage() { return 'A kiss is a conversation<br>without words.'; }

    async init() {
        this.createParticleSets();
        this.setupInteraction();
        await super.init();
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createParticleSets() {
        const createCloud = (color, centerX) => {
            const count = 150;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const r = 0.5 + Math.random() * 0.5;
                pos[i * 3] = centerX + (Math.random() - 0.5) * r;
                pos[i * 3 + 1] = (Math.random() - 0.5) * r;
                pos[i * 3 + 2] = (Math.random() - 0.5) * r;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

            const mat = new THREE.PointsMaterial({
                color, size: 0.08, transparent: true, opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            return new THREE.Points(geo, mat);
        };

        this.particles1 = createCloud(COLORS_HEX.champagneGold, -2);
        this.particles2 = createCloud(COLORS_HEX.roseRed, 2);
        this.group.add(this.particles1, this.particles2);
    }

    setupInteraction() {
        this.mousePos = { x: 0, y: 0 };
        this.boundMouseMove = (e) => {
            this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', this.boundMouseMove);
    }

    update(delta, elapsed) {
        if (!this.isActive) return;

        const t1X = -2 + (1 - Math.abs(this.mousePos.x)) * 1.5;
        const t2X = 2 - (1 - Math.abs(this.mousePos.x)) * 1.5;

        this.particles1.position.x += (t1X - this.particles1.position.x) * 0.02;
        this.particles2.position.x += (t2X - this.particles2.position.x) * 0.02;

        const dist = this.particles1.position.distanceTo(this.particles2.position);
        if (dist < 1 && !this.isCompleted) this.onComplete_();
    }

    async onComplete_() {
        const center = this.particles1.position.clone().add(this.particles2.position).multiplyScalar(0.5);
        gsap.to(this.particles1.position, { x: center.x, duration: 1.5 });
        gsap.to(this.particles2.position, { x: center.x, duration: 1.5, onComplete: () => this.complete() });
    }

    dispose() {
        if (this.unsubscribeUpdate) this.unsubscribeUpdate();
        window.removeEventListener('mousemove', this.boundMouseMove);
        super.dispose();
    }
}

export default KissDay;
