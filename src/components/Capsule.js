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
            metalness: 0.9,
            roughness: 0.1,
            emissive: COLORS_HEX.champagneGold,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0 // Make invisible - only emojis will be visible
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

        // Add emoji label
        this.createEmojiLabel();

        // Add "Let's Go" button
        this.createButton();

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
                uIntensity: { value: 0 }, // Set to 0 to hide glow
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
          float pulse = sin(uTime * 3.0) * 0.2 + 0.8;
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5); // Sharper rim
          float alpha = rim * uIntensity * pulse * 1.5; // Brighter
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
            opacity: 0, // Hide particles
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
    }

    createEmojiLabel() {
        // Create HTML element for animated emoji GIF
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'capsule-emoji';

        // Create img element for animated GIF
        const emojiImg = document.createElement('img');
        emojiImg.src = this.dayData.animatedEmoji || this.dayData.emoji;
        emojiImg.alt = this.dayData.emoji;
        emojiImg.style.cssText = `
            width: 80px;
            height: 80px;
            object-fit: contain;
        `;

        emojiDiv.appendChild(emojiImg);

        emojiDiv.style.cssText = `
            user-select: none;
            pointer-events: auto;
            cursor: pointer;
            filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.9));
            z-index: 10;
            transition: transform 0.3s ease, filter 0.3s ease;
            animation: floatEmoji 3s ease-in-out infinite;
            animation-delay: ${this.dayIndex * 0.2}s;
        `;

        // Add hover effect
        emojiDiv.addEventListener('mouseenter', () => {
            emojiDiv.style.transform = 'translate(-50%, -50%) scale(1.2)';
            emojiDiv.style.filter = 'drop-shadow(0 0 25px rgba(255, 0, 255, 0.9))';
        });

        emojiDiv.addEventListener('mouseleave', () => {
            emojiDiv.style.transform = 'translate(-50%, -50%) scale(1)';
            emojiDiv.style.filter = 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.9))';
        });

        // Add click handler
        emojiDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Emoji clicked for day:', this.dayIndex, this.dayData.day);

            // Navigate to the URL for this day
            const url = this.dayData.url;
            if (url) {
                console.log('Navigating to:', url);
                window.location.href = url;
            } else {
                console.warn('No URL defined for:', this.dayData.day);
            }
        });

        // Position it above the capsule using CSS positioning
        this.emojiElement = emojiDiv;
        document.getElementById('ui-overlay').appendChild(this.emojiElement);

        console.log('Emoji created for day:', this.dayIndex, this.dayData.day);
    }

    /**
     * Update emoji label position to follow capsule in 3D space
     */
    updateEmojiPosition(camera) {
        if (!this.emojiElement) return;

        // Get 3D position at capsule center (not above)
        const labelPos = new THREE.Vector3(
            this.mesh.position.x,
            this.mesh.position.y,
            this.mesh.position.z
        );

        // Project to screen space
        labelPos.project(camera);

        // Convert to pixel coordinates
        const x = (labelPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (labelPos.y * -0.5 + 0.5) * window.innerHeight;

        // Update position
        this.emojiElement.style.position = 'fixed';
        this.emojiElement.style.left = `${x}px`;
        this.emojiElement.style.top = `${y}px`;
        this.emojiElement.style.transform = 'translate(-50%, -50%)';

        // Hide if behind camera
        this.emojiElement.style.opacity = labelPos.z < 1 ? '1' : '0';
    }

    /**
     * Create "Let's Go" button below capsule
     */
    createButton() {
        // Create HTML button element
        const buttonDiv = document.createElement('button');
        buttonDiv.className = 'capsule-button';
        buttonDiv.innerHTML = "Let's Go";
        buttonDiv.style.cssText = `
            position: fixed;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.85rem;
            padding: 8px 20px;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2));
            border: 2px solid #00ffff;
            border-radius: 20px;
            color: #00ffff;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            opacity: 0;
            pointer-events: none;
            z-index: 50;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            display: none;
        `;

        // Add hover effect
        buttonDiv.addEventListener('mouseenter', () => {
            buttonDiv.style.background = 'linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3))';
            buttonDiv.style.borderColor = '#ff00ff';
            buttonDiv.style.color = '#ff00ff';
            buttonDiv.style.transform = 'translateX(-50%) scale(1.1)';
            buttonDiv.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.6)';
        });

        buttonDiv.addEventListener('mouseleave', () => {
            buttonDiv.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))';
            buttonDiv.style.borderColor = '#00ffff';
            buttonDiv.style.color = '#00ffff';
            buttonDiv.style.transform = 'translateX(-50%) scale(1)';
            buttonDiv.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
        });

        // Add click handler
        buttonDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Button clicked for day:', this.dayIndex);
            // Call global function to enter experience
            if (window.enterCapsuleExperience) {
                window.enterCapsuleExperience(this.dayIndex);
            }
        });

        this.buttonElement = buttonDiv;
        document.getElementById('ui-overlay').appendChild(this.buttonElement);

        console.log('Button created for day:', this.dayIndex, this.dayData.day);
    }

    /**
     * Update button position to follow capsule in 3D space
     */
    updateButtonPosition(camera) {
        if (!this.buttonElement) return;

        // Get 3D position below capsule
        const buttonPos = new THREE.Vector3(
            this.mesh.position.x,
            this.mesh.position.y - 0.8,
            this.mesh.position.z
        );

        // Project to screen space
        buttonPos.project(camera);

        // Convert to pixel coordinates
        const x = (buttonPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (buttonPos.y * -0.5 + 0.5) * window.innerHeight;

        // Update position
        this.buttonElement.style.left = `${x}px`;
        this.buttonElement.style.top = `${y}px`;
        this.buttonElement.style.transform = 'translateX(-50%)';

        // Show/hide based on state and camera position
        const isVisible = buttonPos.z < 1 && this.state === 'active';
        this.buttonElement.style.opacity = isVisible ? '1' : '0';
        this.buttonElement.style.pointerEvents = isVisible ? 'auto' : 'none';
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
        // Update emoji label position
        this.updateEmojiPosition(this.sceneManager.camera);

        // Update button position
        this.updateButtonPosition(this.sceneManager.camera);

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
        // Remove emoji label
        if (this.emojiElement && this.emojiElement.parentNode) {
            this.emojiElement.parentNode.removeChild(this.emojiElement);
        }

        // Remove button
        if (this.buttonElement && this.buttonElement.parentNode) {
            this.buttonElement.parentNode.removeChild(this.buttonElement);
        }

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
