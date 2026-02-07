/**
 * ChocolateDay — February 9th Experience
 * Theme: Sweetness
 * 
 * Heat-reactive fluid simulation with cursor warmth
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class ChocolateDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);

        this.chocolateMesh = null;
        this.heatLevel = 0;
        this.maxHeat = 100;
        this.heatRadius = 2;
    }

    getInstruction() {
        return 'Bring warmth... let it melt';
    }

    getCompletionMessage() {
        return 'Sweetness melts<br>into something beautiful.';
    }

    async init() {
        this.createChocolate();
        this.setupInteraction();

        await super.init();

        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createChocolate() {
        // Create chocolate block that melts into heart
        const geometry = new THREE.BoxGeometry(2, 1.5, 0.5, 32, 32, 8);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMelt: { value: 0 },
                uMousePos: { value: new THREE.Vector2(0, 0) },
                uColor1: { value: new THREE.Color(0x3d1f0a) }, // Dark chocolate
                uColor2: { value: new THREE.Color(0x8b4513) }, // Lighter chocolate
                uGoldColor: { value: new THREE.Color(COLORS_HEX.champagneGold) }
            },
            vertexShader: `
        uniform float uTime;
        uniform float uMelt;
        uniform vec2 uMousePos;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vMeltAmount;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          
          // Melt deformation
          float dist = length(pos.xy - uMousePos * 2.0);
          float meltInfluence = smoothstep(2.0, 0.0, dist) * uMelt;
          vMeltAmount = meltInfluence;
          
          // Heart shape morphing as melt increases
          if (uMelt > 0.5) {
            float heartMorph = (uMelt - 0.5) * 2.0;
            float angle = atan(pos.y, pos.x);
            float r = length(pos.xy);
            
            // Heart polar equation approximation
            float heartR = 0.8 * (1.0 - sin(angle)) * (1.0 + 0.3 * cos(2.0 * angle));
            
            pos.x = mix(pos.x, heartR * cos(angle) * 1.5, heartMorph * 0.5);
            pos.y = mix(pos.y, heartR * sin(angle) * 1.5 + 0.5, heartMorph * 0.5);
          }
          
          // Drip effect
          pos.y -= meltInfluence * 0.3;
          pos.z += sin(pos.x * 3.0 + uTime) * meltInfluence * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform float uMelt;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uGoldColor;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vMeltAmount;
        
        void main() {
          // Base chocolate color with shine
          vec3 color = mix(uColor1, uColor2, vUv.y + sin(vUv.x * 10.0) * 0.1);
          
          // Heat glow
          color = mix(color, uGoldColor, vMeltAmount * 0.5);
          
          // Melted sheen
          float shine = pow(max(0.0, dot(normalize(vec3(vUv - 0.5, 1.0)), vec3(0.0, 0.0, 1.0))), 8.0);
          color += vec3(0.3) * shine * (0.5 + uMelt * 0.5);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
        });

        this.chocolateMesh = new THREE.Mesh(geometry, material);
        this.chocolateMesh.position.set(0, 0, 0);
        this.group.add(this.chocolateMesh);

        // Add glow particles
        this.createHeatParticles();
    }

    createHeatParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = Math.random() * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleVelocities = velocities;

        const material = new THREE.PointsMaterial({
            color: COLORS_HEX.champagneGold,
            size: 0.05,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });

        this.heatParticles = new THREE.Points(geometry, material);
        this.group.add(this.heatParticles);
    }

    setupInteraction() {
        this.boundMouseMove = (e) => {
            this.mousePos = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            };
        };

        window.addEventListener('mousemove', this.boundMouseMove);
    }

    update(delta, elapsed) {
        if (!this.isActive || !this.chocolateMesh) return;

        const material = this.chocolateMesh.material;
        material.uniforms.uTime.value = elapsed;

        if (this.mousePos) {
            material.uniforms.uMousePos.value.set(this.mousePos.x, this.mousePos.y);

            // Calculate distance from center
            const dist = Math.sqrt(this.mousePos.x ** 2 + this.mousePos.y ** 2);

            // Heat increases when cursor is near center
            if (dist < 1) {
                this.heatLevel += delta * 15 * (1 - dist);

                // Show particles
                this.heatParticles.material.opacity = Math.min(0.8, this.heatLevel / 50);
            } else {
                this.heatLevel -= delta * 5;
            }

            this.heatLevel = Math.max(0, Math.min(this.maxHeat, this.heatLevel));
        }

        // Update melt uniform
        const meltProgress = this.heatLevel / this.maxHeat;
        material.uniforms.uMelt.value = meltProgress;

        // Update particle positions
        if (this.heatParticles && meltProgress > 0.1) {
            const positions = this.heatParticles.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += this.particleVelocities[i] * meltProgress;
                positions[i + 1] += this.particleVelocities[i + 1] * meltProgress;
                positions[i + 2] += this.particleVelocities[i + 2] * meltProgress;

                // Reset if too far
                if (Math.abs(positions[i]) > 2) {
                    positions[i] = (Math.random() - 0.5) * 0.5;
                    positions[i + 1] = (Math.random() - 0.5) * 0.5;
                }
            }

            this.heatParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Check for completion
        if (meltProgress >= 1 && !this.isCompleted) {
            this.onMeltComplete();
        }
    }

    async onMeltComplete() {
        // Heart transformation complete
        gsap.to(this.chocolateMesh.rotation, {
            y: Math.PI * 2,
            duration: 2,
            ease: 'power2.inOut'
        });

        gsap.to(this.heatParticles.material, {
            opacity: 0,
            duration: 1,
            onComplete: () => this.complete()
        });
    }

    dispose() {
        if (this.unsubscribeUpdate) this.unsubscribeUpdate();
        window.removeEventListener('mousemove', this.boundMouseMove);
        super.dispose();
    }
}

export default ChocolateDay;
