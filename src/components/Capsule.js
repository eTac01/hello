/**
 * Capsule — Time Capsule Component
 * Visual representation of each day with state-based appearance
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { COLORS_HEX, TIMELINE, CAPSULE_POSITIONS } from '../utils/constants.js';
import { breathe } from '../utils/easing.js';

class Capsule {
    constructor(dayIndex, sceneManager) {
        this.dayIndex = dayIndex;
        this.sceneManager = sceneManager;
        this.dayData = TIMELINE[dayIndex];
        this.position = CAPSULE_POSITIONS[dayIndex];
        this.state = 'future'; // 'active', 'past', 'future'
        this.isHovered = false;
        this.mesh = null;
        this.glowMesh = null;
        this.particles = null;

        this.create();
    }

    /**
     * Create the capsule mesh
     */
    create() {
        // Main capsule geometry (elongated dodecahedron-like shape)
        const geometry = new THREE.DodecahedronGeometry(0.4, 1);

        // Create material based on state (will be updated)
        this.material = new THREE.MeshStandardMaterial({
            color: COLORS_HEX.champagneGold,
            metalness: 0.3,
            roughness: 0.6,
            transparent: true,
            opacity: 0.8
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.userData = {
            dayIndex: this.dayIndex,
            type: 'capsule'
        };

        // Add glow sphere behind
        this.createGlow();

        // Add inner particles
        this.createInnerParticles();

        // Create group
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        this.group.add(this.glowMesh);
        this.group.add(this.particles);

        this.sceneManager.scene.add(this.group);
    }

    /**
     * Create glow effect behind capsule
     */
    createGlow() {
        const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(COLORS_HEX.roseRed) },
                uIntensity: { value: 0.5 },
                uTime: { value: 0 }
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float pulse = sin(uTime * 2.0) * 0.15 + 0.85;
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          float alpha = rim * uIntensity * pulse;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
            transparent: true,
            side: THREE.BackSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        this.glowMesh.position.copy(this.mesh.position);
    }

    /**
     * Create inner particle system
     */
    createInnerParticles() {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = 0.15 + Math.random() * 0.15;

            positions[i * 3] = this.position.x + r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = this.position.y + r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = this.position.z + r * Math.cos(phi);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: COLORS_HEX.champagneGold,
            size: 0.02,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
    }

    /**
     * Update capsule state
     */
    setState(newState) {
        if (this.state === newState) return;

        this.state = newState;
        this.updateVisuals();
    }

    /**
     * Update visual appearance based on state
     */
    updateVisuals() {
        switch (this.state) {
            case 'active':
                this.setActiveState();
                break;
            case 'past':
                this.setPastState();
                break;
            case 'future':
                this.setFutureState();
                break;
        }
    }

    /**
     * Active state — glowing, interactive, alive
     */
    setActiveState() {
        // Animate material
        gsap.to(this.material, {
            metalness: 0.4,
            roughness: 0.3,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to(this.material.color, {
            r: 0.9,
            g: 0.76,
            b: 0.49,
            duration: 1
        });

        // Enable glow
        gsap.to(this.glowMesh.material.uniforms.uIntensity, {
            value: 0.8,
            duration: 1
        });

        // Show particles
        gsap.to(this.particles.material, {
            opacity: 0.8,
            duration: 1
        });
    }

    /**
     * Past state — cracked, desaturated, frozen
     */
    setPastState() {
        gsap.to(this.material, {
            metalness: 0.1,
            roughness: 0.9,
            opacity: 0.3,
            duration: 1,
            ease: 'power2.out'
        });

        // Desaturate
        gsap.to(this.material.color, {
            r: 0.3,
            g: 0.3,
            b: 0.3,
            duration: 1
        });

        // Disable glow
        gsap.to(this.glowMesh.material.uniforms.uIntensity, {
            value: 0,
            duration: 1
        });

        // Fade particles
        gsap.to(this.particles.material, {
            opacity: 0.1,
            duration: 1
        });
    }

    /**
     * Future state — fogged, pulsing silhouette
     */
    setFutureState() {
        gsap.to(this.material, {
            metalness: 0.2,
            roughness: 0.8,
            opacity: 0.4,
            duration: 1,
            ease: 'power2.out'
        });

        // Subtle color
        gsap.to(this.material.color, {
            r: 0.4,
            g: 0.4,
            b: 0.45,
            duration: 1
        });

        // Minimal glow
        gsap.to(this.glowMesh.material.uniforms.uIntensity, {
            value: 0.15,
            duration: 1
        });

        // Hide particles
        gsap.to(this.particles.material, {
            opacity: 0.2,
            duration: 1
        });
    }

    /**
     * Hover interaction
     */
    onHover() {
        if (this.isHovered || this.state !== 'active') return;
        this.isHovered = true;

        gsap.to(this.mesh.scale, {
            x: 1.15,
            y: 1.15,
            z: 1.15,
            duration: 0.4,
            ease: 'back.out(2)'
        });

        gsap.to(this.glowMesh.material.uniforms.uIntensity, {
            value: 1.2,
            duration: 0.4
        });

        // Update cursor
        const cursor = document.getElementById('cursor');
        if (cursor) cursor.classList.add('hover');
    }

    /**
     * Hover exit
     */
    onHoverExit() {
        if (!this.isHovered) return;
        this.isHovered = false;

        gsap.to(this.mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.4,
            ease: 'power2.out'
        });

        if (this.state === 'active') {
            gsap.to(this.glowMesh.material.uniforms.uIntensity, {
                value: 0.8,
                duration: 0.4
            });
        }

        // Reset cursor
        const cursor = document.getElementById('cursor');
        if (cursor) cursor.classList.remove('hover');
    }

    /**
     * Update animation (called each frame)
     */
    update(delta, elapsed) {
        // Update glow time uniform
        if (this.glowMesh && this.glowMesh.material.uniforms) {
            this.glowMesh.material.uniforms.uTime.value = elapsed;
        }

        // Breathing animation for active capsule
        if (this.state === 'active') {
            const breatheValue = breathe(elapsed, 0.08);
            this.mesh.scale.setScalar(1 + breatheValue);
        }

        // Rotate mesh slowly
        this.mesh.rotation.y += delta * 0.2;
        this.mesh.rotation.x += delta * 0.1;

        // Float particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsed + i) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    /**
     * Click handler
     */
    onClick() {
        if (this.state === 'active') {
            return { action: 'enter', dayIndex: this.dayIndex };
        } else if (this.state === 'past') {
            return { action: 'showPastMessage', dayIndex: this.dayIndex };
        } else {
            return { action: 'showFutureMessage', dayIndex: this.dayIndex };
        }
    }

    /**
     * Dispose resources
     */
    dispose() {
        this.mesh.geometry.dispose();
        this.material.dispose();
        this.glowMesh.geometry.dispose();
        this.glowMesh.material.dispose();
        this.particles.geometry.dispose();
        this.particles.material.dispose();

        this.sceneManager.scene.remove(this.group);
    }
}

export default Capsule;
