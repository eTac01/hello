/**
 * SceneManager — Three.js Scene Orchestration
 * Handles renderer, camera, post-processing, and render loop
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { COLORS_HEX, QUALITY_TIERS } from '../utils/constants.js';

class SceneManager {
    constructor(container) {
        this.container = container;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.qualityTier = this.detectQualityTier();
        this.isRunning = false;
        this.clock = new THREE.Clock();
        this.callbacks = [];

        // Mouse tracking
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.mouseVelocity = new THREE.Vector2();
        this.lastMouse = new THREE.Vector2();

        this.init();
    }

    /**
     * Detect device quality tier
     */
    detectQualityTier() {
        // Check if touch device (mobile/tablet)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) return 'low';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            console.log('[SceneManager] GPU:', renderer);

            // Mobile GPUs - force low quality
            if (renderer.includes('Mali') || renderer.includes('Adreno') || renderer.includes('PowerVR')) {
                return 'low';
            }
            // Integrated GPUs - medium quality
            if (renderer.includes('Intel')) {
                return isTouchDevice ? 'low' : 'medium';
            }
        }

        // Check device memory if available
        if (navigator.deviceMemory) {
            if (navigator.deviceMemory < 4) return 'low';
            if (navigator.deviceMemory < 8) return 'medium';
        }

        // Touch devices default to medium (unless GPU detection forced low)
        if (isTouchDevice) {
            return 'medium';
        }

        return 'high';
    }

    /**
     * Initialize Three.js scene
     */
    init() {
        const quality = QUALITY_TIERS[this.qualityTier];

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(COLORS_HEX.charcoal);
        this.scene.fog = new THREE.FogExp2(COLORS_HEX.charcoal, 0.08);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.width / this.height,
            0.1,
            100
        );
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: quality.antialias,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        this.container.appendChild(this.renderer.domElement);

        // Ambient lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        // Create ambient particles
        this.createAmbientParticles();

        // Event listeners
        this.setupEventListeners();
    }

    /**
     * Create ambient floating particles
     */
    createAmbientParticles() {
        const quality = QUALITY_TIERS[this.qualityTier];
        const particleCount = quality.particleCount;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const alphas = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            sizes[i] = Math.random() * 2 + 0.5;
            alphas[i] = Math.random() * 0.5 + 0.1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(COLORS_HEX.champagneGold) },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        
        void main() {
          vAlpha = alpha;
          
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + position.x * 0.5) * 0.2;
          pos.x += cos(uTime * 0.3 + position.z * 0.3) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.ambientParticles = new THREE.Points(geometry, material);
        this.scene.add(this.ambientParticles);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('orientationchange', this.onResize.bind(this));

        // Mouse events
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Touch events for mobile
        window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    }

    /**
     * Handle window resize
     */
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    /**
     * Handle mouse movement
     */
    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / this.width) * 2 - 1;
        this.targetMouse.y = -(event.clientY / this.height) * 2 + 1;

        // Update cursor element position
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.left = event.clientX + 'px';
            cursor.style.top = event.clientY + 'px';
        }
    }

    /**
     * Handle touch start
     */
    onTouchStart(event) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            this.updateTouchPosition(touch);

            // Dispatch synthetic mouse event for compatibility
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true
            });
            event.target.dispatchEvent(mouseEvent);
        }
    }

    /**
     * Handle touch move
     */
    onTouchMove(event) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            this.updateTouchPosition(touch);

            // Dispatch synthetic mouse event for compatibility
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true
            });
            event.target.dispatchEvent(mouseEvent);
        }
    }

    /**
     * Handle touch end
     */
    onTouchEnd(event) {
        // Dispatch synthetic mouse event for compatibility
        const mouseEvent = new MouseEvent('mouseup', {
            bubbles: true
        });
        event.target.dispatchEvent(mouseEvent);
    }

    /**
     * Update touch position (shared logic)
     */
    updateTouchPosition(touch) {
        this.targetMouse.x = (touch.clientX / this.width) * 2 - 1;
        this.targetMouse.y = -(touch.clientY / this.height) * 2 + 1;

        // Hide custom cursor on touch devices
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.opacity = '0';
        }
    }

    /**
     * Register update callback
     */
    onUpdate(callback) {
        this.callbacks.push(callback);
        return () => {
            const index = this.callbacks.indexOf(callback);
            if (index > -1) this.callbacks.splice(index, 1);
        };
    }

    /**
     * Animate camera to position
     */
    animateCameraTo(position, lookAt, duration = 1.5) {
        return new Promise(resolve => {
            gsap.to(this.camera.position, {
                x: position.x,
                y: position.y,
                z: position.z,
                duration,
                ease: 'power3.inOut',
                onUpdate: () => {
                    if (lookAt) {
                        this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
                    }
                },
                onComplete: resolve
            });
        });
    }

    /**
     * Main render loop
     */
    render() {
        if (!this.isRunning) return;

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // Smooth mouse interpolation
        this.mouseVelocity.x = this.targetMouse.x - this.mouse.x;
        this.mouseVelocity.y = this.targetMouse.y - this.mouse.y;
        this.mouse.x += this.mouseVelocity.x * 0.1;
        this.mouse.y += this.mouseVelocity.y * 0.1;

        // Update ambient particles
        if (this.ambientParticles) {
            this.ambientParticles.material.uniforms.uTime.value = elapsed;
            this.ambientParticles.rotation.y += 0.0001;
        }

        // Subtle camera movement based on mouse - DISABLED per user request
        // this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
        // this.camera.position.y += (this.mouse.y * 0.3 + 2 - this.camera.position.y) * 0.02;

        // Call registered callbacks
        this.callbacks.forEach(cb => cb(delta, elapsed));

        // Render scene
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Start render loop
     */
    start() {
        this.isRunning = true;
        this.clock.start();
        this.render();
    }

    /**
     * Stop render loop
     */
    stop() {
        this.isRunning = false;
        this.clock.stop();
    }

    /**
     * Dispose of resources
     */
    dispose() {
        this.stop();

        this.scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        this.renderer.dispose();

        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
    }
}

export default SceneManager;
