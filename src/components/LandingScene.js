/**
 * LandingScene — Orbital Ring of Time Capsules
 * The entry experience with 8 capsules in atmospheric void
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import Capsule from './Capsule.js';
import { TIMELINE, ANIMATION, COLORS_HEX } from '../utils/constants.js';
import { timeGatekeeper } from '../core/TimeGatekeeper.js';

class LandingScene {
    constructor(sceneManager, onDaySelected) {
        this.sceneManager = sceneManager;
        this.onDaySelected = onDaySelected;
        this.capsules = [];
        this.ringGroup = new THREE.Group();
        this.raycaster = new THREE.Raycaster();
        this.hoveredCapsule = null;
        this.isActive = true;

        this.init();
    }

    /**
     * Initialize the landing scene
     */
    init() {
        // Add ring group to scene
        this.sceneManager.scene.add(this.ringGroup);

        // Cyberpunk Environment
        this.createEnvironment();

        // Create capsules
        this.createCapsules();

        // Create central attraction point
        this.createCenterPoint();

        // Setup interaction
        this.setupInteraction();
        this.setupDoubleClickInteraction();

        // Register update callback
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));

        // Initial camera position (Adjusted for better view of floor)
        this.sceneManager.camera.position.set(0, 4, 12);
        this.sceneManager.camera.lookAt(0, 0, 0);

        // Add fog for depth
        this.sceneManager.scene.fog = new THREE.FogExp2(COLORS_HEX.charcoal, 0.02);
    }

    /**
     * Create Cyberpunk Environment (Grid + Floor)
     */
    createEnvironment() {
        // 1. Neon Grid Floor
        const gridHelper = new THREE.GridHelper(40, 40, COLORS_HEX.roseRed, COLORS_HEX.deepPurple);
        gridHelper.position.y = -2;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.sceneManager.scene.add(gridHelper);

        // 2. Reflective "Wet" Floor
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: COLORS_HEX.charcoal,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(planeGeometry, planeMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.01; // Just below grid
        this.sceneManager.scene.add(floor);

        // 3. Ambient Light for floor reflections
        const ambientLight = new THREE.AmbientLight(COLORS_HEX.deepPurple, 2.0);
        this.sceneManager.scene.add(ambientLight);

        // 4. Point lights for neon glow spots
        const blueLight = new THREE.PointLight(COLORS_HEX.champagneGold, 2, 20);
        blueLight.position.set(5, 2, 5);
        this.sceneManager.scene.add(blueLight);

        const pinkLight = new THREE.PointLight(COLORS_HEX.roseRed, 2, 20);
        pinkLight.position.set(-5, 2, 5);
        this.sceneManager.scene.add(pinkLight);
    }

    /**
     * Create all 8 capsules
     */
    createCapsules() {
        TIMELINE.forEach((day, index) => {
            const capsule = new Capsule(index, this.sceneManager);

            // Set initial state based on time
            const state = timeGatekeeper.getCapsuleState(index);
            capsule.setState(state);

            this.capsules.push(capsule);
        });
    }

    /**
     * Create glowing center point
     */
    createCenterPoint() {
        const geometry = new THREE.SphereGeometry(0.15, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(COLORS_HEX.roseRed) },
                uColor2: { value: new THREE.Color(COLORS_HEX.champagneGold) }
            },
            vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, pulse);
          
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          float alpha = 0.3 + fresnel * 0.7;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.centerPoint = new THREE.Mesh(geometry, material);
        this.centerPoint.position.set(0, 0, 0);
        this.ringGroup.add(this.centerPoint);

        // Add connecting lines to capsules
        this.createConnections();
    }

    /**
     * Create subtle connection lines
     */
    createConnections() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: COLORS_HEX.champagneGold,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });

        this.capsules.forEach(capsule => {
            const points = [
                new THREE.Vector3(0, 0, 0),
                capsule.mesh.position.clone()
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            this.ringGroup.add(line);
        });
    }

    /**
     * Setup mouse/touch interaction
     */
    setupInteraction() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));

        // Touch events for mobile
        window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    }

    /**
     * Touch start handler
     */
    onTouchStart(event) {
        if (!this.isActive || event.touches.length === 0) return;

        const touch = event.touches[0];
        this.updateTouchHover(touch);
    }

    /**
     * Touch move handler
     */
    onTouchMove(event) {
        if (!this.isActive || event.touches.length === 0) return;

        const touch = event.touches[0];
        this.updateTouchHover(touch);
    }

    /**
     * Touch end handler (same as click)
     */
    onTouchEnd(event) {
        if (!this.isActive || !this.hoveredCapsule) return;

        const result = this.hoveredCapsule.onClick();

        if (result.action === 'enter') {
            this.enterExperience(result.dayIndex);
        } else if (result.action === 'showPastMessage') {
            this.showMessage('past', result.dayIndex);
        } else if (result.action === 'showFutureMessage') {
            this.showMessage('future', result.dayIndex);
        }

        // Clear hover state after tap
        if (this.hoveredCapsule) {
            this.hoveredCapsule.onHoverExit();
            this.hoveredCapsule = null;
            this.hideDayInfo();
        }
    }

    /**
     * Update hover state based on touch position
     */
    updateTouchHover(touch) {
        const mouse = new THREE.Vector2(
            (touch.clientX / window.innerWidth) * 2 - 1,
            -(touch.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.sceneManager.camera);

        const meshes = this.capsules.map(c => c.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const capsuleIndex = intersects[0].object.userData.dayIndex;
            const capsule = this.capsules[capsuleIndex];

            if (this.hoveredCapsule !== capsule) {
                if (this.hoveredCapsule) {
                    this.hoveredCapsule.onHoverExit();
                }
                this.hoveredCapsule = capsule;
                capsule.onHover();
                this.showDayInfo(capsuleIndex);
            }
        } else {
            if (this.hoveredCapsule) {
                this.hoveredCapsule.onHoverExit();
                this.hoveredCapsule = null;
                this.hideDayInfo();
            }
        }
    }

    /**
     * Mouse move handler for hover effects
     */
    onMouseMove(event) {
        if (!this.isActive) return;

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.sceneManager.camera);

        // Get capsule meshes
        const meshes = this.capsules.map(c => c.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const capsuleIndex = intersects[0].object.userData.dayIndex;
            const capsule = this.capsules[capsuleIndex];

            if (this.hoveredCapsule !== capsule) {
                if (this.hoveredCapsule) {
                    this.hoveredCapsule.onHoverExit();
                }
                this.hoveredCapsule = capsule;
                capsule.onHover();

                // Show day info
                this.showDayInfo(capsuleIndex);
            }
        } else {
            if (this.hoveredCapsule) {
                this.hoveredCapsule.onHoverExit();
                this.hoveredCapsule = null;
                this.hideDayInfo();
            }
        }

        // Update cursor state for locked capsules
        const cursor = document.getElementById('cursor');
        if (cursor && this.hoveredCapsule) {
            const state = timeGatekeeper.getCapsuleState(this.hoveredCapsule.dayIndex);
            if (state !== 'active') {
                cursor.classList.add('locked');
                cursor.classList.remove('hover');
            } else {
                cursor.classList.remove('locked');
            }
        } else if (cursor) {
            cursor.classList.remove('locked', 'hover');
        }
    }

    /**
     * Click handler
     */
    onClick(event) {
        if (!this.isActive || !this.hoveredCapsule) return;

        const result = this.hoveredCapsule.onClick();

        if (result.action === 'enter') {
            // Navigate to experience
            this.enterExperience(result.dayIndex);
        } else if (result.action === 'showPastMessage') {
            this.showMessage('past', result.dayIndex);
        } else if (result.action === 'showFutureMessage') {
            this.showMessage('future', result.dayIndex);
        }
    }

    /**
     * Enter an experience
     */
    async enterExperience(dayIndex) {
        this.isActive = false;

        const capsule = this.capsules[dayIndex];

        // Animate camera toward capsule
        await this.sceneManager.animateCameraTo(
            {
                x: capsule.mesh.position.x * 0.3,
                y: capsule.mesh.position.y + 1,
                z: capsule.mesh.position.z * 0.3 + 2
            },
            capsule.mesh.position,
            1.5
        );

        // Fade out
        gsap.to(this.ringGroup, {
            visible: false,
            duration: 0.5
        });

        // Callback to main app
        if (this.onDaySelected) {
            this.onDaySelected(dayIndex);
        }
    }

    /**
     * Show day info overlay
     */
    showDayInfo(dayIndex) {
        const dayData = TIMELINE[dayIndex];
        const state = timeGatekeeper.getCapsuleState(dayIndex);

        let existingInfo = document.querySelector('.day-info');
        if (!existingInfo) {
            existingInfo = document.createElement('div');
            existingInfo.className = 'day-info';
            existingInfo.innerHTML = `
        <div class="day-name"></div>
        <div class="day-theme"></div>
      `;
            document.getElementById('ui-overlay').appendChild(existingInfo);
        }

        const dayNameEl = existingInfo.querySelector('.day-name');
        const dayThemeEl = existingInfo.querySelector('.day-theme');

        dayNameEl.textContent = dayData.day;

        if (state === 'past') {
            dayThemeEl.textContent = 'This moment has passed';
            dayThemeEl.style.color = 'rgba(241, 194, 125, 0.3)';
        } else if (state === 'future') {
            dayThemeEl.textContent = 'Not yet...';
            dayThemeEl.style.color = 'rgba(230, 57, 70, 0.5)';
        } else {
            dayThemeEl.textContent = dayData.theme;
            dayThemeEl.style.color = '';
        }

        existingInfo.classList.add('visible');
    }

    /**
     * Hide day info overlay
     */
    hideDayInfo() {
        const existingInfo = document.querySelector('.day-info');
        if (existingInfo) {
            existingInfo.classList.remove('visible');
        }
    }

    /**
     * Show message for locked capsules
     */
    showMessage(type, dayIndex) {
        const dayData = TIMELINE[dayIndex];

        let messageBox = document.querySelector('.lock-message');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.className = 'lock-message';
            messageBox.innerHTML = `<div class="text"></div>`;
            document.getElementById('ui-overlay').appendChild(messageBox);
        }

        const textEl = messageBox.querySelector('.text');
        messageBox.classList.remove('past', 'future');
        messageBox.classList.add(type);

        if (type === 'past') {
            textEl.innerHTML = `${dayData.day} has slipped through time.<br>It cannot be recovered.`;
        } else {
            textEl.innerHTML = `${dayData.day} awaits.<br>Patience is part of love.`;
        }

        messageBox.classList.add('visible');

        setTimeout(() => {
            messageBox.classList.remove('visible');
        }, 3000);
    }

    /**
     * Update loop
     */
    update(delta, elapsed) {
        if (!this.isActive) return;

        // Rotate ring slowly
        this.ringGroup.rotation.y += ANIMATION.capsuleRotationSpeed;

        // Update center point
        if (this.centerPoint && this.centerPoint.material.uniforms) {
            this.centerPoint.material.uniforms.uTime.value = elapsed;
        }

        // Update each capsule
        this.capsules.forEach(capsule => {
            capsule.update(delta, elapsed);
        });
    }

    /**
     * Return to landing from experience
     */
    returnFromExperience() {
        this.ringGroup.visible = true;
        this.isActive = true;

        // Reset camera
        this.sceneManager.animateCameraTo(
            { x: 0, y: 3, z: 10 },
            { x: 0, y: 0, z: 0 },
            1.5
        );

        // Update capsule states (in case midnight passed)
        this.capsules.forEach((capsule, index) => {
            const state = timeGatekeeper.getCapsuleState(index);
            capsule.setState(state);
        });
    }

    /**
     * Dispose resources
     */
    dispose() {
        this.isActive = false;

        if (this.unsubscribeUpdate) {
            this.unsubscribeUpdate();
        }

        this.capsules.forEach(capsule => capsule.dispose());

        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('click', this.onClick.bind(this));

        if (this.ringGroup.parent) {
            this.sceneManager.scene.remove(this.ringGroup);
        }
    }

    setupDoubleClickInteraction() {
        window.addEventListener('dblclick', () => {
            this.triggerTimeAcceleration();
        });
    }

    triggerTimeAcceleration() {
        // Rotate ring faster
        gsap.to(this.ringGroup.rotation, {
            y: this.ringGroup.rotation.y + Math.PI * 2,
            duration: 2,
            ease: 'power4.inOut'
        });

        // Pulse center
        if (this.centerPoint) {
            gsap.fromTo(this.centerPoint.scale,
                { x: 1, y: 1, z: 1 },
                { x: 2, y: 2, z: 2, duration: 1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            );
        }

        // Flash effect
        if (this.centerPoint && this.centerPoint.material.uniforms) {
            gsap.to(this.centerPoint.material.uniforms.uColor1.value, {
                r: 1, g: 1, b: 1, duration: 0.2, yoyo: true, repeat: 3
            });
        }
    }
}

export default LandingScene;
