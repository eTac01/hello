/**
 * PromiseDay — February 11th Experience
 * Theme: Trust
 * 
 * Draw glowing thread and create a knot
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class PromiseDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);

        this.points = [];
        this.line = null;
        this.isDrawing = false;
        this.knotDetected = false;
    }

    getInstruction() {
        return 'Draw your promise... tie the knot';
    }

    getCompletionMessage() {
        return 'A promise made with love<br>cannot be undone.';
    }

    async init() {
        this.createThread();
        this.createTargetKnot();
        this.setupInteraction();

        await super.init();

        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createThread() {
        // Create line that follows mouse
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(COLORS_HEX.champagneGold) },
                uColor2: { value: new THREE.Color(COLORS_HEX.roseRed) }
            },
            vertexShader: `
        attribute float aLineDistance;
        varying float vLineDistance;
        uniform float uTime;
        
        void main() {
          vLineDistance = aLineDistance;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vLineDistance;
        
        void main() {
          float pulse = sin(vLineDistance * 10.0 - uTime * 3.0) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, pulse);
          gl_FragColor = vec4(color, 0.9);
        }
      `,
            transparent: true
        });

        this.lineMaterial = material;

        // Initial empty geometry
        const geometry = new THREE.BufferGeometry();
        this.line = new THREE.Line(geometry, material);
        this.group.add(this.line);
    }

    createTargetKnot() {
        // Visual hint for where to make the knot
        const geometry = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
        const material = new THREE.MeshBasicMaterial({
            color: COLORS_HEX.champagneGold,
            transparent: true,
            opacity: 0.2
        });

        this.knotTarget = new THREE.Mesh(geometry, material);
        this.knotTarget.position.set(0, 0, 0);
        this.knotTarget.rotation.x = Math.PI / 2;
        this.group.add(this.knotTarget);
    }

    setupInteraction() {
        this.boundMouseMove = this.onPointerMove.bind(this);
        this.boundMouseDown = this.onPointerDown.bind(this);
        this.boundMouseUp = this.onPointerUp.bind(this);

        // Mouse events
        window.addEventListener('mousemove', this.boundMouseMove);
        window.addEventListener('mousedown', this.boundMouseDown);
        window.addEventListener('mouseup', this.boundMouseUp);

        // Touch events for mobile drawing
        window.addEventListener('touchmove', this.boundMouseMove, { passive: false });
        window.addEventListener('touchstart', this.boundMouseDown, { passive: false });
        window.addEventListener('touchend', this.boundMouseUp, { passive: false });
    }

    onPointerDown(event) {
        if (this.phase !== 'interactive') return;

        // Prevent default for touch
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        this.isDrawing = true;
        this.points = [];
    }

    onPointerMove(event) {
        if (!this.isDrawing) return;

        // Prevent default for touch to avoid scrolling
        if (event.type === 'touchmove') {
            event.preventDefault();
        }

        // Get position from mouse or touch
        const clientX = event.clientX || (event.touches && event.touches[0] && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0] && event.touches[0].clientY);

        if (clientX === undefined || clientY === undefined) return;

        const x = (clientX / window.innerWidth) * 2 - 1;
        const y = -(clientY / window.innerHeight) * 2 + 1;

        // Convert to 3D space
        const vector = new THREE.Vector3(x * 4, y * 3, 0);

        // Add point if far enough from last
        if (this.points.length === 0 ||
            vector.distanceTo(this.points[this.points.length - 1]) > 0.1) {
            this.points.push(vector);
            this.updateLine();

            // Check for knot pattern
            if (this.points.length > 20) {
                this.checkForKnot();
            }
        }
    }

    onPointerUp(event) {
        // Prevent default for touch
        if (event && event.type === 'touchend') {
            event.preventDefault();
        }

        this.isDrawing = false;
    }

    updateLine() {
        if (this.points.length < 2) return;

        const positions = new Float32Array(this.points.length * 3);
        const distances = new Float32Array(this.points.length);

        let totalDist = 0;

        this.points.forEach((point, i) => {
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;

            if (i > 0) {
                totalDist += point.distanceTo(this.points[i - 1]);
            }
            distances[i] = totalDist;
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aLineDistance', new THREE.BufferAttribute(distances, 1));

        this.line.geometry.dispose();
        this.line.geometry = geometry;
    }

    checkForKnot() {
        // Simple loop detection - check if path crosses itself
        const last = this.points[this.points.length - 1];
        const near = this.points.slice(0, -10).filter(p =>
            last.distanceTo(p) < 0.5
        );

        if (near.length > 0 && !this.knotDetected) {
            // Check if we've made a complete loop
            const loopSize = this.points.length - this.points.indexOf(near[0]);

            if (loopSize > 15) {
                this.knotDetected = true;
                this.onKnotComplete();
            }
        }
    }

    async onKnotComplete() {
        // Tighten the knot animation
        gsap.to(this.knotTarget.scale, {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            duration: 1,
            ease: 'power2.in'
        });

        gsap.to(this.knotTarget.material, {
            opacity: 1,
            duration: 1
        });

        // Glow effect
        const glow = new THREE.PointLight(COLORS_HEX.champagneGold, 0, 5);
        glow.position.copy(this.knotTarget.position);
        this.group.add(glow);

        gsap.to(glow, {
            intensity: 2,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => this.complete()
        });
    }

    update(delta, elapsed) {
        if (!this.isActive) return;

        this.lineMaterial.uniforms.uTime.value = elapsed;

        // Subtle rotation of target
        this.knotTarget.rotation.z += delta * 0.3;
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

export default PromiseDay;
