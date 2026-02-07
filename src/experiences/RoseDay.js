/**
 * RoseDay — February 7th Experience
 * Theme: Admiration
 * 
 * Gamified: Collect petals -> Unlock Box -> Reveal Rose & Letter -> Read Quote
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import BaseExperience from './BaseExperience.js';
import { COLORS_HEX } from '../utils/constants.js';

class RoseDay extends BaseExperience {
    constructor(dayIndex, sceneManager, onComplete) {
        super(dayIndex, sceneManager, onComplete);

        // Game state
        this.gamePhase = 'intro'; // intro -> quiz -> celebration -> boxReveal -> giftChoice -> ending
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;

        // Quiz questions
        this.quizQuestions = [
            {
                question: "What does a red rose symbolize?",
                options: ["Friendship", "Love and Romance", "Gratitude", "Peace"],
                correct: 1
            },
            {
                question: "Rose Day is celebrated on which date in Valentine's Week?",
                options: ["February 7th", "February 10th", "February 12th", "February 14th"],
                correct: 0
            },
            {
                question: "A dozen roses typically represents what?",
                options: ["Friendship", "Be mine", "Gratitude", "Perfect love"],
                correct: 3
            }
        ];

        // 3D Objects
        this.box = null;
        this.boxLid = null;
        this.letter = null;
        this.revealedRose = null;

        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Quote
        this.romanticQuote = "Life is the flower for which love is the honey.";
        this.quoteAuthor = "— Victor Hugo";
    }

    getInstruction() {
        return 'Click "Let\'s Go" to reveal your surprise...';
    }

    getCompletionMessage() {
        return 'A secret unlocked,<br>love revealed in petals.';
    }

    /**
     * Initialize Rose Day experience
     */
    async init() {
        this.createLockedBox();
        this.createLetsGoButton();
        this.setupInteraction();

        await super.init();

        // Start update loop
        this.unsubscribeUpdate = this.sceneManager.onUpdate(this.update.bind(this));
    }

    /**
     * Create Let's Go button
     */
    createLetsGoButton() {
        this.buttonElement = document.createElement('div');
        this.buttonElement.id = 'lets-go-button';
        this.buttonElement.innerHTML = `
            <button class="lets-go-btn">Let's Go</button>
        `;
        this.buttonElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .lets-go-btn {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                padding: 15px 40px;
                background: linear-gradient(135deg, #ff00ff, #00ffff);
                border: 2px solid #ffffff;
                border-radius: 50px;
                color: #ffffff;
                cursor: pointer;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4);
                transition: all 0.3s ease;
            }
            .lets-go-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 0 30px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6);
            }
            .lets-go-btn:active {
                transform: scale(0.95);
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
                .lets-go-btn {
                    font-size: 1.2rem;
                    padding: 12px 30px;
                }
            }
            @media (max-width: 480px) {
                .lets-go-btn {
                    font-size: 1rem;
                    padding: 10px 25px;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.buttonElement);

        // Fade in
        setTimeout(() => {
            this.buttonElement.style.opacity = '1';
        }, 500);

        // Add click handler
        const btn = this.buttonElement.querySelector('.lets-go-btn');
        btn.addEventListener('click', () => {
            this.onLetsGoClick();
        });
    }

    /**
     * Create the locked mystery box (initially hidden)
     */
    createLockedBox() {
        // Box base
        const boxGeometry = new THREE.BoxGeometry(1.2, 0.8, 1.2);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d1b4e, // Deep purple
            metalness: 0.8,
            roughness: 0.2,
            emissive: COLORS_HEX.champagneGold,
            emissiveIntensity: 0.05
        });
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.box.position.set(0, -0.4, 0);
        this.box.visible = false;
        this.group.add(this.box);

        // Box lid (separate for opening animation)
        const lidGeometry = new THREE.BoxGeometry(1.3, 0.15, 1.3);
        const lidMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d1b4e,
            metalness: 0.9,
            roughness: 0.1,
            emissive: COLORS_HEX.roseRed,
            emissiveIntensity: 0.1
        });
        this.boxLid = new THREE.Mesh(lidGeometry, lidMaterial);
        this.boxLid.position.set(0, 0.05, 0);
        this.boxLid.visible = false;
        this.group.add(this.boxLid);

        // Neon edge glow (wireframe)
        const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: COLORS_HEX.champagneGold,
            linewidth: 2
        });
        this.boxEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.boxEdges.position.copy(this.box.position);
        this.boxEdges.visible = false;
        this.group.add(this.boxEdges);

        // Letter inside box
        this.createLetter();

        // Rose inside box
        this.createRevealedRose();
    }

    /**
     * Create the letter object
     */
    createLetter() {
        const letterGeometry = new THREE.PlaneGeometry(0.6, 0.4);
        const letterMaterial = new THREE.MeshStandardMaterial({
            color: 0xfff5e6, // Cream/parchment
            metalness: 0.0,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        this.letter = new THREE.Mesh(letterGeometry, letterMaterial);
        this.letter.position.set(0, -0.3, 0.3);
        this.letter.rotation.x = -Math.PI / 6;
        this.letter.visible = false;
        this.group.add(this.letter);

        // Heart seal on letter
        const sealGeometry = new THREE.CircleGeometry(0.08, 32);
        const sealMaterial = new THREE.MeshStandardMaterial({
            color: COLORS_HEX.roseRed,
            emissive: COLORS_HEX.roseRed,
            emissiveIntensity: 0.3
        });
        this.seal = new THREE.Mesh(sealGeometry, sealMaterial);
        this.seal.position.set(0, -0.3, 0.31);
        this.seal.rotation.x = -Math.PI / 6;
        this.seal.visible = false;
        this.group.add(this.seal);
    }

    /**
     * Create the revealed rose (pre-assembled)
     */
    createRevealedRose() {
        this.revealedRose = new THREE.Group();

        // Create a simple stylized rose from layers
        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.quadraticCurveTo(0.12, 0.15, 0, 0.3);
        petalShape.quadraticCurveTo(-0.12, 0.15, 0, 0);

        const extrudeSettings = { depth: 0.01, bevelEnabled: false };
        const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);

        for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < 5; i++) {
                const material = new THREE.MeshStandardMaterial({
                    color: COLORS_HEX.roseRed,
                    metalness: 0.1,
                    roughness: 0.6,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.9
                });

                const petal = new THREE.Mesh(petalGeometry, material);
                const angle = (i / 5) * Math.PI * 2 + layer * 0.3;
                const radius = 0.08 + layer * 0.08;

                petal.position.set(
                    Math.cos(angle) * radius,
                    layer * 0.05,
                    Math.sin(angle) * radius
                );
                petal.rotation.set(
                    Math.PI / 4 + layer * 0.15,
                    angle + Math.PI / 2,
                    0
                );
                petal.scale.setScalar(0.8 + layer * 0.2);

                this.revealedRose.add(petal);
            }
        }

        this.revealedRose.position.set(-0.3, -0.2, 0);
        this.revealedRose.visible = false;
        this.group.add(this.revealedRose);
    }

    /**
     * Handle Let's Go button click
     */
    onLetsGoClick() {
        // Hide button with animation
        gsap.to(this.buttonElement, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.buttonElement.remove();
            }
        });

        // Show quiz
        setTimeout(() => this.showQuiz(), 500);
    }

    /**
     * Display quiz overlay
     */
    showQuiz() {
        this.gamePhase = 'quiz';
        this.currentQuestionIndex = 0;

        this.quizOverlay = document.createElement('div');
        this.quizOverlay.id = 'quiz-overlay';
        this.quizOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(18, 12, 24, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;
        document.body.appendChild(this.quizOverlay);

        this.updateQuizDisplay();

        // Fade in
        setTimeout(() => {
            this.quizOverlay.style.opacity = '1';
        }, 50);
    }

    /**
     * Update quiz display with current question
     */
    updateQuizDisplay() {
        const q = this.quizQuestions[this.currentQuestionIndex];

        this.quizOverlay.innerHTML = `
            <div class="quiz-card">
                <div class="quiz-header">Rose Day Quiz</div>
                <div class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.quizQuestions.length}</div>
                <div class="question-text">${q.question}</div>
                <div class="options-container">
                    ${q.options.map((opt, i) => `
                        <button class="option-btn" data-index="${i}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quiz-card {
                background: linear-gradient(135deg, #2d1b4e, #120c18);
                border: 3px solid #ff00ff;
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 0 40px rgba(255, 0, 255, 0.5);
            }
            .quiz-header {
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                color: #00ffff;
                text-align: center;
                margin-bottom: 10px;
                text-shadow: 0 0 15px #00ffff;
            }
            .question-number {
                font-family: 'Orbitron', sans-serif;
                font-size: 1rem;
                color: #ff00ff;
                text-align: center;
                margin-bottom: 30px;
            }
            .question-text {
                font-family: 'Patrick Hand', cursive;
                font-size: 1.5rem;
                color: #ffffff;
                margin-bottom: 30px;
                text-align: center;
            }
            .options-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .option-btn {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.1rem;
                padding: 15px 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #00ffff;
                border-radius: 10px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.3s;
            }
            .option-btn:hover {
                background: rgba(0, 255, 255, 0.2);
                transform: translateX(10px);
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            }
            .option-btn.correct {
                background: rgba(0, 255, 0, 0.3);
                border-color: #00ff00;
            }
            .option-btn.wrong {
                background: rgba(255, 0, 0, 0.3);
                border-color: #ff0000;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .quiz-card {
                    padding: 30px 20px;
                    width: 95%;
                }
                .quiz-header {
                    font-size: 1.5rem;
                }
                .question-text {
                    font-size: 1.2rem;
                }
                .option-btn {
                    font-size: 1rem;
                    padding: 12px 15px;
                }
            }
            @media (max-width: 480px) {
                .quiz-card {
                    padding: 20px 15px;
                }
                .quiz-header {
                    font-size: 1.3rem;
                }
                .question-text {
                    font-size: 1.1rem;
                }
                .option-btn {
                    font-size: 0.9rem;
                    padding: 10px 12px;
                }
            }
        `;
        document.head.appendChild(style);

        // Add click handlers to options
        const options = this.quizOverlay.querySelectorAll('.option-btn');
        options.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuizAnswer(e));
        });
    }

    /**
     * Handle quiz answer selection
     */
    handleQuizAnswer(event) {
        const selectedIndex = parseInt(event.target.dataset.index);
        const q = this.quizQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === q.correct;

        if (isCorrect) {
            this.correctAnswers++;
            event.target.classList.add('correct');
        } else {
            event.target.classList.add('wrong');
            // Show correct answer
            const correctBtn = this.quizOverlay.querySelector(`[data-index="${q.correct}"]`);
            correctBtn.classList.add('correct');
        }

        // Disable all buttons
        const allBtns = this.quizOverlay.querySelectorAll('.option-btn');
        allBtns.forEach(btn => btn.disabled = true);

        // Move to next question or finish
        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.quizQuestions.length) {
                this.updateQuizDisplay();
            } else {
                this.finishQuiz();
            }
        }, 1500);
    }

    /**
     * Finish quiz and check if user passed
     */
    finishQuiz() {
        const passed = this.correctAnswers >= 2; // Need at least 2 correct

        if (passed) {
            gsap.to(this.quizOverlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    this.quizOverlay.remove();
                    this.showCelebration();
                }
            });
        } else {
            // Show retry message
            this.quizOverlay.innerHTML = `
                <div class="quiz-card">
                    <div class="quiz-header" style="color: #ff0000;">Try Again!</div>
                    <div class="question-text">You got ${this.correctAnswers} out of ${this.quizQuestions.length} correct.</div>
                    <div class="question-text">You need at least 2 correct answers.</div>
                    <button class="option-btn" id="retry-btn">Retry Quiz</button>
                </div>
            `;

            document.getElementById('retry-btn').addEventListener('click', () => {
                this.currentQuestionIndex = 0;
                this.correctAnswers = 0;
                this.updateQuizDisplay();
            });
        }
    }
    /**
     * Show celebration page with confetti
     */
    showCelebration() {
        this.gamePhase = 'celebration';

        // Create celebration overlay
        this.celebrationOverlay = document.createElement('div');
        this.celebrationOverlay.id = 'celebration-overlay';
        this.celebrationOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2d1b4e, #120c18);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        this.celebrationOverlay.innerHTML = `
            <div class="congrats-text">🎉 Congratulations! 🎉</div>
            <div class="congrats-subtext">You passed the Rose Day Quiz!</div>
            <button class="open-box-btn">Open Your Gift</button>
        `;

        document.body.appendChild(this.celebrationOverlay);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .congrats-text {
                font-family: 'Orbitron', sans-serif;
                font-size: 3rem;
                color: #ff00ff;
                text-shadow: 0 0 20px #ff00ff;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            .congrats-subtext {
                font-family: 'Patrick Hand', cursive;
                font-size: 1.5rem;
                color: #00ffff;
                margin-bottom: 40px;
            }
            .open-box-btn {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.3rem;
                padding: 15px 40px;
                background: linear-gradient(135deg, #ff00ff, #ff69b4);
                border: 2px solid #ffffff;
                border-radius: 50px;
                color: #ffffff;
                cursor: pointer;
                box-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
                transition: all 0.3s;
            }
            .open-box-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 0 40px rgba(255, 105, 180, 0.8);
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);

        // Fade in
        setTimeout(() => {
            this.celebrationOverlay.style.opacity = '1';
            this.createConfetti();
        }, 50);

        // Add button handler
        this.celebrationOverlay.querySelector('.open-box-btn').addEventListener('click', () => {
            this.hideCelebration();
        });
    }

    /**
     * Create pink confetti effect
     */
    createConfetti() {
        const confettiCount = 100;
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${i % 3 === 0 ? '#FFB6C1' : i % 3 === 1 ? '#FF69B4' : '#FFC0CB'};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    opacity: ${0.5 + Math.random() * 0.5};
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: confetti-fall ${3 + Math.random() * 3}s linear forwards;
                    z-index: 1001;
                `;

                this.celebrationOverlay.appendChild(confetti);

                setTimeout(() => confetti.remove(), 6000);
            }, i * 50);
        }

        // Add confetti animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Hide celebration and show gift box
     */
    hideCelebration() {
        gsap.to(this.celebrationOverlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.celebrationOverlay.remove();
                this.showGiftBox();
            }
        });
    }

    /**
     * Show gift box with rose and letter
     */
    showGiftBox() {
        this.gamePhase = 'giftChoice';

        this.giftOverlay = document.createElement('div');
        this.giftOverlay.id = 'gift-overlay';
        this.giftOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2d1b4e, #120c18);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        this.giftOverlay.innerHTML = `
            <div class="gift-container">
                <div class="gift-header">Choose Your Gift</div>
                <div class="gifts-row">
                    <div class="gift-item" data-gift="rose">
                        <div class="gift-icon">🌹</div>
                        <div class="gift-label">Rose</div>
                        <button class="pick-btn" data-gift="rose">Pick Rose</button>
                    </div>
                    <div class="gift-item" data-gift="letter">
                        <div class="gift-icon">💌</div>
                        <div class="gift-label">Letter</div>
                        <button class="pick-btn" data-gift="letter">Pick Letter</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.giftOverlay);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .gift-container {
                text-align: center;
                padding: 40px;
            }
            .gift-header {
                font-family: 'Orbitron', sans-serif;
                font-size: 2.5rem;
                color: #ff00ff;
                text-shadow: 0 0 20px #ff00ff;
                margin-bottom: 50px;
            }
            .gifts-row {
                display: flex;
                gap: 60px;
                justify-content: center;
            }
            .gift-item {
                background: rgba(255, 255, 255, 0.05);
                border: 3px solid #00ffff;
                border-radius: 20px;
                padding: 40px;
                min-width: 200px;
                transition: all 0.3s;
            }
            .gift-item:hover {
                transform: translateY(-10px);
                box-shadow: 0 10px 40px rgba(0, 255, 255, 0.5);
            }
            .gift-icon {
                font-size: 5rem;
                margin-bottom: 20px;
            }
            .gift-label {
                font-family: 'Patrick Hand', cursive;
                font-size: 1.8rem;
                color: #ffffff;
                margin-bottom: 20px;
            }
            .pick-btn {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.1rem;
                padding: 12px 30px;
                background: linear-gradient(135deg, #ff00ff, #00ffff);
                border: 2px solid #ffffff;
                border-radius: 30px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.3s;
            }
            .pick-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            }
        `;
        document.head.appendChild(style);

        // Fade in
        setTimeout(() => {
            this.giftOverlay.style.opacity = '1';
        }, 50);

        // Add button handlers
        this.giftOverlay.querySelectorAll('.pick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gift = e.target.dataset.gift;
                this.handleGiftSelection(gift);
            });
        });
    }

    /**
     * Handle gift selection
     */
    handleGiftSelection(gift) {
        gsap.to(this.giftOverlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.giftOverlay.remove();
                if (gift === 'rose') {
                    this.showRoseWish();
                } else {
                    this.showLetter();
                }
            }
        });
    }

    /**
     * Show Rose Day wish
     */
    showRoseWish() {
        this.gamePhase = 'ending';

        const wishOverlay = document.createElement('div');
        wishOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ff69b4, #ff1493, #8b008b);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        wishOverlay.innerHTML = `
            <div style="font-size: 6rem; margin-bottom: 30px;">🌹</div>
            <div style="font-family: 'Orbitron', sans-serif; font-size: 3.5rem; color: #ffffff; text-shadow: 0 0 30px rgba(255,255,255,0.8); margin-bottom: 20px;">
                Happy Rose Day!
            </div>
            <div style="font-family: 'Patrick Hand', cursive; font-size: 1.8rem; color: #ffe4e1; text-align: center; max-width: 600px;">
                May your  life be as beautiful and fragrant as a rose! 🌹✨
            </div>
            <button class="finish-btn" style="margin-top: 40px; font-family: 'Orbitron', sans-serif; font-size: 1.2rem; padding: 15px 40px; background: rgba(255,255,255,0.2); border: 2px solid #ffffff; border-radius: 50px; color: #ffffff; cursor: pointer;">
                Complete Experience
            </button>
        `;

        document.body.appendChild(wishOverlay);

        setTimeout(() => {
            wishOverlay.style.opacity = '1';
        }, 50);

        wishOverlay.querySelector('.finish-btn').addEventListener('click', async () => {
            gsap.to(wishOverlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    wishOverlay.remove();
                    this.complete();
                }
            });
        });
    }

    /**
     * Show romantic letter with life quotes (password protected)
     */
    showLetter() {
        this.gamePhase = 'ending';

        // Create password prompt overlay
        const passwordOverlay = document.createElement('div');
        passwordOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #8b4513, #d4af37, #8b4513);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        passwordOverlay.innerHTML = `
            <div style="background: #faf0e6; border: 8px solid #d4af37; border-radius: 15px; padding: 60px; max-width: 500px; box-shadow: 0 0 50px rgba(212, 175, 55, 0.7); text-align: center;">
                <div style="font-family: 'Brush Script MT', cursive; font-size: 2.5rem; color: #8b4513; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);">
                    🔐 Locked Letter
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 1.2rem; color: #4a0e0e; margin-bottom: 30px;">
                    Enter the password to unlock your special letter
                </div>
                <input 
                    type="password" 
                    id="letter-password" 
                    placeholder="Enter password" 
                    style="font-family: 'Georgia', serif; font-size: 1.1rem; padding: 12px 20px; width: 80%; border: 2px solid #d4af37; border-radius: 10px; margin-bottom: 10px; text-align: center;"
                />
                <div id="password-error" style="font-family: 'Georgia', serif; font-size: 0.9rem; color: #ff0000; height: 20px; margin-bottom: 10px;"></div>
                <button id="unlock-btn" style="font-family: 'Georgia', serif; font-size: 1.1rem; padding: 12px 40px; background: linear-gradient(135deg, #d4af37, #ffd700); border: 2px solid #8b4513; border-radius: 30px; color: #4a0e0e; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4); margin-top: 10px;">
                    Unlock
                </button>
            </div>
        `;

        document.body.appendChild(passwordOverlay);

        // Fade in
        setTimeout(() => {
            passwordOverlay.style.opacity = '1';
            document.getElementById('letter-password').focus();
        }, 50);

        // Handle unlock button
        const unlockBtn = document.getElementById('unlock-btn');
        const passwordInput = document.getElementById('letter-password');
        const errorDiv = document.getElementById('password-error');

        const attemptUnlock = () => {
            const password = passwordInput.value.trim();

            if (password === 'ilykiddo') {
                // Correct password - show letter
                gsap.to(passwordOverlay, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        passwordOverlay.remove();
                        this.displayLetter();
                    }
                });
            } else {
                // Wrong password
                errorDiv.textContent = '❌ Incorrect password. Try again!';
                passwordInput.value = '';
                passwordInput.focus();

                // Shake animation
                passwordInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    passwordInput.style.animation = '';
                }, 500);
            }
        };

        unlockBtn.addEventListener('click', attemptUnlock);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                attemptUnlock();
            }
        });

        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Display the letter content after password verification
     */
    displayLetter() {
        const quotes = [
            "Life is the flower for which love is the honey. — Victor Hugo",
            "Love is not just looking at each other, it's looking in the same direction. — Antoine de Saint-Exupéry",
            "The best thing to hold onto in life is each other. — Audrey Hepburn",
            "Life without love is like a tree without blossoms or fruit. — Khalil Gibran"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        const letterOverlay = document.createElement('div');
        letterOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #8b4513, #d4af37, #8b4513);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;

        letterOverlay.innerHTML = `
            <div style="background: #faf0e6; border: 8px solid #d4af37; border-radius: 15px; padding: 60px; max-width: 700px; box-shadow: 0 0 50px rgba(212, 175, 55, 0.7);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-family: 'Brush Script MT', cursive; font-size: 3rem; color: #8b4513; text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);">
                        Royal Letter
                    </div>
                    <div style="font-size: 2rem; color: #d4af37;">💌</div>
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 1.6rem; color: #4a0e0e; line-height: 2; font-style: italic; text-align: center; border-top: 2px solid #d4af37; border-bottom: 2px solid #d4af37; padding: 30px 0;">
                    "${randomQuote.split(' — ')[0]}"
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 1.2rem; color: #8b4513; text-align: right; margin-top: 20px; font-weight: bold;">
                    — ${randomQuote.split(' — ')[1]}
                </div>
                <button class="finish-btn" style="display: block; margin: 40px auto 0; font-family: 'Georgia', serif; font-size: 1.2rem; padding: 15px 40px; background: linear-gradient(135deg, #d4af37, #ffd700); border: 2px solid #8b4513; border-radius: 30px; color: #4a0e0e; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);">
                    Complete Experience
                </button>
            </div>
        `;

        document.body.appendChild(letterOverlay);

        setTimeout(() => {
            letterOverlay.style.opacity = '1';
        }, 50);

        letterOverlay.querySelector('.finish-btn').addEventListener('click', async () => {
            gsap.to(letterOverlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    letterOverlay.remove();
                    this.complete();
                }
            });
        });
    }


    /**
     * Setup interaction handlers
     */
    setupInteraction() {
        this.boundClick = this.onClick.bind(this);
        this.boundMouseMove = this.onMouseMove.bind(this);

        window.addEventListener('click', this.boundClick);
        window.addEventListener('touchend', this.boundClick);
        window.addEventListener('mousemove', this.boundMouseMove);
        window.addEventListener('touchmove', this.boundMouseMove, { passive: false });
    }

    /**
     * Mouse move for hover effects
     */
    onMouseMove(event) {
        if (event.type === 'touchmove') event.preventDefault();

        const clientX = event.clientX || (event.touches?.[0]?.clientX);
        const clientY = event.clientY || (event.touches?.[0]?.clientY);
        if (clientX === undefined) return;

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        // Hover detection
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);

        let targets = [];
        if (this.gamePhase === 'collecting') {
            targets = this.petals.filter(p => !p.userData.isCollected);
        } else if (this.gamePhase === 'boxReveal') {
            targets = [this.box, this.boxLid];
        } else if (this.gamePhase === 'letterReveal') {
            targets = [this.letter, this.seal];
        }

        const intersects = this.raycaster.intersectObjects(targets);
        const cursor = document.getElementById('cursor');

        if (intersects.length > 0) {
            if (cursor) cursor.classList.add('hover');
        } else {
            if (cursor) cursor.classList.remove('hover');
        }
    }

    /**
     * Click handler
     */
    onClick(event) {
        if (this.phase !== 'interactive') return;

        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);

        if (this.gamePhase === 'boxReveal') {
            this.handleBoxClick();
        } else if (this.gamePhase === 'letterReveal') {
            this.handleLetterClick();
        }
    }



    /**
     * Reveal the mystery box
     */
    revealBox() {
        this.gamePhase = 'boxReveal';

        // Show box with animation
        this.box.visible = true;
        this.boxLid.visible = true;
        this.boxEdges.visible = true;

        this.box.scale.set(0, 0, 0);
        this.boxLid.scale.set(0, 0, 0);
        this.boxEdges.scale.set(0, 0, 0);

        gsap.to(this.box.scale, {
            x: 1, y: 1, z: 1,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });

        gsap.to(this.boxLid.scale, {
            x: 1, y: 1, z: 1,
            duration: 1,
            delay: 0.1,
            ease: 'elastic.out(1, 0.5)'
        });

        gsap.to(this.boxEdges.scale, {
            x: 1, y: 1, z: 1,
            duration: 1,
            delay: 0.2,
            ease: 'elastic.out(1, 0.5)'
        });

        // Update instruction
        this.updateInstruction('Click the box to open...');
    }

    /**
     * Handle clicking the box
     */
    handleBoxClick() {
        const intersects = this.raycaster.intersectObjects([this.box, this.boxLid, this.boxEdges]);

        if (intersects.length > 0) {
            this.openBox();
        }
    }

    /**
     * Open the box to reveal contents
     */
    openBox() {
        this.gamePhase = 'letterReveal';

        // Lid opens upward and back
        gsap.to(this.boxLid.rotation, {
            x: -Math.PI * 0.8,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to(this.boxLid.position, {
            y: 0.4,
            z: -0.5,
            duration: 1,
            ease: 'power2.out'
        });

        // Reveal letter and rose
        setTimeout(() => {
            this.letter.visible = true;
            this.seal.visible = true;
            this.revealedRose.visible = true;

            // Animate them rising
            gsap.from(this.letter.position, {
                y: -0.8,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from(this.seal.position, {
                y: -0.8,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from(this.revealedRose.position, {
                y: -0.8,
                duration: 1,
                ease: 'power2.out'
            });

            // Rose rotation
            gsap.to(this.revealedRose.rotation, {
                y: Math.PI * 2,
                duration: 3,
                ease: 'power1.inOut'
            });
        }, 600);

        this.updateInstruction('Click the letter to read...');
    }

    /**
     * Handle clicking the letter
     */
    handleLetterClick() {
        const intersects = this.raycaster.intersectObjects([this.letter, this.seal]);

        if (intersects.length > 0) {
            this.showQuote();
        }
    }

    /**
     * Show the romantic quote overlay
     */
    showQuote() {
        this.gamePhase = 'quoteDisplay';

        // Create overlay
        this.quoteOverlay = document.createElement('div');
        this.quoteOverlay.id = 'quote-overlay';
        this.quoteOverlay.innerHTML = `
            <div class="quote-card">
                <div class="quote-text">"${this.romanticQuote}"</div>
                <div class="quote-author">${this.quoteAuthor}</div>
                <button class="close-btn">✕</button>
            </div>
        `;
        this.quoteOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(18, 12, 24, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s;
        `;
        document.body.appendChild(this.quoteOverlay);

        // Style the card
        const card = this.quoteOverlay.querySelector('.quote-card');
        card.style.cssText = `
            background: linear-gradient(135deg, #2d1b4e, #120c18);
            border: 2px solid #ff00ff;
            border-radius: 20px;
            padding: 40px 50px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 40px rgba(255, 0, 255, 0.3);
            position: relative;
        `;

        const quoteText = this.quoteOverlay.querySelector('.quote-text');
        quoteText.style.cssText = `
            font-family: 'Patrick Hand', cursive;
            font-size: 1.8rem;
            color: #ffffff;
            line-height: 1.6;
            margin-bottom: 20px;
        `;

        const quoteAuthor = this.quoteOverlay.querySelector('.quote-author');
        quoteAuthor.style.cssText = `
            font-family: 'Orbitron', sans-serif;
            font-size: 1rem;
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff;
        `;

        const closeBtn = this.quoteOverlay.querySelector('.close-btn');
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: #ff00ff;
            font-size: 1.5rem;
            cursor: pointer;
        `;

        closeBtn.addEventListener('click', () => {
            this.closeQuoteAndComplete();
        });

        // Fade in
        setTimeout(() => {
            this.quoteOverlay.style.opacity = '1';
        }, 50);
    }

    /**
     * Close quote and complete experience
     */
    async closeQuoteAndComplete() {
        gsap.to(this.quoteOverlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.quoteOverlay.remove();
            }
        });

        this.phase = 'outro';
        await this.complete();
    }

    /**
     * Update instruction text
     */
    updateInstruction(text) {
        const instructionEl = document.querySelector('.experience-instruction');
        if (instructionEl) {
            gsap.to(instructionEl, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    instructionEl.textContent = text;
                    gsap.to(instructionEl, { opacity: 1, duration: 0.3 });
                }
            });
        }
    }

    /**
     * Update loop
     */
    update(delta, elapsed) {
        if (!this.isActive) return;



        // Rotate revealed rose
        if (this.revealedRose && this.revealedRose.visible) {
            this.revealedRose.rotation.y += delta * 0.3;
        }

        // Pulse box glow
        if (this.box && this.box.visible && this.gamePhase === 'boxReveal') {
            const pulse = Math.sin(elapsed * 3) * 0.05 + 0.1;
            this.box.material.emissiveIntensity = pulse;
        }

        // Gentle group rotation
        this.group.rotation.y += delta * 0.03;
    }

    /**
     * Dispose
     */
    dispose() {
        if (this.unsubscribeUpdate) {
            this.unsubscribeUpdate();
        }

        window.removeEventListener('click', this.boundClick);
        window.removeEventListener('touchend', this.boundClick);
        window.removeEventListener('mousemove', this.boundMouseMove);
        window.removeEventListener('touchmove', this.boundMouseMove);

        // Remove button if exists
        if (this.buttonElement && this.buttonElement.parentNode) {
            this.buttonElement.remove();
        }

        // Remove overlay if exists
        if (this.quoteOverlay && this.quoteOverlay.parentNode) {
            this.quoteOverlay.remove();
        }

        super.dispose();
    }
}

export default RoseDay;
