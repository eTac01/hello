/**
 * ValentineDay — February 14th
 * Theme: Union — Two light entities merge into one
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class ValentineDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);
        this.entity1 = null;
        this.entity2 = null;
        this.mergeProgress = 0;
    }

    getInstruction() { return 'Witness the union...'; }
    getCompletionMessage() { return 'Two souls,<br>one light,<br>eternal.'; }

    async init() {
        this.createEntities();
        await super.init();
        this.startAutonomousMotion();
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createEntities() {
        const createEntity = (color, startPos) => {
            const group = new THREE.Group();

            const core = new THREE.Mesh(
                new THREE.IcosahedronGeometry(0.4, 2),
                new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
            );
            group.add(core);

            const glow = new THREE.Mesh(
                new THREE.IcosahedronGeometry(0.7, 2),
                new THREE.MeshBasicMaterial({
                    color, transparent: true, opacity: 0.3,
                    side: THREE.BackSide, blending: THREE.AdditiveBlending
                })
            );
            group.add(glow);

            group.position.copy(startPos);
            group.userData = { core, glow, velocity: new THREE.Vector3() };
            return group;
        };

        this.entity1 = createEntity(COLORS_HEX.champagneGold, new THREE.Vector3(-3, 1, 0));
        this.entity2 = createEntity(COLORS_HEX.roseRed, new THREE.Vector3(3, -1, 0));

        this.group.add(this.entity1, this.entity2);
    }

    startAutonomousMotion() {
        // Entities slowly drift toward each other
        const timeline = gsap.timeline();

        timeline.to(this.entity1.position, {
            x: -1, y: 0.5, duration: 8, ease: 'sine.inOut'
        }, 0);

        timeline.to(this.entity2.position, {
            x: 1, y: -0.5, duration: 8, ease: 'sine.inOut'
        }, 0);

        timeline.to(this.entity1.position, {
            x: 0.3, y: 0, duration: 6, ease: 'power2.in'
        }, 8);

        timeline.to(this.entity2.position, {
            x: -0.3, y: 0, duration: 6, ease: 'power2.in',
            onComplete: () => this.onMerge()
        }, 8);
    }

    onMerge() {
        if (this.isCompleted) return;

        // Create merged entity
        const merged = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.5, 3),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })
        );
        merged.position.set(0, 0, 0);
        this.group.add(merged);

        // Hide original entities
        gsap.to([this.entity1, this.entity2], {
            visible: false, duration: 0.5
        });

        // Radiant expansion
        gsap.to(merged.scale, {
            x: 15, y: 15, z: 15, duration: 3, ease: 'power2.out'
        });

        gsap.to(merged.material, {
            opacity: 0, duration: 3, delay: 0.5,
            onComplete: () => this.complete()
        });
    }

    update(delta, elapsed) {
        if (!this.isActive) return;

        // Gentle rotation
        if (this.entity1) this.entity1.rotation.y += delta * 0.5;
        if (this.entity2) this.entity2.rotation.y -= delta * 0.5;

        // Pulse animation
        const pulse = Math.sin(elapsed * 2) * 0.1 + 1;
        if (this.entity1?.userData.glow) {
            this.entity1.userData.glow.scale.setScalar(pulse);
        }
        if (this.entity2?.userData.glow) {
            this.entity2.userData.glow.scale.setScalar(pulse);
        }
    }

    dispose() {
        if (this.unsubscribeUpdate) this.unsubscribeUpdate();
        super.dispose();
    }
}

export default ValentineDay;
