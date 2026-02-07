/**
 * RoseDay — February 7th Experience
 * Theme: Admiration
 * 
 * Assemble floating petals in zero gravity to form a rose
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class RoseDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);

        this.petals = [];
        this.targetPositions = [];
        this.assembledCount = 0;
        this.totalPetals = 12;
        this.isAssembling = false;
        this.roseCenter = new THREE.Vector3(0, 0, 0);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedPetal = null;
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    }

    getInstruction() {
        return 'Gather the petals... form the rose';
    }

    getCompletionMessage() {
        return 'A rose blooms in your heart,<br>each petal placed with care.';
    }

    /**
     * Initialize Rose Day experience
     */
    async init() {
        this.createPetals();
        this.createRoseCore();
        this.setupInteraction();

        await super.init();

        // Start update loop
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    /**
     * Create floating petals
     */
    createPetals() {
        // Petal geometry (curved surface)
        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.quadraticCurveTo(0.15, 0.2, 0, 0.4);
        petalShape.quadraticCurveTo(-0.15, 0.2, 0, 0);

        const extrudeSettings = {
            depth: 0.02,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 3
        };

        const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);

        // Create petals at random positions
        for (let i = 0; i < this.totalPetals; i++) {
            const material = new THREE.MeshStandardMaterial({
                color: COLORS_HEX.roseRed,
                metalness: 0.1,
                roughness: 0.6,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9
            });

            const petal = new THREE.Mesh(petalGeometry, material);

            // Random starting position
            petal.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4
            );

            // Random rotation
            petal.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Store original floating animation offset
            petal.userData = {
                index: i,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.5,
                isPlaced: false,
                originalPos: petal.position.clone()
            };

            this.petals.push(petal);
            this.group.add(petal);

            // Calculate target position for rose formation
            this.calculateTargetPosition(i);
        }
    }

    /**
     * Calculate where each petal should go in the rose
     */
    calculateTargetPosition(index) {
        // Layered rose formation
        const layer = Math.floor(index / 4);
        const indexInLayer = index % 4;
        const angle = (indexInLayer / 4) * Math.PI * 2 + (layer * 0.4);
        const radius = 0.15 + layer * 0.2;
        const height = layer * 0.1;

        this.targetPositions[index] = {
            position: new THREE.Vector3(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            ),
            rotation: new THREE.Euler(
                Math.PI / 4 + layer * 0.2,
                angle + Math.PI / 2,
                0
            )
        };
    }

    /**
     * Create glowing rose core
     */
    createRoseCore() {
        const geometry = new THREE.SphereGeometry(0.12, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uColor: { value: new THREE.Color(COLORS_HEX.champagneGold) }
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uColor;
        
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          float pulse = sin(uTime * 2.0) * 0.2 + 0.8;
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          
          float alpha = (0.3 + fresnel * 0.5) * uProgress * pulse;
          vec3 color = uColor * (1.0 + fresnel * 0.3);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.roseCore = new THREE.Mesh(geometry, material);
        this.roseCore.position.copy(this.roseCenter);
        this.group.add(this.roseCore);
    }

    /**
     * Setup interaction handlers
     */
    setupInteraction() {
        this.boundMouseMove = this.onPointerMove.bind(this);
        this.boundMouseDown = this.onPointerDown.bind(this);
        this.boundMouseUp = this.onPointerUp.bind(this);

        // Mouse events
        window.addEventListener('mousemove', this.boundMouseMove);
        window.addEventListener('mousedown', this.boundMouseDown);
        window.addEventListener('mouseup', this.boundMouseUp);

        // Touch events for mobile drag
        window.addEventListener('touchmove', this.boundMouseMove, { passive: false });
        window.addEventListener('touchstart', this.boundMouseDown, { passive: false });
        window.addEventListener('touchend', this.boundMouseUp, { passive: false });
    }

    /**
     * Unified pointer move handler (mouse + touch)
     */
    onPointerMove(event) {
        // Prevent default for touch to avoid scrolling
        if (event.type === 'touchmove') {
            event.preventDefault();
        }

        // Get position from mouse or touch
        const clientX = event.clientX || (event.touches && event.touches[0] && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0] && event.touches[0].clientY);

        if (clientX === undefined || clientY === undefined) return;

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        if (this.selectedPetal) {
            // Drag petal
            this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
            const intersectPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint);

            if (intersectPoint) {
                gsap.to(this.selectedPetal.position, {
                    x: intersectPoint.x,
                    y: intersectPoint.y,
                    z: intersectPoint.z,
                    duration: 0.1,
                    ease: 'power2.out'
                });
            }
        } else {
            // Hover detection
            this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
            const intersects = this.raycaster.intersectObjects(this.petals);

            const cursor = document.getElementById('cursor');
            if (intersects.length > 0 && !intersects[0].object.userData.isPlaced) {
                if (cursor) cursor.classList.add('hover');
            } else {
                if (cursor) cursor.classList.remove('hover');
            }
        }
    }

    /**
     * Unified pointer down handler (mouse + touch)
     */
    onPointerDown(event) {
        if (this.phase !== 'interactive') return;

        // Prevent default for touch
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
        const intersects = this.raycaster.intersectObjects(this.petals);

        if (intersects.length > 0 && !intersects[0].object.userData.isPlaced) {
            this.selectedPetal = intersects[0].object;

            // Update drag plane to face camera
            const cameraDirection = new THREE.Vector3();
            this.sceneManager.camera.getWorldDirection(cameraDirection);
            this.dragPlane.normal.copy(cameraDirection);
            this.dragPlane.constant = -this.selectedPetal.position.dot(cameraDirection);

            // Visual feedback
            gsap.to(this.selectedPetal.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.2
            });
        }
    }

    /**
     * Unified pointer up handler (mouse + touch)
     */
    onPointerUp(event) {
        // Prevent default for touch
        if (event && event.type === 'touchend') {
            event.preventDefault();
        }
        if (!this.selectedPetal) return;

        const petal = this.selectedPetal;
        this.selectedPetal = null;

        // Check if close to rose center
        const distanceToCenter = petal.position.distanceTo(this.roseCenter);

        if (distanceToCenter < 1.5) {
            // Snap to valid position
            this.placePetal(petal);
        } else {
            // Return to floating
            gsap.to(petal.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3
            });
        }

        const cursor = document.getElementById('cursor');
        if (cursor) cursor.classList.remove('hover');
    }

    /**
     * Place petal in rose formation
     */
    placePetal(petal) {
        const index = petal.userData.index;
        const target = this.targetPositions[index];

        petal.userData.isPlaced = true;
        this.assembledCount++;

        // Animate to position
        gsap.to(petal.position, {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.to(petal.rotation, {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.to(petal.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3
        });

        // Update rose core glow
        const progress = this.assembledCount / this.totalPetals;
        gsap.to(this.roseCore.material.uniforms.uProgress, {
            value: progress,
            duration: 0.5
        });

        // Check if complete
        if (this.assembledCount >= this.totalPetals) {
            this.onRoseComplete();
        }
    }

    /**
     * Rose is fully assembled
     */
    async onRoseComplete() {
        this.phase = 'outro';

        // Bloom animation
        await this.playBloomAnimation();

        // Complete the experience
        await this.complete();
    }

    /**
     * Play the final bloom animation
     */
    playBloomAnimation() {
        return new Promise(resolve => {
            // Expand petals slightly
            this.petals.forEach((petal, i) => {
                gsap.to(petal.position, {
                    y: petal.position.y + 0.05,
                    duration: 1,
                    delay: i * 0.05,
                    ease: 'power2.out'
                });

                gsap.to(petal.rotation, {
                    x: petal.rotation.x - 0.2,
                    duration: 1,
                    delay: i * 0.05,
                    ease: 'power2.out'
                });
            });

            // Core glow burst
            gsap.to(this.roseCore.scale, {
                x: 2,
                y: 2,
                z: 2,
                duration: 1.5,
                ease: 'power2.out'
            });

            gsap.to(this.roseCore.material.uniforms.uProgress, {
                value: 2,
                duration: 1.5,
                ease: 'power2.out',
                onComplete: resolve
            });
        });
    }

    /**
     * Update loop
     */
    update(delta, elapsed) {
        if (!this.isActive) return;

        // Floating animation for unplaced petals
        this.petals.forEach(petal => {
            if (!petal.userData.isPlaced && petal !== this.selectedPetal) {
                const offset = petal.userData.floatOffset;
                const speed = petal.userData.floatSpeed;

                petal.position.y = petal.userData.originalPos.y + Math.sin(elapsed * speed + offset) * 0.3;
                petal.position.x = petal.userData.originalPos.x + Math.cos(elapsed * speed * 0.7 + offset) * 0.2;
                petal.rotation.z += delta * 0.2;
            }
        });

        // Update rose core
        if (this.roseCore && this.roseCore.material.uniforms) {
            this.roseCore.material.uniforms.uTime.value = elapsed;
        }

        // Gentle group rotation
        this.group.rotation.y += delta * 0.05;
    }

    /**
     * Dispose
     */
    dispose() {
        if (this.unsubscribeUpdate) {
            this.unsubscribeUpdate();
        }

        window.removeEventListener('mousemove', this.boundMouseMove);
        window.removeEventListener('mousedown', this.boundMouseDown);
        window.removeEventListener('mouseup', this.boundMouseUp);

        window.removeEventListener('touchmove', this.boundMouseMove);
        window.removeEventListener('touchstart', this.boundMouseDown);
        window.removeEventListener('touchend', this.boundMouseUp);

        super.dispose();
    }
}

export default RoseDay;
