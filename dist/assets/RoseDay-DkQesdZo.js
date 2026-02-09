import{R as x,V as y,t as p,M as h,h as f,u as g,L as v,v as w,n as z,q as m,w as q,G as k,p as C,E}from"./three-BDTjZVi7.js";import{g as s}from"./gsap-C8pce-KX.js";import{B as L}from"./BaseExperience--1RX-Q25.js";import{C as l}from"./index-DU_j9lSb.js";class I extends L{constructor(e,i,t){super(e,i,t),this.gamePhase="intro",this.currentQuestionIndex=0,this.correctAnswers=0,this.quizQuestions=[{question:"What does a red rose symbolize?",options:["Friendship","Love and Romance","Gratitude","Peace"],correct:1},{question:"Rose Day is celebrated on which date in Valentine's Week?",options:["February 7th","February 10th","February 12th","February 14th"],correct:0},{question:"A dozen roses typically represents what?",options:["Friendship","Be mine","Gratitude","Perfect love"],correct:3}],this.box=null,this.boxLid=null,this.letter=null,this.revealedRose=null,this.raycaster=new x,this.mouse=new y,this.romanticQuote="Life is the flower for which love is the honey.",this.quoteAuthor="— Victor Hugo"}getInstruction(){return`Click "Let's Go" to reveal your surprise...`}getCompletionMessage(){return"A secret unlocked,<br>love revealed in petals."}async init(){this.createLockedBox(),this.createLetsGoButton(),this.setupInteraction(),await super.init(),this.unsubscribeUpdate=this.sceneManager.onUpdate(this.update.bind(this))}createLetsGoButton(){this.buttonElement=document.createElement("div"),this.buttonElement.id="lets-go-button",this.buttonElement.innerHTML=`
            <button class="lets-go-btn">Let's Go</button>
        `,this.buttonElement.style.cssText=`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            opacity: 0;
            transition: opacity 0.5s;
        `;const e=document.createElement("style");e.textContent=`
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
        `,document.head.appendChild(e),document.body.appendChild(this.buttonElement),setTimeout(()=>{this.buttonElement.style.opacity="1"},500),this.buttonElement.querySelector(".lets-go-btn").addEventListener("click",()=>{this.onLetsGoClick()})}createLockedBox(){const e=new p(1.2,.8,1.2),i=new h({color:2956110,metalness:.8,roughness:.2,emissive:l.champagneGold,emissiveIntensity:.05});this.box=new f(e,i),this.box.position.set(0,-.4,0),this.box.visible=!1,this.group.add(this.box);const t=new p(1.3,.15,1.3),o=new h({color:2956110,metalness:.9,roughness:.1,emissive:l.roseRed,emissiveIntensity:.1});this.boxLid=new f(t,o),this.boxLid.position.set(0,.05,0),this.boxLid.visible=!1,this.group.add(this.boxLid);const n=new g(e),r=new v({color:l.champagneGold,linewidth:2});this.boxEdges=new w(n,r),this.boxEdges.position.copy(this.box.position),this.boxEdges.visible=!1,this.group.add(this.boxEdges),this.createLetter(),this.createRevealedRose()}createLetter(){const e=new z(.6,.4),i=new h({color:16774630,metalness:0,roughness:.8,side:m});this.letter=new f(e,i),this.letter.position.set(0,-.3,.3),this.letter.rotation.x=-Math.PI/6,this.letter.visible=!1,this.group.add(this.letter);const t=new q(.08,32),o=new h({color:l.roseRed,emissive:l.roseRed,emissiveIntensity:.3});this.seal=new f(t,o),this.seal.position.set(0,-.3,.31),this.seal.rotation.x=-Math.PI/6,this.seal.visible=!1,this.group.add(this.seal)}createRevealedRose(){this.revealedRose=new k;const e=new C;e.moveTo(0,0),e.quadraticCurveTo(.12,.15,0,.3),e.quadraticCurveTo(-.12,.15,0,0);const i={depth:.01,bevelEnabled:!1},t=new E(e,i);for(let o=0;o<3;o++)for(let n=0;n<5;n++){const r=new h({color:l.roseRed,metalness:.1,roughness:.6,side:m,transparent:!0,opacity:.9}),a=new f(t,r),d=n/5*Math.PI*2+o*.3,c=.08+o*.08;a.position.set(Math.cos(d)*c,o*.05,Math.sin(d)*c),a.rotation.set(Math.PI/4+o*.15,d+Math.PI/2,0),a.scale.setScalar(.8+o*.2),this.revealedRose.add(a)}this.revealedRose.position.set(-.3,-.2,0),this.revealedRose.visible=!1,this.group.add(this.revealedRose)}onLetsGoClick(){s.to(this.buttonElement,{opacity:0,duration:.5,onComplete:()=>{this.buttonElement.remove()}}),setTimeout(()=>this.showQuiz(),500)}showQuiz(){this.gamePhase="quiz",this.currentQuestionIndex=0,this.quizOverlay=document.createElement("div"),this.quizOverlay.id="quiz-overlay",this.quizOverlay.style.cssText=`
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
        `,document.body.appendChild(this.quizOverlay),this.updateQuizDisplay(),setTimeout(()=>{this.quizOverlay.style.opacity="1"},50)}updateQuizDisplay(){const e=this.quizQuestions[this.currentQuestionIndex];this.quizOverlay.innerHTML=`
            <div class="quiz-card">
                <div class="quiz-header">Rose Day Quiz</div>
                <div class="question-number">Question ${this.currentQuestionIndex+1} of ${this.quizQuestions.length}</div>
                <div class="question-text">${e.question}</div>
                <div class="options-container">
                    ${e.options.map((o,n)=>`
                        <button class="option-btn" data-index="${n}">${o}</button>
                    `).join("")}
                </div>
            </div>
        `;const i=document.createElement("style");i.textContent=`
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
        `,document.head.appendChild(i),this.quizOverlay.querySelectorAll(".option-btn").forEach(o=>{o.addEventListener("click",n=>this.handleQuizAnswer(n))})}handleQuizAnswer(e){const i=parseInt(e.target.dataset.index),t=this.quizQuestions[this.currentQuestionIndex];i===t.correct?(this.correctAnswers++,e.target.classList.add("correct")):(e.target.classList.add("wrong"),this.quizOverlay.querySelector(`[data-index="${t.correct}"]`).classList.add("correct")),this.quizOverlay.querySelectorAll(".option-btn").forEach(r=>r.disabled=!0),setTimeout(()=>{this.currentQuestionIndex++,this.currentQuestionIndex<this.quizQuestions.length?this.updateQuizDisplay():this.finishQuiz()},1500)}finishQuiz(){this.correctAnswers>=2?s.to(this.quizOverlay,{opacity:0,duration:.5,onComplete:()=>{this.quizOverlay.remove(),this.showCelebration()}}):(this.quizOverlay.innerHTML=`
                <div class="quiz-card">
                    <div class="quiz-header" style="color: #ff0000;">Try Again!</div>
                    <div class="question-text">You got ${this.correctAnswers} out of ${this.quizQuestions.length} correct.</div>
                    <div class="question-text">You need at least 2 correct answers.</div>
                    <button class="option-btn" id="retry-btn">Retry Quiz</button>
                </div>
            `,document.getElementById("retry-btn").addEventListener("click",()=>{this.currentQuestionIndex=0,this.correctAnswers=0,this.updateQuizDisplay()}))}showCelebration(){this.gamePhase="celebration",this.celebrationOverlay=document.createElement("div"),this.celebrationOverlay.id="celebration-overlay",this.celebrationOverlay.style.cssText=`
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
        `,this.celebrationOverlay.innerHTML=`
            <div class="congrats-text">🎉 Congratulations! 🎉</div>
            <div class="congrats-subtext">You passed the Rose Day Quiz!</div>
            <button class="open-box-btn">Open Your Gift</button>
        `,document.body.appendChild(this.celebrationOverlay);const e=document.createElement("style");e.textContent=`
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
        `,document.head.appendChild(e),setTimeout(()=>{this.celebrationOverlay.style.opacity="1",this.createConfetti()},50),this.celebrationOverlay.querySelector(".open-box-btn").addEventListener("click",()=>{this.hideCelebration()})}createConfetti(){for(let t=0;t<100;t++)setTimeout(()=>{const o=document.createElement("div");o.className="confetti",o.style.cssText=`
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${t%3===0?"#FFB6C1":t%3===1?"#FF69B4":"#FFC0CB"};
                    left: ${Math.random()*100}%;
                    top: -10px;
                    opacity: ${.5+Math.random()*.5};
                    border-radius: ${Math.random()>.5?"50%":"0"};
                    animation: confetti-fall ${3+Math.random()*3}s linear forwards;
                    z-index: 1001;
                `,this.celebrationOverlay.appendChild(o),setTimeout(()=>o.remove(),6e3)},t*50);const i=document.createElement("style");i.textContent=`
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(${Math.random()*720}deg);
                }
            }
        `,document.head.appendChild(i)}hideCelebration(){s.to(this.celebrationOverlay,{opacity:0,duration:.5,onComplete:()=>{this.celebrationOverlay.remove(),this.showGiftBox()}})}showGiftBox(){this.gamePhase="giftChoice",this.giftOverlay=document.createElement("div"),this.giftOverlay.id="gift-overlay",this.giftOverlay.style.cssText=`
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
        `,this.giftOverlay.innerHTML=`
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
        `,document.body.appendChild(this.giftOverlay);const e=document.createElement("style");e.textContent=`
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
        `,document.head.appendChild(e),setTimeout(()=>{this.giftOverlay.style.opacity="1"},50),this.giftOverlay.querySelectorAll(".pick-btn").forEach(i=>{i.addEventListener("click",t=>{const o=t.target.dataset.gift;this.handleGiftSelection(o)})})}handleGiftSelection(e){s.to(this.giftOverlay,{opacity:0,duration:.5,onComplete:()=>{this.giftOverlay.remove(),e==="rose"?this.showRoseWish():this.showLetter()}})}showRoseWish(){this.gamePhase="ending";const e=document.createElement("div");e.style.cssText=`
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
        `,e.innerHTML=`
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
        `,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="1"},50),e.querySelector(".finish-btn").addEventListener("click",async()=>{s.to(e,{opacity:0,duration:.5,onComplete:()=>{e.remove(),this.complete()}})})}showLetter(){this.gamePhase="ending";const e=document.createElement("div");e.style.cssText=`
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
        `,e.innerHTML=`
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
        `,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="1",document.getElementById("letter-password").focus()},50);const i=document.getElementById("unlock-btn"),t=document.getElementById("letter-password"),o=document.getElementById("password-error"),n=()=>{t.value.trim()==="ilykiddo"?s.to(e,{opacity:0,duration:.5,onComplete:()=>{e.remove(),this.displayLetter()}}):(o.textContent="❌ Incorrect password. Try again!",t.value="",t.focus(),t.style.animation="shake 0.5s",setTimeout(()=>{t.style.animation=""},500))};i.addEventListener("click",n),t.addEventListener("keypress",a=>{a.key==="Enter"&&n()});const r=document.createElement("style");r.textContent=`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `,document.head.appendChild(r)}displayLetter(){const e=["Life is the flower for which love is the honey. — Victor Hugo","Love is not just looking at each other, it's looking in the same direction. — Antoine de Saint-Exupéry","The best thing to hold onto in life is each other. — Audrey Hepburn","Life without love is like a tree without blossoms or fruit. — Khalil Gibran"],i=e[Math.floor(Math.random()*e.length)],t=document.createElement("div");t.style.cssText=`
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
        `,t.innerHTML=`
            <div style="background: #faf0e6; border: 8px solid #d4af37; border-radius: 15px; padding: 60px; max-width: 700px; box-shadow: 0 0 50px rgba(212, 175, 55, 0.7);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-family: 'Brush Script MT', cursive; font-size: 3rem; color: #8b4513; text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);">
                        Royal Letter
                    </div>
                    <div style="font-size: 2rem; color: #d4af37;">💌</div>
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 1.6rem; color: #4a0e0e; line-height: 2; font-style: italic; text-align: center; border-top: 2px solid #d4af37; border-bottom: 2px solid #d4af37; padding: 30px 0;">
                    "${i.split(" — ")[0]}"
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 1.2rem; color: #8b4513; text-align: right; margin-top: 20px; font-weight: bold;">
                    — ${i.split(" — ")[1]}
                </div>
                <button class="finish-btn" style="display: block; margin: 40px auto 0; font-family: 'Georgia', serif; font-size: 1.2rem; padding: 15px 40px; background: linear-gradient(135deg, #d4af37, #ffd700); border: 2px solid #8b4513; border-radius: 30px; color: #4a0e0e; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);">
                    Complete Experience
                </button>
            </div>
        `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="1"},50),t.querySelector(".finish-btn").addEventListener("click",async()=>{s.to(t,{opacity:0,duration:.5,onComplete:()=>{t.remove(),this.complete()}})})}setupInteraction(){this.boundClick=this.onClick.bind(this),this.boundMouseMove=this.onMouseMove.bind(this),window.addEventListener("click",this.boundClick),window.addEventListener("touchend",this.boundClick),window.addEventListener("mousemove",this.boundMouseMove),window.addEventListener("touchmove",this.boundMouseMove,{passive:!1})}onMouseMove(e){var a,d,c,u;e.type==="touchmove"&&e.preventDefault();const i=e.clientX||((d=(a=e.touches)==null?void 0:a[0])==null?void 0:d.clientX),t=e.clientY||((u=(c=e.touches)==null?void 0:c[0])==null?void 0:u.clientY);if(i===void 0)return;this.mouse.x=i/window.innerWidth*2-1,this.mouse.y=-(t/window.innerHeight)*2+1,this.raycaster.setFromCamera(this.mouse,this.sceneManager.camera);let o=[];this.gamePhase==="collecting"?o=this.petals.filter(b=>!b.userData.isCollected):this.gamePhase==="boxReveal"?o=[this.box,this.boxLid]:this.gamePhase==="letterReveal"&&(o=[this.letter,this.seal]);const n=this.raycaster.intersectObjects(o),r=document.getElementById("cursor");n.length>0?r&&r.classList.add("hover"):r&&r.classList.remove("hover")}onClick(e){this.phase==="interactive"&&(this.raycaster.setFromCamera(this.mouse,this.sceneManager.camera),this.gamePhase==="boxReveal"?this.handleBoxClick():this.gamePhase==="letterReveal"&&this.handleLetterClick())}revealBox(){this.gamePhase="boxReveal",this.box.visible=!0,this.boxLid.visible=!0,this.boxEdges.visible=!0,this.box.scale.set(0,0,0),this.boxLid.scale.set(0,0,0),this.boxEdges.scale.set(0,0,0),s.to(this.box.scale,{x:1,y:1,z:1,duration:1,ease:"elastic.out(1, 0.5)"}),s.to(this.boxLid.scale,{x:1,y:1,z:1,duration:1,delay:.1,ease:"elastic.out(1, 0.5)"}),s.to(this.boxEdges.scale,{x:1,y:1,z:1,duration:1,delay:.2,ease:"elastic.out(1, 0.5)"}),this.updateInstruction("Click the box to open...")}handleBoxClick(){this.raycaster.intersectObjects([this.box,this.boxLid,this.boxEdges]).length>0&&this.openBox()}openBox(){this.gamePhase="letterReveal",s.to(this.boxLid.rotation,{x:-Math.PI*.8,duration:1,ease:"power2.out"}),s.to(this.boxLid.position,{y:.4,z:-.5,duration:1,ease:"power2.out"}),setTimeout(()=>{this.letter.visible=!0,this.seal.visible=!0,this.revealedRose.visible=!0,s.from(this.letter.position,{y:-.8,duration:.8,ease:"power2.out"}),s.from(this.seal.position,{y:-.8,duration:.8,ease:"power2.out"}),s.from(this.revealedRose.position,{y:-.8,duration:1,ease:"power2.out"}),s.to(this.revealedRose.rotation,{y:Math.PI*2,duration:3,ease:"power1.inOut"})},600),this.updateInstruction("Click the letter to read...")}handleLetterClick(){this.raycaster.intersectObjects([this.letter,this.seal]).length>0&&this.showQuote()}showQuote(){this.gamePhase="quoteDisplay",this.quoteOverlay=document.createElement("div"),this.quoteOverlay.id="quote-overlay",this.quoteOverlay.innerHTML=`
            <div class="quote-card">
                <div class="quote-text">"${this.romanticQuote}"</div>
                <div class="quote-author">${this.quoteAuthor}</div>
                <button class="close-btn">✕</button>
            </div>
        `,this.quoteOverlay.style.cssText=`
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
        `,document.body.appendChild(this.quoteOverlay);const e=this.quoteOverlay.querySelector(".quote-card");e.style.cssText=`
            background: linear-gradient(135deg, #2d1b4e, #120c18);
            border: 2px solid #ff00ff;
            border-radius: 20px;
            padding: 40px 50px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 40px rgba(255, 0, 255, 0.3);
            position: relative;
        `;const i=this.quoteOverlay.querySelector(".quote-text");i.style.cssText=`
            font-family: 'Patrick Hand', cursive;
            font-size: 1.8rem;
            color: #ffffff;
            line-height: 1.6;
            margin-bottom: 20px;
        `;const t=this.quoteOverlay.querySelector(".quote-author");t.style.cssText=`
            font-family: 'Orbitron', sans-serif;
            font-size: 1rem;
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff;
        `;const o=this.quoteOverlay.querySelector(".close-btn");o.style.cssText=`
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: #ff00ff;
            font-size: 1.5rem;
            cursor: pointer;
        `,o.addEventListener("click",()=>{this.closeQuoteAndComplete()}),setTimeout(()=>{this.quoteOverlay.style.opacity="1"},50)}async closeQuoteAndComplete(){s.to(this.quoteOverlay,{opacity:0,duration:.5,onComplete:()=>{this.quoteOverlay.remove()}}),this.phase="outro",await this.complete()}updateInstruction(e){const i=document.querySelector(".experience-instruction");i&&s.to(i,{opacity:0,duration:.3,onComplete:()=>{i.textContent=e,s.to(i,{opacity:1,duration:.3})}})}update(e,i){if(this.isActive){if(this.revealedRose&&this.revealedRose.visible&&(this.revealedRose.rotation.y+=e*.3),this.box&&this.box.visible&&this.gamePhase==="boxReveal"){const t=Math.sin(i*3)*.05+.1;this.box.material.emissiveIntensity=t}this.group.rotation.y+=e*.03}}dispose(){this.unsubscribeUpdate&&this.unsubscribeUpdate(),window.removeEventListener("click",this.boundClick),window.removeEventListener("touchend",this.boundClick),window.removeEventListener("mousemove",this.boundMouseMove),window.removeEventListener("touchmove",this.boundMouseMove),this.buttonElement&&this.buttonElement.parentNode&&this.buttonElement.remove(),this.quoteOverlay&&this.quoteOverlay.parentNode&&this.quoteOverlay.remove(),super.dispose()}}export{I as default};
