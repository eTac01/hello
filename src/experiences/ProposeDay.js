/**
 * ProposeDay — February 8th Experience
 * Theme: Confession
 * 
 * Drag drifting words to form a confession
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class ProposeDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);

        this.words = [];
        this.wordData = ['I', 'have', 'always', 'loved', 'you'];
        this.correctOrder = [0, 1, 2, 3, 4];
        this.placedWords = [];
        this.targetLine = null;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedWord = null;
    }

    getInstruction() {
        return 'Arrange the words... speak from the heart';
    }

    getCompletionMessage() {
        return 'Some words wait a lifetime<br>to be spoken.';
    }

    async init() {
        this.createWords();
        this.createTargetLine();
        this.setupInteraction();

        await super.init();

        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    createWords() {
        const loader = new THREE.FontLoader ? new THREE.FontLoader() : null;

        // Fallback: Use simple plane meshes with texture
        this.wordData.forEach((word, index) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 128;

            ctx.fillStyle = 'transparent';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = 'italic 48px Cormorant Garamond, serif';
            ctx.fillStyle = '#f1c27d';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(word, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            const geometry = new THREE.PlaneGeometry(1.5, 0.75);
            const mesh = new THREE.Mesh(geometry, material);

            // Random starting positions
            mesh.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 2
            );

            mesh.userData = {
                index: index,
                word: word,
                floatOffset: Math.random() * Math.PI * 2,
                isPlaced: false,
                originalPos: mesh.position.clone()
            };

            this.words.push(mesh);
            this.group.add(mesh);
        });
    }

    createTargetLine() {
        // Create slots for words
        const slotGeo = new THREE.PlaneGeometry(1.4, 0.1);
        const slotMat = new THREE.MeshBasicMaterial({
            color: COLORS_HEX.champagneGold,
            transparent: true,
            opacity: 0.2
        });

        this.slots = [];
        const startX = -3;

        for (let i = 0; i < 5; i++) {
            const slot = new THREE.Mesh(slotGeo, slotMat.clone());
            slot.position.set(startX + i * 1.5, -2, 0);
            slot.userData = { slotIndex: i, occupied: false };
            this.slots.push(slot);
            this.group.add(slot);
        }
    }

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

    onPointerMove(event) {
        // Prevent default for touch
        if (event.type === 'touchmove') {
            event.preventDefault();
        }

        // Get position from mouse or touch
        const clientX = event.clientX || (event.touches && event.touches[0] && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0] && event.touches[0].clientY);

        if (clientX === undefined || clientY === undefined) return;

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        if (this.selectedWord) {
            const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
            vector.unproject(this.sceneManager.camera);
            const dir = vector.sub(this.sceneManager.camera.position).normalize();
            const distance = -this.sceneManager.camera.position.z / dir.z;
            const pos = this.sceneManager.camera.position.clone().add(dir.multiplyScalar(distance));

            gsap.to(this.selectedWord.position, {
                x: pos.x,
                y: pos.y,
                duration: 0.1
            });
        }
    }

    onPointerDown(event) {
        if (this.phase !== 'interactive') return;

        // Prevent default for touch
        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
        const intersects = this.raycaster.intersectObjects(this.words);

        if (intersects.length > 0 && !intersects[0].object.userData.isPlaced) {
            this.selectedWord = intersects[0].object;
            gsap.to(this.selectedWord.scale, { x: 1.2, y: 1.2, duration: 0.2 });
        }
    }

    onPointerUp(event) {
        // Prevent default for touch
        if (event && event.type === 'touchend') {
            event.preventDefault();
        }
        if (!this.selectedWord) return;

        // Find nearest slot
        let nearestSlot = null;
        let minDist = Infinity;

        this.slots.forEach(slot => {
            if (!slot.userData.occupied) {
                const dist = this.selectedWord.position.distanceTo(slot.position);
                if (dist < minDist && dist < 1.5) {
                    minDist = dist;
                    nearestSlot = slot;
                }
            }
        });

        if (nearestSlot) {
            this.placeWord(this.selectedWord, nearestSlot);
        } else {
            gsap.to(this.selectedWord.scale, { x: 1, y: 1, duration: 0.2 });
        }

        this.selectedWord = null;
    }

    placeWord(word, slot) {
        word.userData.isPlaced = true;
        slot.userData.occupied = true;
        slot.userData.wordIndex = word.userData.index;

        this.placedWords[slot.userData.slotIndex] = word.userData.index;

        gsap.to(word.position, {
            x: slot.position.x,
            y: slot.position.y + 0.3,
            z: 0,
            duration: 0.5,
            ease: 'power3.out'
        });

        gsap.to(word.scale, { x: 1, y: 1, duration: 0.3 });
        gsap.to(slot.material, { opacity: 0.5, duration: 0.3 });

        // Check if all placed
        const placedCount = this.words.filter(w => w.userData.isPlaced).length;
        if (placedCount >= 5) {
            this.checkSentence();
        }
    }

    checkSentence() {
        // Check if in correct order
        const isCorrect = this.placedWords.every((wordIndex, slotIndex) => {
            return wordIndex === this.correctOrder[slotIndex];
        });

        if (isCorrect) {
            this.onConfessionComplete();
        } else {
            // Reset for retry
            this.resetWords();
        }
    }

    resetWords() {
        this.words.forEach(word => {
            word.userData.isPlaced = false;
            gsap.to(word.position, {
                x: word.userData.originalPos.x,
                y: word.userData.originalPos.y,
                z: word.userData.originalPos.z,
                duration: 0.8
            });
        });

        this.slots.forEach(slot => {
            slot.userData.occupied = false;
            gsap.to(slot.material, { opacity: 0.2, duration: 0.3 });
        });

        this.placedWords = [];
    }

    async onConfessionComplete() {
        // Pulse effect
        this.words.forEach((word, i) => {
            gsap.to(word.material, {
                opacity: 0,
                duration: 1,
                delay: i * 0.2
            });
        });

        // Show acceptance pulse
        const pulse = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: COLORS_HEX.roseRed,
                transparent: true,
                opacity: 0.8
            })
        );
        pulse.position.set(0, -1.5, 0);
        this.group.add(pulse);

        gsap.to(pulse.scale, {
            x: 20,
            y: 20,
            z: 20,
            duration: 2,
            ease: 'power2.out'
        });

        gsap.to(pulse.material, {
            opacity: 0,
            duration: 2,
            onComplete: () => this.complete()
        });
    }

    update(delta, elapsed) {
        if (!this.isActive) return;

        this.words.forEach(word => {
            if (!word.userData.isPlaced && word !== this.selectedWord) {
                const offset = word.userData.floatOffset;
                word.position.y = word.userData.originalPos.y + Math.sin(elapsed + offset) * 0.3;
                word.rotation.z = Math.sin(elapsed * 0.5 + offset) * 0.1;
            }
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

export default ProposeDay;
