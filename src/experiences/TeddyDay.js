/**
 * TeddyDay — February 10th Experience
 * Theme: Comfort
 * 
 * Soft particle embrace effect
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class TeddyDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);
        this.comfortLevel = 0;
        this.maxComfort = 100;
    }

    getInstruction() {
        return 'Stay close... feel the comfort';
    }

    getCompletionMessage() {
        return 'In stillness,<br>we find each other.';
    }

    async init() {
        this.createComfortParticles();
        this.createCenterGlow();
        this.setupInteraction();

        await super.init();

        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createComfortParticles() {
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const goldColor = new THREE.Color(COLORS_HEX.champagneGold);
        const roseColor = new THREE.Color(COLORS_HEX.roseRed);

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = 3 + Math.random() * 2;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const mixRatio = Math.random();
            const color = goldColor.clone().lerp(roseColor, mixRatio);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.originalPositions = positions.slice();

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uComfort: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uComfort;
        uniform float uPixelRatio;
        
        void main() {
          vColor = color;
          
          // Move toward center based on comfort
          vec3 pos = position * (1.0 - uComfort * 0.7);
          pos += vec3(
            sin(uTime + position.x) * 0.1,
            cos(uTime + position.y) * 0.1,
            sin(uTime + position.z) * 0.1
          );
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (100.0 / -mvPosition.z) * (1.0 + uComfort * 0.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        uniform float uComfort;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * (0.3 + uComfort * 0.7);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.group.add(this.particles);
    }

    createCenterGlow() {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uComfort: { value: 0 },
                uColor: { value: new THREE.Color(COLORS_HEX.champagneGold) }
            },
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform float uComfort;
        uniform vec3 uColor;
        varying vec3 vNormal;
        
        void main() {
          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          float alpha = (0.2 + fresnel * 0.8) * uComfort * pulse;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.centerGlow = new THREE.Mesh(geometry, material);
        this.group.add(this.centerGlow);
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

        // Comfort increases when cursor stays near center
        const dist = Math.sqrt(this.mousePos.x ** 2 + this.mousePos.y ** 2);

        if (dist < 0.5) {
            this.comfortLevel += delta * 20 * (1 - dist * 2);
        } else {
            this.comfortLevel -= delta * 10;
        }

        this.comfortLevel = Math.max(0, Math.min(this.maxComfort, this.comfortLevel));

        const progress = this.comfortLevel / this.maxComfort;

        // Update shaders
        this.particles.material.uniforms.uTime.value = elapsed;
        this.particles.material.uniforms.uComfort.value = progress;

        this.centerGlow.material.uniforms.uTime.value = elapsed;
        this.centerGlow.material.uniforms.uComfort.value = progress;

        // Scale center glow with comfort
        const scale = 1 + progress * 2;
        this.centerGlow.scale.set(scale, scale, scale);

        // Check completion
        if (progress >= 1 && !this.isCompleted) {
            this.onComfortComplete();
        }
    }

    async onComfortComplete() {
        gsap.to(this.particles.material.uniforms.uComfort, {
            value: 1.2,
            duration: 2,
            ease: 'power2.out'
        });

        gsap.to(this.centerGlow.scale, {
            x: 10,
            y: 10,
            z: 10,
            duration: 2,
            ease: 'power2.out',
            onComplete: () => this.complete()
        });
    }

    dispose() {
        if (this.unsubscribeUpdate) this.unsubscribeUpdate();
        window.removeEventListener('mousemove', this.boundMouseMove);
        super.dispose();
    }
}

export default TeddyDay;
