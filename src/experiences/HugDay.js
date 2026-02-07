/**
 * HugDay — February 12th Experience
 * Theme: Warmth
 * 
 * Two light sources approach and radiate warmth
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class HugDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);
        this.leftLight = null;
        this.rightLight = null;
        this.embraceProgress = 0;
    }

    getInstruction() {
        return 'Bring them together...';
    }

    getCompletionMessage() {
        return 'In an embrace,<br>two become one warmth.';
    }

    async init() {
        this.createLights();
        this.createWarmthField();
        this.setupInteraction();

        await super.init();

        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createLights() {
        const createLightOrb = (color, position) => {
            const group = new THREE.Group();

            // Core
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.9
                })
            );
            group.add(core);

            // Glow
            const glow = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.ShaderMaterial({
                    uniforms: {
                        uColor: { value: new THREE.Color(color) },
                        uTime: { value: 0 }
                    },
                    vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
                    fragmentShader: `
            uniform vec3 uColor;
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
              float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
              float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
              gl_FragColor = vec4(uColor, fresnel * 0.6 * pulse);
            }
          `,
                    transparent: true,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                })
            );
            group.add(glow);

            group.position.copy(position);
            group.userData = { core, glow };

            return group;
        };

        this.leftLight = createLightOrb(COLORS_HEX.champagneGold, new THREE.Vector3(-3, 0, 0));
        this.rightLight = createLightOrb(COLORS_HEX.roseRed, new THREE.Vector3(3, 0, 0));

        this.group.add(this.leftLight);
        this.group.add(this.rightLight);
    }

    createWarmthField() {
        const geometry = new THREE.PlaneGeometry(12, 12, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uLeftPos: { value: new THREE.Vector2(-3, 0) },
                uRightPos: { value: new THREE.Vector2(3, 0) },
                uColor1: { value: new THREE.Color(COLORS_HEX.champagneGold) },
                uColor2: { value: new THREE.Color(COLORS_HEX.roseRed) }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uLeftPos;
        uniform vec2 uRightPos;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        
        void main() {
          vec2 pos = (vUv - 0.5) * 12.0;
          
          float distLeft = length(pos - uLeftPos);
          float distRight = length(pos - uRightPos);
          
          float glow1 = 1.0 / (distLeft * distLeft + 0.5);
          float glow2 = 1.0 / (distRight * distRight + 0.5);
          
          vec3 color = uColor1 * glow1 + uColor2 * glow2;
          
          // Merge glow when close
          float mergeDist = length(uLeftPos - uRightPos);
          float mergeGlow = smoothstep(2.0, 0.5, mergeDist) * uProgress;
          
          float alpha = (glow1 + glow2) * 0.1 + mergeGlow * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.warmthField = new THREE.Mesh(geometry, material);
        this.warmthField.position.z = -0.1;
        this.group.add(this.warmthField);
    }

    setupInteraction() {
        this.mousePos = { x: 0, y: 0 };
        this.isDragging = null;

        this.boundMouseMove = (e) => {
            // Prevent default for touch
            if (e.type === 'touchmove') {
                e.preventDefault();
            }

            // Get position from mouse or touch
            const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);

            if (clientX === undefined || clientY === undefined) return;

            this.mousePos.x = (clientX / window.innerWidth) * 2 - 1;
            this.mousePos.y = -(clientY / window.innerHeight) * 2 + 1;

            if (this.isDragging) {
                const target = this.isDragging === 'left' ? this.leftLight : this.rightLight;
                gsap.to(target.position, {
                    x: this.mousePos.x * 4,
                    y: this.mousePos.y * 3,
                    duration: 0.2
                });
            }
        };

        this.boundMouseDown = (e) => {
            // Prevent default for touch
            if (e.type === 'touchstart') {
                e.preventDefault();
            }

            // Check which light is closer
            const leftDist = Math.hypot(
                this.mousePos.x * 4 - this.leftLight.position.x,
                this.mousePos.y * 3 - this.leftLight.position.y
            );
            const rightDist = Math.hypot(
                this.mousePos.x * 4 - this.rightLight.position.x,
                this.mousePos.y * 3 - this.rightLight.position.y
            );

            if (leftDist < 1.5) this.isDragging = 'left';
            else if (rightDist < 1.5) this.isDragging = 'right';
        };

        this.boundMouseUp = (e) => {
            // Prevent default for touch
            if (e && e.type === 'touchend') {
                e.preventDefault();
            }
            this.isDragging = null;
        };

        // Mouse events
        window.addEventListener('mousemove', this.boundMouseMove);
        window.addEventListener('mousedown', this.boundMouseDown);
        window.addEventListener('mouseup', this.boundMouseUp);

        // Touch events for mobile drag
        window.addEventListener('touchmove', this.boundMouseMove, { passive: false });
        window.addEventListener('touchstart', this.boundMouseDown, { passive: false });
        window.addEventListener('touchend', this.boundMouseUp, { passive: false });
    }

    update(delta, elapsed) {
        if (!this.isActive) return;

        // Update shader times
        [this.leftLight, this.rightLight].forEach(light => {
            if (light.userData.glow.material.uniforms) {
                light.userData.glow.material.uniforms.uTime.value = elapsed;
            }
        });

        // Check distance between lights
        const dist = this.leftLight.position.distanceTo(this.rightLight.position);
        this.embraceProgress = Math.max(0, 1 - dist / 6);

        // Update warmth field
        this.warmthField.material.uniforms.uTime.value = elapsed;
        this.warmthField.material.uniforms.uProgress.value = this.embraceProgress;
        this.warmthField.material.uniforms.uLeftPos.value.set(
            this.leftLight.position.x,
            this.leftLight.position.y
        );
        this.warmthField.material.uniforms.uRightPos.value.set(
            this.rightLight.position.x,
            this.rightLight.position.y
        );

        // Check for embrace
        if (dist < 0.8 && !this.isCompleted) {
            this.onEmbraceComplete();
        }
    }

    async onEmbraceComplete() {
        // Merge animation
        const center = this.leftLight.position.clone().add(this.rightLight.position).multiplyScalar(0.5);

        gsap.to(this.leftLight.position, {
            x: center.x,
            y: center.y,
            duration: 1,
            ease: 'power2.in'
        });

        gsap.to(this.rightLight.position, {
            x: center.x,
            y: center.y,
            duration: 1,
            ease: 'power2.in'
        });

        // Expand warmth
        gsap.to(this.warmthField.material.uniforms.uProgress, {
            value: 3,
            duration: 2,
            ease: 'power2.out',
            onComplete: () => this.complete()
        });
    }

    dispose() {
        if (this.unsubscribeUpdate) this.unsubscribeUpdate();
        window.removeEventListener('mousemove', this.boundMouseMove);
        window.removeEventListener('mousedown', this.boundMouseDown);
        window.removeEventListener('mouseup', this.boundMouseUp);

        window.removeEventListener('touchmove', this.boundMouseMove);
        window.removeEventListener('touchstart', this.boundMouseDown);
        window.removeEventListener('touchend', this.boundMouseUp);

        super.dispose();
    }
}

export default HugDay;
