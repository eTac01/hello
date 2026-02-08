/**
 * LandingScene — 360° Rotatable Cinematic Experience
 * Holographic heart hero with advanced particles and interactive camera
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

        // Camera controls for 360° rotation
        this.cameraControls = {
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 },
            rotation: { x: 0, y: 0 },
            targetRotation: { x: 0, y: 0 },
            autoRotateSpeed: 0.001,
            isAutoRotating: true,
            autoRotateTimeout: null,
            inertia: { x: 0, y: 0 },
            zoom: 12,
            targetZoom: 12,
            minZoom: 8,
            maxZoom: 20
        };

        this.init();
    }

    /**
     * Initialize the landing scene
     */
    init() {
        // Add ring group to scene
        this.sceneManager.scene.add(this.ringGroup);

        // Create environment
        this.createEnvironment();

        // Create holographic heart hero
        this.createHolographicHeart();

        // Create romantic particle system
        this.createRomanticParticles();

        // Create capsules
        this.createCapsules();

        // Create connections
        this.createConnections();

        // Create return button
        this.createReturnButton();

        // Setup interaction
        this.setupCameraControls();
        this.setupInteraction();
        this.setupDoubleClickInteraction();

        // Register update callback
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));

        // Initial camera position
        this.sceneManager.camera.position.set(0, 4, this.cameraControls.zoom);
        this.sceneManager.camera.lookAt(0, 0, 0);

        // Add fog for depth
        this.sceneManager.scene.fog = new THREE.FogExp2(COLORS_HEX.charcoal, 0.02);

        // Play intro animation
        this.playIntroAnimation();
    }

    /**
     * Create Cyberpunk Environment
     */
    createEnvironment() {
        // Neon Grid Floor
        const gridHelper = new THREE.GridHelper(40, 40, COLORS_HEX.roseRed, COLORS_HEX.deepPurple);
        gridHelper.position.y = -2;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.sceneManager.scene.add(gridHelper);

        // Reflective Floor
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
        floor.position.y = -2.01;
        this.sceneManager.scene.add(floor);

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(COLORS_HEX.deepPurple, 2.0);
        this.sceneManager.scene.add(ambientLight);

        // Point lights for neon glow
        const blueLight = new THREE.PointLight(COLORS_HEX.champagneGold, 2, 20);
        blueLight.position.set(5, 2, 5);
        this.sceneManager.scene.add(blueLight);

        const pinkLight = new THREE.PointLight(COLORS_HEX.roseRed, 2, 20);
        pinkLight.position.set(-5, 2, 5);
        this.sceneManager.scene.add(pinkLight);
    }

    /**
     * Create Holographic Heart Hero Object
     */
    createHolographicHeart() {
        // Create heart shape using custom geometry
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 0.5, y + 0.5);
        heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
        heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
        heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
            depth: 0.4,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };

        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        geometry.center();
        geometry.scale(0.8, 0.8, 0.8);

        // Holographic shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(COLORS_HEX.roseRed) },
                uColor2: { value: new THREE.Color(COLORS_HEX.champagneGold) },
                uGlowIntensity: { value: 1.0 },
                uHoverGlow: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform float uTime;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    
                    // Breathing animation
                    vec3 pos = position;
                    float breathe = sin(uTime * 1.5) * 0.05;
                    pos *= (1.0 + breathe);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uGlowIntensity;
                uniform float uHoverGlow;
                
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    // Color pulsing
                    float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
                    vec3 color = mix(uColor1, uColor2, pulse);
                    
                    // Fresnel glow
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 3.0);
                    
                    // Scanline effect
                    float scanline = sin(vPosition.y * 20.0 + uTime * 2.0) * 0.1 + 0.9;
                    
                    // Combine effects
                    vec3 finalColor = color * scanline;
                    float alpha = 0.3 + fresnel * 0.7 + uHoverGlow * 0.3;
                    alpha *= uGlowIntensity;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.holographicHeart = new THREE.Mesh(geometry, material);
        this.holographicHeart.position.set(0, 0, 0);
        this.holographicHeart.userData.isHeart = true;
        this.ringGroup.add(this.holographicHeart);

        // Add outer glow ring
        const ringGeometry = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: COLORS_HEX.roseRed,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        this.glowRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.glowRing.rotation.x = Math.PI / 2;
        this.ringGroup.add(this.glowRing);
    }

    /**
     * Create Romantic Particle System
     */
    createRomanticParticles() {
        const particleCount = this.sceneManager.qualityTier === 'low' ? 500 :
            this.sceneManager.qualityTier === 'medium' ? 1000 : 2000;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const alphas = new Float32Array(particleCount);
        const phases = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Distribute particles in heart-shaped paths
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2 + Math.random() * 3;

            // Heart curve parametric equations
            const t = angle;
            const x = radius * 16 * Math.pow(Math.sin(t), 3) * 0.1;
            const y = radius * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.1;
            const z = (Math.random() - 0.5) * 2;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            sizes[i] = Math.random() * 2 + 1;
            alphas[i] = Math.random() * 0.5 + 0.3;
            phases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(COLORS_HEX.champagneGold) },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute float alpha;
                attribute float phase;
                varying float vAlpha;
                uniform float uTime;
                uniform float uPixelRatio;
                
                void main() {
                    vAlpha = alpha;
                    
                    vec3 pos = position;
                    
                    // Orbit animation
                    float angle = uTime * 0.3 + phase;
                    float radius = length(pos.xy);
                    pos.x = cos(angle) * radius;
                    pos.y = sin(angle) * radius;
                    
                    // Floating motion
                    pos.z += sin(uTime + phase) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    
                    // Depth-based size
                    float depthFade = smoothstep(10.0, 0.0, -mvPosition.z);
                    gl_PointSize = size * uPixelRatio * (100.0 / -mvPosition.z) * depthFade;
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

        this.romanticParticles = new THREE.Points(geometry, material);
        this.ringGroup.add(this.romanticParticles);
    }

    /**
     * Create all 8 capsules
     */
    createCapsules() {
        TIMELINE.forEach((day, index) => {
            const capsule = new Capsule(index, this.sceneManager);
            const state = timeGatekeeper.getCapsuleState(index);
            capsule.setState(state);
            this.capsules.push(capsule);
        });
    }

    /**
     * Create connections
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
     * Create return button in top-left corner
     */
    createReturnButton() {
        this.returnButton = document.createElement('button');
        this.returnButton.className = 'landing-return-btn';
        this.returnButton.innerHTML = '← Return';

        this.returnButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 100;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.9rem;
            padding: 12px 24px;
            background: rgba(18, 12, 24, 0.8);
            border: 2px solid #00ffff;
            border-radius: 8px;
            color: #00ffff;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(-20px);
        `;

        // Add hover effect
        this.returnButton.addEventListener('mouseenter', () => {
            this.returnButton.style.background = 'rgba(0, 255, 255, 0.2)';
            this.returnButton.style.borderColor = '#ff00ff';
            this.returnButton.style.color = '#ff00ff';
            this.returnButton.style.transform = 'translateX(0) scale(1.05)';
            this.returnButton.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        });

        this.returnButton.addEventListener('mouseleave', () => {
            this.returnButton.style.background = 'rgba(18, 12, 24, 0.8)';
            this.returnButton.style.borderColor = '#00ffff';
            this.returnButton.style.color = '#00ffff';
            this.returnButton.style.transform = 'translateX(0) scale(1)';
            this.returnButton.style.boxShadow = 'none';
        });

        // Add click handler - currently just reloads page, can be customized
        this.returnButton.addEventListener('click', () => {
            window.location.reload();
        });

        document.body.appendChild(this.returnButton);

        // Fade in after intro
        setTimeout(() => {
            this.returnButton.style.opacity = '1';
            this.returnButton.style.transform = 'translateX(0)';
        }, 2000);
    }

    /**
     * Setup 360° Camera Controls
     */
    setupCameraControls() {
        // Mouse drag controls
        window.addEventListener('mousedown', this.onCameraDragStart.bind(this));
        window.addEventListener('mousemove', this.onCameraDragMove.bind(this));
        window.addEventListener('mouseup', this.onCameraDragEnd.bind(this));

        // Touch drag controls
        window.addEventListener('touchstart', this.onTouchDragStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.onTouchDragMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchDragEnd.bind(this), { passive: false });

        // Zoom controls
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    }

    /**
     * Camera drag start (mouse)
     */
    onCameraDragStart(event) {
        // Don't interfere with capsule interactions
        if (this.hoveredCapsule) return;

        this.cameraControls.isDragging = true;
        this.cameraControls.isAutoRotating = false;
        this.cameraControls.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };

        // Clear auto-rotate timeout
        if (this.cameraControls.autoRotateTimeout) {
            clearTimeout(this.cameraControls.autoRotateTimeout);
        }
    }

    /**
     * Camera drag move (mouse)
     */
    onCameraDragMove(event) {
        if (!this.cameraControls.isDragging) return;

        const deltaX = event.clientX - this.cameraControls.previousMousePosition.x;
        const deltaY = event.clientY - this.cameraControls.previousMousePosition.y;

        this.cameraControls.targetRotation.y += deltaX * 0.005;
        this.cameraControls.targetRotation.x += deltaY * 0.005;

        // Clamp vertical rotation
        this.cameraControls.targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.cameraControls.targetRotation.x));

        // Store inertia
        this.cameraControls.inertia.x = deltaY * 0.005;
        this.cameraControls.inertia.y = deltaX * 0.005;

        this.cameraControls.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    /**
     * Camera drag end (mouse)
     */
    onCameraDragEnd(event) {
        this.cameraControls.isDragging = false;

        // Resume auto-rotate after 2 seconds of inactivity
        this.cameraControls.autoRotateTimeout = setTimeout(() => {
            this.cameraControls.isAutoRotating = true;
        }, 2000);
    }

    /**
     * Touch drag start
     */
    onTouchDragStart(event) {
        if (event.touches.length !== 1) return;
        if (this.hoveredCapsule) return;

        const touch = event.touches[0];
        this.cameraControls.isDragging = true;
        this.cameraControls.isAutoRotating = false;
        this.cameraControls.previousMousePosition = {
            x: touch.clientX,
            y: touch.clientY
        };

        if (this.cameraControls.autoRotateTimeout) {
            clearTimeout(this.cameraControls.autoRotateTimeout);
        }
    }

    /**
     * Touch drag move
     */
    onTouchDragMove(event) {
        if (!this.cameraControls.isDragging || event.touches.length !== 1) return;

        event.preventDefault();
        const touch = event.touches[0];
        const deltaX = touch.clientX - this.cameraControls.previousMousePosition.x;
        const deltaY = touch.clientY - this.cameraControls.previousMousePosition.y;

        this.cameraControls.targetRotation.y += deltaX * 0.005;
        this.cameraControls.targetRotation.x += deltaY * 0.005;
        this.cameraControls.targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.cameraControls.targetRotation.x));

        this.cameraControls.previousMousePosition = {
            x: touch.clientX,
            y: touch.clientY
        };
    }

    /**
     * Touch drag end
     */
    onTouchDragEnd(event) {
        this.cameraControls.isDragging = false;
        this.cameraControls.autoRotateTimeout = setTimeout(() => {
            this.cameraControls.isAutoRotating = true;
        }, 2000);
    }

    /**
     * Wheel zoom
     */
    onWheel(event) {
        event.preventDefault();
        const delta = event.deltaY * 0.01;
        this.cameraControls.targetZoom = Math.max(
            this.cameraControls.minZoom,
            Math.min(this.cameraControls.maxZoom, this.cameraControls.targetZoom + delta)
        );
    }

    /**
     * Setup mouse/touch interaction for capsules
     */
    setupInteraction() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });

        // Create global function for button clicks
        window.enterCapsuleExperience = (dayIndex) => {
            console.log('Entering experience for day:', dayIndex);
            if (this.isActive) {
                this.enterExperience(dayIndex);
            }
        };
    }

    onTouchStart(event) {
        if (!this.isActive || event.touches.length === 0) return;
        const touch = event.touches[0];
        this.updateTouchHover(touch);
    }

    onTouchEnd(event) {
        if (!this.isActive || !this.hoveredCapsule) return;

        const result = this.hoveredCapsule.onClick();
        if (result.action === 'enter') {
            this.enterExperience(result.dayIndex);
        } else if (result.action === 'showPastMessage') {
            if (this.onDaySelected) {
                this.onDaySelected(result.dayIndex);
            }
        } else if (result.action === 'showFutureMessage') {
            this.showMessage('future', result.dayIndex);
        }

        if (this.hoveredCapsule) {
            this.hoveredCapsule.onHoverExit();
            this.hoveredCapsule = null;
            this.hideDayInfo();
        }
    }

    updateTouchHover(touch) {
        const mouse = new THREE.Vector2(
            (touch.clientX / window.innerWidth) * 2 - 1,
            -(touch.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.sceneManager.camera);

        // Check heart hover
        const heartIntersects = this.raycaster.intersectObject(this.holographicHeart);
        if (heartIntersects.length > 0) {
            this.onHeartHover();
            return;
        }

        // Check capsule hover
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
            this.onHeartHoverExit();
        }
    }

    onMouseMove(event) {
        if (!this.isActive) return;

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.sceneManager.camera);

        // Check heart hover
        const heartIntersects = this.raycaster.intersectObject(this.holographicHeart);
        if (heartIntersects.length > 0) {
            this.onHeartHover();
            return;
        } else {
            this.onHeartHoverExit();
        }

        // Check capsule hover
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
     * Heart hover effects
     */
    onHeartHover() {
        if (this.holographicHeart && this.holographicHeart.material.uniforms) {
            gsap.to(this.holographicHeart.material.uniforms.uHoverGlow, {
                value: 1.0,
                duration: 0.3
            });
        }
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.classList.add('hover');
        }
    }

    onHeartHoverExit() {
        if (this.holographicHeart && this.holographicHeart.material.uniforms) {
            gsap.to(this.holographicHeart.material.uniforms.uHoverGlow, {
                value: 0.0,
                duration: 0.3
            });
        }
    }

    onClick(event) {
        if (!this.isActive || !this.hoveredCapsule) return;

        const result = this.hoveredCapsule.onClick();

        if (result.action === 'enter') {
            this.enterExperience(result.dayIndex);
        } else if (result.action === 'showPastMessage') {
            if (this.onDaySelected) {
                this.onDaySelected(result.dayIndex);
            }
        } else if (result.action === 'showFutureMessage') {
            this.showMessage('future', result.dayIndex);
        }
    }

    async enterExperience(dayIndex) {
        this.isActive = false;
        const capsule = this.capsules[dayIndex];

        // Hide all emoji labels when entering experience
        this.capsules.forEach(c => {
            if (c.emojiElement) {
                c.emojiElement.style.display = 'none';
            }
            if (c.buttonElement) {
                c.buttonElement.style.display = 'none';
            }
        });

        await this.sceneManager.animateCameraTo(
            {
                x: capsule.mesh.position.x * 0.3,
                y: capsule.mesh.position.y + 1,
                z: capsule.mesh.position.z * 0.3 + 2
            },
            capsule.mesh.position,
            1.5
        );

        gsap.to(this.ringGroup, {
            visible: false,
            duration: 0.5
        });

        if (this.onDaySelected) {
            this.onDaySelected(dayIndex);
        }
    }

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

    hideDayInfo() {
        const existingInfo = document.querySelector('.day-info');
        if (existingInfo) {
            existingInfo.classList.remove('visible');
        }
    }

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
     * Cinematic intro animation
     */
    playIntroAnimation() {
        // Start with camera far away
        this.sceneManager.camera.position.set(0, 10, 30);

        // Hide elements initially
        this.holographicHeart.scale.set(0, 0, 0);
        this.romanticParticles.material.opacity = 0;
        this.capsules.forEach(c => c.mesh.scale.set(0, 0, 0));

        // Animate camera zoom in
        gsap.to(this.sceneManager.camera.position, {
            x: 0,
            y: 4,
            z: this.cameraControls.zoom,
            duration: 2.5,
            ease: 'power3.out'
        });

        // Heart appears
        gsap.to(this.holographicHeart.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.5,
            delay: 0.5,
            ease: 'back.out(1.7)'
        });

        // Particles fade in
        gsap.to(this.romanticParticles.material, {
            opacity: 1,
            duration: 1,
            delay: 1
        });

        // Capsules appear sequentially
        this.capsules.forEach((capsule, i) => {
            gsap.to(capsule.mesh.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.6,
                delay: 1.5 + i * 0.1,
                ease: 'back.out(1.7)'
            });
        });
    }

    /**
     * Update loop
     */
    update(delta, elapsed) {
        if (!this.isActive) return;

        // Update camera rotation with smooth interpolation
        this.cameraControls.rotation.x += (this.cameraControls.targetRotation.x - this.cameraControls.rotation.x) * 0.1;
        this.cameraControls.rotation.y += (this.cameraControls.targetRotation.y - this.cameraControls.rotation.y) * 0.1;

        // Auto-rotate
        if (this.cameraControls.isAutoRotating) {
            this.cameraControls.targetRotation.y += this.cameraControls.autoRotateSpeed;
        }

        // Apply inertia
        if (!this.cameraControls.isDragging) {
            this.cameraControls.inertia.x *= 0.95;
            this.cameraControls.inertia.y *= 0.95;
            this.cameraControls.targetRotation.x += this.cameraControls.inertia.x;
            this.cameraControls.targetRotation.y += this.cameraControls.inertia.y;
        }

        // Update camera zoom
        this.cameraControls.zoom += (this.cameraControls.targetZoom - this.cameraControls.zoom) * 0.1;

        // Apply camera rotation
        const radius = this.cameraControls.zoom;
        this.sceneManager.camera.position.x = Math.sin(this.cameraControls.rotation.y) * Math.cos(this.cameraControls.rotation.x) * radius;
        this.sceneManager.camera.position.y = Math.sin(this.cameraControls.rotation.x) * radius + 2;
        this.sceneManager.camera.position.z = Math.cos(this.cameraControls.rotation.y) * Math.cos(this.cameraControls.rotation.x) * radius;
        this.sceneManager.camera.lookAt(0, 0, 0);

        // Rotate ring slowly
        this.ringGroup.rotation.y += ANIMATION.capsuleRotationSpeed;

        // Update holographic heart
        if (this.holographicHeart && this.holographicHeart.material.uniforms) {
            this.holographicHeart.material.uniforms.uTime.value = elapsed;
            this.holographicHeart.rotation.y += 0.002;
        }

        // Update glow ring
        if (this.glowRing) {
            this.glowRing.rotation.z += 0.001;
            this.glowRing.material.opacity = 0.3 + Math.sin(elapsed * 2) * 0.1;
        }

        // Update romantic particles
        if (this.romanticParticles && this.romanticParticles.material.uniforms) {
            this.romanticParticles.material.uniforms.uTime.value = elapsed;
        }

        // Update capsules
        this.capsules.forEach(capsule => {
            capsule.update(delta, elapsed);
        });
    }

    returnFromExperience() {
        this.ringGroup.visible = true;
        this.isActive = true;

        // Show all emoji labels again
        this.capsules.forEach(c => {
            if (c.emojiElement) {
                c.emojiElement.style.display = 'block';
            }
            if (c.buttonElement) {
                c.buttonElement.style.display = 'block';
            }
        });

        this.sceneManager.animateCameraTo(
            { x: 0, y: 4, z: this.cameraControls.zoom },
            { x: 0, y: 0, z: 0 },
            1.5
        );

        this.capsules.forEach((capsule, index) => {
            const state = timeGatekeeper.getCapsuleState(index);
            capsule.setState(state);
        });
    }

    setupDoubleClickInteraction() {
        window.addEventListener('dblclick', () => {
            this.triggerTimeAcceleration();
        });
    }

    triggerTimeAcceleration() {
        gsap.to(this.ringGroup.rotation, {
            y: this.ringGroup.rotation.y + Math.PI * 2,
            duration: 2,
            ease: 'power4.inOut'
        });

        if (this.holographicHeart) {
            gsap.fromTo(this.holographicHeart.scale,
                { x: 1, y: 1, z: 1 },
                { x: 1.5, y: 1.5, z: 1.5, duration: 1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            );
        }
    }

    dispose() {
        this.isActive = false;

        if (this.unsubscribeUpdate) {
            this.unsubscribeUpdate();
        }

        // Remove return button
        if (this.returnButton && this.returnButton.parentNode) {
            this.returnButton.parentNode.removeChild(this.returnButton);
        }

        this.capsules.forEach(capsule => capsule.dispose());

        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('click', this.onClick.bind(this));
        window.removeEventListener('mousedown', this.onCameraDragStart.bind(this));
        window.removeEventListener('mousemove', this.onCameraDragMove.bind(this));
        window.removeEventListener('mouseup', this.onCameraDragEnd.bind(this));

        if (this.ringGroup.parent) {
            this.sceneManager.scene.remove(this.ringGroup);
        }
    }
}

export default LandingScene;
