import{p,E as u,M as m,h as c,r as f,f as h,B as y,d as b,k as g,g as w,R as v,V as x}from"./three-BDTjZVi7.js";import{g as C}from"./gsap-C8pce-KX.js";import{B as M}from"./BaseExperience-D8fMzVIG.js";import{C as a}from"./index-yl1ICO7q.js";class R extends M{constructor(i,t,e){super(i,t,e),this.heart=null,this.particles=[]}getInstruction(){return"Click the heart to reveal the message..."}getCompletionMessage(){return"A moment of courage,<br>a lifetime of love."}async init(){this.createFloatingHeart(),this.createRomanticParticles(),this.setupInteraction(),await super.init(),this.unsubscribeUpdate=this.sceneManager.onUpdate(this.update.bind(this))}createFloatingHeart(){const i=new p,t=0,e=0;i.moveTo(t+.5,e+.5),i.bezierCurveTo(t+.5,e+.5,t+.4,e,t,e),i.bezierCurveTo(t-.6,e,t-.6,e+.7,t-.6,e+.7),i.bezierCurveTo(t-.6,e+1.1,t-.3,e+1.54,t+.5,e+1.9),i.bezierCurveTo(t+1.2,e+1.54,t+1.6,e+1.1,t+1.6,e+.7),i.bezierCurveTo(t+1.6,e+.7,t+1.6,e,t+1,e),i.bezierCurveTo(t+.7,e,t+.5,e+.5,t+.5,e+.5);const o={depth:.3,bevelEnabled:!0,bevelSegments:3,steps:2,bevelSize:.05,bevelThickness:.05},r=new u(i,o);r.center();const s=new m({color:a.roseRed,metalness:.3,roughness:.4,emissive:a.roseRed,emissiveIntensity:.5});this.heart=new c(r,s),this.heart.position.set(0,0,0),this.heart.userData.clickable=!0,this.group.add(this.heart);const l=r.clone(),d=new f({color:a.roseRed,transparent:!0,opacity:.3,blending:h}),n=new c(l,d);n.scale.multiplyScalar(1.1),this.heart.add(n)}createRomanticParticles(){const t=new y,e=new Float32Array(50*3);for(let s=0;s<50;s++)e[s*3]=(Math.random()-.5)*10,e[s*3+1]=(Math.random()-.5)*10,e[s*3+2]=(Math.random()-.5)*10;t.setAttribute("position",new b(e,3));const o=new g({color:a.champagneGold,size:.05,transparent:!0,opacity:.6,blending:h}),r=new w(t,o);this.group.add(r),this.particles.push(r)}setupInteraction(){this.raycaster=new v,this.mouse=new x,window.addEventListener("click",this.onHeartClick.bind(this))}onHeartClick(i){if(!this.isActive||this.isCompleted)return;this.mouse.x=i.clientX/window.innerWidth*2-1,this.mouse.y=-(i.clientY/window.innerHeight)*2+1,this.raycaster.setFromCamera(this.mouse,this.sceneManager.camera),this.raycaster.intersectObject(this.heart).length>0&&this.showProposal()}showProposal(){const i=document.createElement("div");i.className="proposal-overlay",i.style.cssText=`
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
        `,i.innerHTML=`
            <div style="
                text-align: center;
                color: #ffffff;
                font-family: 'Patrick Hand', cursive;
                max-width: 600px;
                padding: 40px;
            ">
                <h1 style="
                    font-size: 3rem;
                    color: ${a.roseRed};
                    margin-bottom: 30px;
                    text-shadow: 0 0 20px ${a.roseRed};
                ">Will You Be Mine?</h1>
                <p style="
                    font-size: 1.5rem;
                    line-height: 1.8;
                    margin-bottom: 40px;
                ">
                    In this moment, I ask you to share this journey with me.
                    Every day with you is a gift, and I want to cherish them all.
                </p>
                <button id="accept-btn" style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.3rem;
                    padding: 15px 50px;
                    background: linear-gradient(135deg, #ff00ff, #ff69b4);
                    border: 2px solid #ffffff;
                    border-radius: 50px;
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
                    transition: all 0.3s;
                ">Accept ❤️</button>
            </div>
        `,document.body.appendChild(i),setTimeout(()=>{i.style.opacity="1"},50),i.querySelector("#accept-btn").addEventListener("click",()=>{C.to(i,{opacity:0,duration:1,onComplete:()=>{i.remove(),this.complete()}})})}update(i,t){this.isActive&&(this.heart&&(this.heart.rotation.y+=i*.5,this.heart.position.y=Math.sin(t*2)*.1),this.particles.forEach(e=>{e.rotation.y+=i*.1}))}dispose(){window.removeEventListener("click",this.onHeartClick.bind(this)),this.unsubscribeUpdate&&this.unsubscribeUpdate(),super.dispose()}}export{R as default};
