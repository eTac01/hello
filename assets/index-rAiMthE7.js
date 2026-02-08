const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/RoseDay-BERosexM.js","assets/three-BDTjZVi7.js","assets/gsap-C8pce-KX.js","assets/BaseExperience-D4L0-Qjp.js","assets/ProposeDay-CMo3uKu4.js","assets/ChocolateDay-BBZzdCTZ.js","assets/TeddyDay-Bp1KOM4R.js","assets/PromiseDay-Co1QPMzL.js","assets/HugDay-Dl9QtOjs.js","assets/KissDay-CY7fX3WD.js","assets/ValentineDay-gBns3Caw.js"])))=>i.map(i=>d[i]);
import{C as j,V as v,S as B,a as w,F as R,P as G,W as N,b as O,A as F,c as A,B as E,d as f,e as C,f as y,g as P,D as V,M as H,h as x,G as z,i as W,j as U,k as q,l as D,R as X,m as Y,n as $,o as S,p as Z,E as K,q as Q,T as J,r as ee,L as te,s as ie}from"./three-BDTjZVi7.js";import{g as l}from"./gsap-C8pce-KX.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const se="modulepreload",oe=function(d){return"/hello/"+d},L={},g=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),n=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(t.map(r=>{if(r=oe(r),r in L)return;L[r]=!0;const p=r.endsWith(".css"),b=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${b}`))return;const h=document.createElement("link");if(h.rel=p?"stylesheet":se,p||(h.as="script"),h.crossOrigin="",h.href=r,n&&h.setAttribute("nonce",n),document.head.appendChild(h),p)return new Promise((M,T)=>{h.addEventListener("load",M),h.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${r}`)))})}))}function o(a){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=a,window.dispatchEvent(n),!n.defaultPrevented)throw a}return s.then(a=>{for(const n of a||[])n.status==="rejected"&&o(n.reason);return e().catch(o)})},c={charcoal:1182744,roseRed:16711935,champagneGold:65535,deepPurple:2956110},u=[{date:"2026-02-07",day:"Rose Day",theme:"Admiration",emoji:"🌹",animatedEmoji:"https://fonts.gstatic.com/s/e/notoemoji/latest/1f339/512.gif",index:0,experience:"RoseDay",url:"rose-day.html"},{date:"2026-02-08",day:"Propose Day",theme:"Confession",emoji:"💍",animatedEmoji:"https://fonts.gstatic.com/s/e/notoemoji/latest/1f48d/512.gif",index:1,experience:"ProposeDay",url:"propose-day.html"},{date:"2026-02-09",day:"Chocolate Day",theme:"Sweetness",emoji:"🍫",animatedEmoji:"emoji/chocoletday.webp",index:2,experience:"ChocolateDay",url:"chocolate-day.html"},{date:"2026-02-10",day:"Teddy Day",theme:"Comfort",emoji:"🧸",animatedEmoji:"emoji/teddyday.webp",index:3,experience:"TeddyDay",url:"teddy-day.html"},{date:"2026-02-11",day:"Promise Day",theme:"Trust",emoji:"🤝",animatedEmoji:"https://fonts.gstatic.com/s/e/notoemoji/latest/1f91d/512.gif",index:4,experience:"PromiseDay",url:"promise-day.html"},{date:"2026-02-12",day:"Hug Day",theme:"Warmth",emoji:"🤗",animatedEmoji:"emoji/bear-hug.webp",index:5,experience:"HugDay",url:"hug-day.html"},{date:"2026-02-13",day:"Kiss Day",theme:"Intimacy",emoji:"💋",animatedEmoji:"emoji/kissday.webp",index:6,experience:"KissDay",url:"kiss-day.html"},{date:"2026-02-14",day:"Valentine's Day",theme:"Union",emoji:"❤️",animatedEmoji:"https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/512.gif",index:7,experience:"ValentineDay",url:"valentine-day.html"}],ae=u.map((d,e)=>{const t=e/8*Math.PI*2-Math.PI/2,i=4;return{x:Math.cos(t)*i,y:0,z:Math.sin(t)*i,angle:t}}),ne={capsuleRotationSpeed:2e-4},I={high:{particleCount:1e3,shadowMapSize:2048,antialias:!0,postProcessing:!0},medium:{particleCount:500,shadowMapSize:1024,antialias:!0,postProcessing:!0},low:{particleCount:200,shadowMapSize:512,antialias:!1,postProcessing:!1}};class re{constructor(e){this.container=e,this.width=window.innerWidth,this.height=window.innerHeight,this.qualityTier=this.detectQualityTier(),this.isRunning=!1,this.clock=new j,this.callbacks=[],this.mouse=new v,this.targetMouse=new v,this.mouseVelocity=new v,this.lastMouse=new v,this.init()}detectQualityTier(){const e="ontouchstart"in window||navigator.maxTouchPoints>0,t=document.createElement("canvas"),i=t.getContext("webgl2")||t.getContext("webgl");if(!i)return"low";const s=i.getExtension("WEBGL_debug_renderer_info");if(s){const o=i.getParameter(s.UNMASKED_RENDERER_WEBGL);if(console.log("[SceneManager] GPU:",o),o.includes("Mali")||o.includes("Adreno")||o.includes("PowerVR"))return"low";if(o.includes("Intel"))return e?"low":"medium"}if(navigator.deviceMemory){if(navigator.deviceMemory<4)return"low";if(navigator.deviceMemory<8)return"medium"}return e?"medium":"high"}init(){const e=I[this.qualityTier];this.scene=new B,this.scene.background=new w(c.charcoal),this.scene.fog=new R(c.charcoal,.08),this.camera=new G(60,this.width/this.height,.1,100),this.camera.position.set(0,2,8),this.camera.lookAt(0,0,0),this.renderer=new N({antialias:e.antialias,alpha:!1,powerPreference:"high-performance"}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=O,this.renderer.toneMapping=F,this.renderer.toneMappingExposure=1.2,this.container.appendChild(this.renderer.domElement);const t=new A(16777215,.1);this.scene.add(t),this.createAmbientParticles(),this.setupEventListeners()}createAmbientParticles(){const t=I[this.qualityTier].particleCount,i=new E,s=new Float32Array(t*3),o=new Float32Array(t),a=new Float32Array(t);for(let r=0;r<t;r++)s[r*3]=(Math.random()-.5)*30,s[r*3+1]=(Math.random()-.5)*20,s[r*3+2]=(Math.random()-.5)*30,o[r]=Math.random()*2+.5,a[r]=Math.random()*.5+.1;i.setAttribute("position",new f(s,3)),i.setAttribute("size",new f(o,1)),i.setAttribute("alpha",new f(a,1));const n=new C({uniforms:{uTime:{value:0},uColor:{value:new w(c.champagneGold)},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:`
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
      `,fragmentShader:`
        varying float vAlpha;
        uniform vec3 uColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,transparent:!0,depthWrite:!1,blending:y});this.ambientParticles=new P(i,n),this.scene.add(this.ambientParticles)}setupEventListeners(){window.addEventListener("resize",this.onResize.bind(this)),window.addEventListener("orientationchange",this.onResize.bind(this)),window.addEventListener("mousemove",this.onMouseMove.bind(this)),window.addEventListener("touchstart",this.onTouchStart.bind(this),{passive:!1}),window.addEventListener("touchmove",this.onTouchMove.bind(this),{passive:!1}),window.addEventListener("touchend",this.onTouchEnd.bind(this),{passive:!1})}onResize(){this.width=window.innerWidth,this.height=window.innerHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height)}onMouseMove(e){this.targetMouse.x=e.clientX/this.width*2-1,this.targetMouse.y=-(e.clientY/this.height)*2+1;const t=document.getElementById("cursor");t&&(t.style.left=e.clientX+"px",t.style.top=e.clientY+"px")}onTouchStart(e){if(e.touches.length>0){const t=e.touches[0];this.updateTouchPosition(t);const i=new MouseEvent("mousedown",{clientX:t.clientX,clientY:t.clientY,bubbles:!0});e.target.dispatchEvent(i)}}onTouchMove(e){if(e.touches.length>0){const t=e.touches[0];this.updateTouchPosition(t);const i=new MouseEvent("mousemove",{clientX:t.clientX,clientY:t.clientY,bubbles:!0});e.target.dispatchEvent(i)}}onTouchEnd(e){const t=new MouseEvent("mouseup",{bubbles:!0});e.target.dispatchEvent(t)}updateTouchPosition(e){this.targetMouse.x=e.clientX/this.width*2-1,this.targetMouse.y=-(e.clientY/this.height)*2+1;const t=document.getElementById("cursor");t&&(t.style.opacity="0")}onUpdate(e){return this.callbacks.push(e),()=>{const t=this.callbacks.indexOf(e);t>-1&&this.callbacks.splice(t,1)}}animateCameraTo(e,t,i=1.5){return new Promise(s=>{l.to(this.camera.position,{x:e.x,y:e.y,z:e.z,duration:i,ease:"power3.inOut",onUpdate:()=>{t&&this.camera.lookAt(t.x,t.y,t.z)},onComplete:s})})}render(){if(!this.isRunning)return;const e=this.clock.getDelta(),t=this.clock.getElapsedTime();this.mouseVelocity.x=this.targetMouse.x-this.mouse.x,this.mouseVelocity.y=this.targetMouse.y-this.mouse.y,this.mouse.x+=this.mouseVelocity.x*.1,this.mouse.y+=this.mouseVelocity.y*.1,this.ambientParticles&&(this.ambientParticles.material.uniforms.uTime.value=t,this.ambientParticles.rotation.y+=1e-4),this.camera.position.x+=(this.mouse.x*.5-this.camera.position.x)*.02,this.camera.position.y+=(this.mouse.y*.3+2-this.camera.position.y)*.02,this.callbacks.forEach(i=>i(e,t)),this.renderer.render(this.scene,this.camera),requestAnimationFrame(this.render.bind(this))}start(){this.isRunning=!0,this.clock.start(),this.render()}stop(){this.isRunning=!1,this.clock.stop()}dispose(){this.stop(),this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),this.renderer.dispose(),this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)}}class le{constructor(){this.currentDate=null,this.activeDay=null,this.isManipulated=!1,this.onManipulationDetected=null,this.lastCheck=performance.now(),this.visitedToday=!1,this.init()}async init(){await this.validateTime(),this.startMonitoring(),this.checkVisitStatus()}getUTCDateString(e=new Date){return e.toISOString().split("T")[0]}async validateTime(){const e=new Date,t=this.getUTCDateString(e);let i=null,s=null;try{const o=await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC",{cache:"no-store"});if(o.ok){const a=await o.json();i=new Date(a.utc_datetime),s=this.getUTCDateString(i);const n=Math.abs(e-i);if(n>12e4){console.warn("[TimeGatekeeper] Time drift detected:",n,"ms"),this.triggerManipulationWarning("drift");return}}}catch{console.log("[TimeGatekeeper] External time check unavailable, using local time")}this.currentDate=s||t,this.activeDay=this.getActiveDay()}getActiveDay(){return u.find(e=>e.date===this.currentDate)||null}getCapsuleState(e){const t=u[e];if(!t)return"locked";const i=new Date(t.date+"T00:00:00Z"),s=new Date(this.currentDate+"T00:00:00Z");return i.getTime()===s.getTime()?"active":i<s?"past":"future"}canEnterExperience(e){return this.getCapsuleState(e)==="active"}markExperienceVisited(e){const t=`valentine_visited_${u[e].date}`;localStorage.setItem(t,Date.now().toString()),this.visitedToday=!0}checkVisitStatus(){if(!this.activeDay)return;const e=`valentine_visited_${this.activeDay.date}`;this.visitedToday=!!localStorage.getItem(e)}startMonitoring(){setInterval(()=>{const e=performance.now(),t=e-this.lastCheck;(t<0||t>6e4)&&this.triggerManipulationWarning("performance"),this.lastCheck=e},1e4),setInterval(()=>{this.validateTime()},6e4)}triggerManipulationWarning(e){console.warn("[TimeGatekeeper] Manipulation detected:",e),this.isManipulated=!0,this.onManipulationDetected&&this.onManipulationDetected(e)}getTimeUntilMidnight(){const e=new Date,t=new Date(e);return t.setUTCHours(24,0,0,0),t-e}formatCountdown(){const e=this.getTimeUntilMidnight(),t=Math.floor(e/(1e3*60*60)),i=Math.floor(e%(1e3*60*60)/(1e3*60)),s=Math.floor(e%(1e3*60)/1e3);return{hours:t.toString().padStart(2,"0"),minutes:i.toString().padStart(2,"0"),seconds:s.toString().padStart(2,"0"),formatted:`${t.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`}}isWithinValentineWeek(){if(!this.currentDate)return!1;const e=new Date(this.currentDate),t=new Date("2026-02-07"),i=new Date("2026-02-14");return e>=t&&e<=i}getDaysStatus(){return u.map((e,t)=>({...e,state:this.getCapsuleState(t),canEnter:this.canEnterExperience(t)}))}}const m=new le;class ce{constructor(){this.cursor=document.getElementById("cursor"),this.cursor||(this.cursor=document.createElement("div"),this.cursor.id="cursor",document.body.appendChild(this.cursor)),this.mouse={x:window.innerWidth/2,y:window.innerHeight/2},this.pos={x:window.innerWidth/2,y:window.innerHeight/2},this.speed=.15,this.init()}init(){document.addEventListener("mousemove",e=>{this.mouse.x=e.clientX,this.mouse.y=e.clientY}),document.addEventListener("mousedown",()=>this.cursor.classList.add("active")),document.addEventListener("mouseup",()=>this.cursor.classList.remove("active")),this.setupHoverListeners(),this.render()}setupHoverListeners(){const e=i=>{(i.target.tagName==="BUTTON"||i.target.tagName==="A"||i.target.closest(".interactive")||i.target.closest(".capsule-container")||i.target.closest(".clickable"))&&this.cursor.classList.add("hover")},t=i=>{(i.target.tagName==="BUTTON"||i.target.tagName==="A"||i.target.closest(".interactive")||i.target.closest(".capsule-container")||i.target.closest(".clickable"))&&this.cursor.classList.remove("hover")};document.addEventListener("mouseover",e),document.addEventListener("mouseout",t)}render(){this.pos.x+=(this.mouse.x-this.pos.x)*this.speed,this.pos.y+=(this.mouse.y-this.pos.y)*this.speed,this.cursor.style.transform=`translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`,requestAnimationFrame(()=>this.render())}}const he=(d,e=1)=>(Math.sin(d*Math.PI*2)*.5+.5)*e;class de{constructor(e,t){this.dayIndex=e,this.sceneManager=t,this.dayData=u[e],this.position=ae[e],this.state="future",this.isHovered=!1,this.mesh=null,this.glowMesh=null,this.particles=null,this.create()}create(){const e=new V(.4,1);this.material=new H({color:c.champagneGold,metalness:.9,roughness:.1,emissive:c.champagneGold,emissiveIntensity:.2,transparent:!0,opacity:0}),this.mesh=new x(e,this.material),this.mesh.position.set(this.position.x,this.position.y,this.position.z),this.mesh.userData={dayIndex:this.dayIndex,type:"capsule"},this.createGlow(),this.createInnerParticles(),this.createEmojiLabel(),this.createButton(),this.group=new z,this.group.add(this.mesh),this.group.add(this.glowMesh),this.group.add(this.particles),this.sceneManager.scene.add(this.group)}createGlow(){const e=new W(.6,16,16),t=new C({uniforms:{uColor:{value:new w(c.roseRed)},uIntensity:{value:0},uTime:{value:0}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
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
      `,transparent:!0,side:U,depthWrite:!1,blending:y});this.glowMesh=new x(e,t),this.glowMesh.position.copy(this.mesh.position)}createInnerParticles(){const t=new E,i=new Float32Array(30*3);for(let o=0;o<30;o++){const a=Math.random()*Math.PI*2,n=Math.random()*Math.PI,r=.15+Math.random()*.15;i[o*3]=this.position.x+r*Math.sin(n)*Math.cos(a),i[o*3+1]=this.position.y+r*Math.sin(n)*Math.sin(a),i[o*3+2]=this.position.z+r*Math.cos(n)}t.setAttribute("position",new f(i,3));const s=new q({color:c.champagneGold,size:.02,transparent:!0,opacity:0,blending:y,depthWrite:!1});this.particles=new P(t,s)}createEmojiLabel(){const e=document.createElement("div");e.className="capsule-emoji";const t=document.createElement("img");t.src=this.dayData.animatedEmoji||this.dayData.emoji,t.alt=this.dayData.emoji,t.style.cssText=`
            width: 80px;
            height: 80px;
            object-fit: contain;
        `,e.appendChild(t),e.style.cssText=`
            user-select: none;
            pointer-events: auto;
            cursor: pointer;
            filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.9));
            z-index: 10;
            transition: transform 0.3s ease, filter 0.3s ease;
            animation: floatEmoji 3s ease-in-out infinite;
            animation-delay: ${this.dayIndex*.2}s;
        `,e.addEventListener("mouseenter",()=>{e.style.transform="translate(-50%, -50%) scale(1.2)",e.style.filter="drop-shadow(0 0 25px rgba(255, 0, 255, 0.9))"}),e.addEventListener("mouseleave",()=>{e.style.transform="translate(-50%, -50%) scale(1)",e.style.filter="drop-shadow(0 0 15px rgba(0, 0, 0, 0.9))"}),e.addEventListener("click",i=>{i.stopPropagation(),console.log("Emoji clicked for day:",this.dayIndex,this.dayData.day);const s=this.dayData.url;s?(console.log("Navigating to:",s),window.location.href=s):console.warn("No URL defined for:",this.dayData.day)}),this.emojiElement=e,document.getElementById("ui-overlay").appendChild(this.emojiElement),console.log("Emoji created for day:",this.dayIndex,this.dayData.day)}updateEmojiPosition(e){if(!this.emojiElement)return;const t=new D(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);t.project(e);const i=(t.x*.5+.5)*window.innerWidth,s=(t.y*-.5+.5)*window.innerHeight;this.emojiElement.style.position="fixed",this.emojiElement.style.left=`${i}px`,this.emojiElement.style.top=`${s}px`,this.emojiElement.style.transform="translate(-50%, -50%)",this.emojiElement.style.opacity=t.z<1?"1":"0"}createButton(){const e=document.createElement("button");e.className="capsule-button",e.innerHTML="Let's Go",e.style.cssText=`
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
        `,e.addEventListener("mouseenter",()=>{e.style.background="linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3))",e.style.borderColor="#ff00ff",e.style.color="#ff00ff",e.style.transform="translateX(-50%) scale(1.1)",e.style.boxShadow="0 0 25px rgba(255, 0, 255, 0.6)"}),e.addEventListener("mouseleave",()=>{e.style.background="linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))",e.style.borderColor="#00ffff",e.style.color="#00ffff",e.style.transform="translateX(-50%) scale(1)",e.style.boxShadow="0 0 15px rgba(0, 255, 255, 0.3)"}),e.addEventListener("click",t=>{t.stopPropagation(),console.log("Button clicked for day:",this.dayIndex),window.enterCapsuleExperience&&window.enterCapsuleExperience(this.dayIndex)}),this.buttonElement=e,document.getElementById("ui-overlay").appendChild(this.buttonElement),console.log("Button created for day:",this.dayIndex,this.dayData.day)}updateButtonPosition(e){if(!this.buttonElement)return;const t=new D(this.mesh.position.x,this.mesh.position.y-.8,this.mesh.position.z);t.project(e);const i=(t.x*.5+.5)*window.innerWidth,s=(t.y*-.5+.5)*window.innerHeight;this.buttonElement.style.left=`${i}px`,this.buttonElement.style.top=`${s}px`,this.buttonElement.style.transform="translateX(-50%)";const o=t.z<1&&this.state==="active";this.buttonElement.style.opacity=o?"1":"0",this.buttonElement.style.pointerEvents=o?"auto":"none"}setState(e){this.state!==e&&(this.state=e,this.updateVisuals())}updateVisuals(){switch(this.state){case"active":this.setActiveState();break;case"past":this.setPastState();break;case"future":this.setFutureState();break}}setActiveState(){l.to(this.material,{metalness:.4,roughness:.3,opacity:1,duration:1,ease:"power2.out"}),l.to(this.material.color,{r:.9,g:.76,b:.49,duration:1}),l.to(this.glowMesh.material.uniforms.uIntensity,{value:.8,duration:1}),l.to(this.particles.material,{opacity:.8,duration:1})}setPastState(){l.to(this.material,{metalness:.1,roughness:.9,opacity:.3,duration:1,ease:"power2.out"}),l.to(this.material.color,{r:.3,g:.3,b:.3,duration:1}),l.to(this.glowMesh.material.uniforms.uIntensity,{value:0,duration:1}),l.to(this.particles.material,{opacity:.1,duration:1})}setFutureState(){l.to(this.material,{metalness:.2,roughness:.8,opacity:.4,duration:1,ease:"power2.out"}),l.to(this.material.color,{r:.4,g:.4,b:.45,duration:1}),l.to(this.glowMesh.material.uniforms.uIntensity,{value:.15,duration:1}),l.to(this.particles.material,{opacity:.2,duration:1})}onHover(){if(this.isHovered||this.state!=="active")return;this.isHovered=!0,l.to(this.mesh.scale,{x:1.15,y:1.15,z:1.15,duration:.4,ease:"back.out(2)"}),l.to(this.glowMesh.material.uniforms.uIntensity,{value:1.2,duration:.4});const e=document.getElementById("cursor");e&&e.classList.add("hover")}onHoverExit(){if(!this.isHovered)return;this.isHovered=!1,l.to(this.mesh.scale,{x:1,y:1,z:1,duration:.4,ease:"power2.out"}),this.state==="active"&&l.to(this.glowMesh.material.uniforms.uIntensity,{value:.8,duration:.4});const e=document.getElementById("cursor");e&&e.classList.remove("hover")}update(e,t){if(this.updateEmojiPosition(this.sceneManager.camera),this.updateButtonPosition(this.sceneManager.camera),this.glowMesh&&this.glowMesh.material.uniforms&&(this.glowMesh.material.uniforms.uTime.value=t),this.state==="active"){const i=he(t,.08);this.mesh.scale.setScalar(1+i)}if(this.mesh.rotation.y+=e*.2,this.mesh.rotation.x+=e*.1,this.particles){const i=this.particles.geometry.attributes.position.array;for(let s=0;s<i.length;s+=3)i[s+1]+=Math.sin(t+s)*.001;this.particles.geometry.attributes.position.needsUpdate=!0}}onClick(){return this.state==="active"?{action:"enter",dayIndex:this.dayIndex}:this.state==="past"?{action:"showPastMessage",dayIndex:this.dayIndex}:{action:"showFutureMessage",dayIndex:this.dayIndex}}dispose(){this.emojiElement&&this.emojiElement.parentNode&&this.emojiElement.parentNode.removeChild(this.emojiElement),this.buttonElement&&this.buttonElement.parentNode&&this.buttonElement.parentNode.removeChild(this.buttonElement),this.mesh.geometry.dispose(),this.material.dispose(),this.glowMesh.geometry.dispose(),this.glowMesh.material.dispose(),this.particles.geometry.dispose(),this.particles.material.dispose(),this.sceneManager.scene.remove(this.group)}}class ue{constructor(e,t){this.sceneManager=e,this.onDaySelected=t,this.capsules=[],this.ringGroup=new z,this.raycaster=new X,this.hoveredCapsule=null,this.isActive=!0,this.cameraControls={isDragging:!1,previousMousePosition:{x:0,y:0},rotation:{x:0,y:0},targetRotation:{x:0,y:0},autoRotateSpeed:.001,isAutoRotating:!0,autoRotateTimeout:null,inertia:{x:0,y:0},zoom:12,targetZoom:12,minZoom:8,maxZoom:20},this.init()}init(){this.sceneManager.scene.add(this.ringGroup),this.createEnvironment(),this.createHolographicHeart(),this.createRomanticParticles(),this.createCapsules(),this.createConnections(),this.createReturnButton(),this.setupCameraControls(),this.setupInteraction(),this.setupDoubleClickInteraction(),this.unsubscribeUpdate=this.sceneManager.onUpdate(this.update.bind(this)),this.sceneManager.camera.position.set(0,4,this.cameraControls.zoom),this.sceneManager.camera.lookAt(0,0,0),this.sceneManager.scene.fog=new R(c.charcoal,.02),this.playIntroAnimation()}createEnvironment(){const e=new Y(40,40,c.roseRed,c.deepPurple);e.position.y=-2,e.material.opacity=.3,e.material.transparent=!0,this.sceneManager.scene.add(e);const t=new $(100,100),i=new H({color:c.charcoal,roughness:.1,metalness:.8,transparent:!0,opacity:.8}),s=new x(t,i);s.rotation.x=-Math.PI/2,s.position.y=-2.01,this.sceneManager.scene.add(s);const o=new A(c.deepPurple,2);this.sceneManager.scene.add(o);const a=new S(c.champagneGold,2,20);a.position.set(5,2,5),this.sceneManager.scene.add(a);const n=new S(c.roseRed,2,20);n.position.set(-5,2,5),this.sceneManager.scene.add(n)}createHolographicHeart(){const e=new Z,t=0,i=0;e.moveTo(t+.5,i+.5),e.bezierCurveTo(t+.5,i+.5,t+.4,i,t,i),e.bezierCurveTo(t-.6,i,t-.6,i+.7,t-.6,i+.7),e.bezierCurveTo(t-.6,i+1.1,t-.3,i+1.54,t+.5,i+1.9),e.bezierCurveTo(t+1.2,i+1.54,t+1.6,i+1.1,t+1.6,i+.7),e.bezierCurveTo(t+1.6,i+.7,t+1.6,i,t+1,i),e.bezierCurveTo(t+.7,i,t+.5,i+.5,t+.5,i+.5);const s={depth:.4,bevelEnabled:!0,bevelSegments:5,steps:2,bevelSize:.1,bevelThickness:.1},o=new K(e,s);o.center(),o.scale(.8,.8,.8);const a=new C({uniforms:{uTime:{value:0},uColor1:{value:new w(c.roseRed)},uColor2:{value:new w(c.champagneGold)},uGlowIntensity:{value:1},uHoverGlow:{value:0}},vertexShader:`
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
            `,fragmentShader:`
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
            `,transparent:!0,blending:y,depthWrite:!1,side:Q});this.holographicHeart=new x(o,a),this.holographicHeart.position.set(0,0,0),this.holographicHeart.userData.isHeart=!0,this.ringGroup.add(this.holographicHeart);const n=new J(1.5,.02,16,100),r=new ee({color:c.roseRed,transparent:!0,opacity:.3,blending:y});this.glowRing=new x(n,r),this.glowRing.rotation.x=Math.PI/2,this.ringGroup.add(this.glowRing)}createRomanticParticles(){const e=this.sceneManager.qualityTier==="low"?500:this.sceneManager.qualityTier==="medium"?1e3:2e3,t=new E,i=new Float32Array(e*3),s=new Float32Array(e),o=new Float32Array(e),a=new Float32Array(e);for(let r=0;r<e;r++){const p=r/e*Math.PI*2,b=2+Math.random()*3,h=p,M=b*16*Math.pow(Math.sin(h),3)*.1,T=b*(13*Math.cos(h)-5*Math.cos(2*h)-2*Math.cos(3*h)-Math.cos(4*h))*.1,_=(Math.random()-.5)*2;i[r*3]=M,i[r*3+1]=T,i[r*3+2]=_,s[r]=Math.random()*2+1,o[r]=Math.random()*.5+.3,a[r]=Math.random()*Math.PI*2}t.setAttribute("position",new f(i,3)),t.setAttribute("size",new f(s,1)),t.setAttribute("alpha",new f(o,1)),t.setAttribute("phase",new f(a,1));const n=new C({uniforms:{uTime:{value:0},uColor:{value:new w(c.champagneGold)},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:`
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
            `,fragmentShader:`
                varying float vAlpha;
                uniform vec3 uColor;
                
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
                    gl_FragColor = vec4(uColor, alpha);
                }
            `,transparent:!0,depthWrite:!1,blending:y});this.romanticParticles=new P(t,n),this.ringGroup.add(this.romanticParticles)}createCapsules(){u.forEach((e,t)=>{const i=new de(t,this.sceneManager),s=m.getCapsuleState(t);i.setState(s),this.capsules.push(i)})}createConnections(){const e=new te({color:c.champagneGold,transparent:!0,opacity:.1,blending:y});this.capsules.forEach(t=>{const i=[new D(0,0,0),t.mesh.position.clone()],s=new E().setFromPoints(i),o=new ie(s,e);this.ringGroup.add(o)})}createReturnButton(){this.returnButton=document.createElement("button"),this.returnButton.className="landing-return-btn",this.returnButton.innerHTML="← Return",this.returnButton.style.cssText=`
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
        `,this.returnButton.addEventListener("mouseenter",()=>{this.returnButton.style.background="rgba(0, 255, 255, 0.2)",this.returnButton.style.borderColor="#ff00ff",this.returnButton.style.color="#ff00ff",this.returnButton.style.transform="translateX(0) scale(1.05)",this.returnButton.style.boxShadow="0 0 20px rgba(0, 255, 255, 0.5)"}),this.returnButton.addEventListener("mouseleave",()=>{this.returnButton.style.background="rgba(18, 12, 24, 0.8)",this.returnButton.style.borderColor="#00ffff",this.returnButton.style.color="#00ffff",this.returnButton.style.transform="translateX(0) scale(1)",this.returnButton.style.boxShadow="none"}),this.returnButton.addEventListener("click",()=>{window.location.reload()}),document.body.appendChild(this.returnButton),setTimeout(()=>{this.returnButton.style.opacity="1",this.returnButton.style.transform="translateX(0)"},2e3)}setupCameraControls(){window.addEventListener("mousedown",this.onCameraDragStart.bind(this)),window.addEventListener("mousemove",this.onCameraDragMove.bind(this)),window.addEventListener("mouseup",this.onCameraDragEnd.bind(this)),window.addEventListener("touchstart",this.onTouchDragStart.bind(this),{passive:!1}),window.addEventListener("touchmove",this.onTouchDragMove.bind(this),{passive:!1}),window.addEventListener("touchend",this.onTouchDragEnd.bind(this),{passive:!1}),window.addEventListener("wheel",this.onWheel.bind(this),{passive:!1})}onCameraDragStart(e){this.hoveredCapsule||(this.cameraControls.isDragging=!0,this.cameraControls.isAutoRotating=!1,this.cameraControls.previousMousePosition={x:e.clientX,y:e.clientY},this.cameraControls.autoRotateTimeout&&clearTimeout(this.cameraControls.autoRotateTimeout))}onCameraDragMove(e){if(!this.cameraControls.isDragging)return;const t=e.clientX-this.cameraControls.previousMousePosition.x,i=e.clientY-this.cameraControls.previousMousePosition.y;this.cameraControls.targetRotation.y+=t*.005,this.cameraControls.targetRotation.x+=i*.005,this.cameraControls.targetRotation.x=Math.max(-Math.PI/3,Math.min(Math.PI/3,this.cameraControls.targetRotation.x)),this.cameraControls.inertia.x=i*.005,this.cameraControls.inertia.y=t*.005,this.cameraControls.previousMousePosition={x:e.clientX,y:e.clientY}}onCameraDragEnd(e){this.cameraControls.isDragging=!1,this.cameraControls.autoRotateTimeout=setTimeout(()=>{this.cameraControls.isAutoRotating=!0},2e3)}onTouchDragStart(e){if(e.touches.length!==1||this.hoveredCapsule)return;const t=e.touches[0];this.cameraControls.isDragging=!0,this.cameraControls.isAutoRotating=!1,this.cameraControls.previousMousePosition={x:t.clientX,y:t.clientY},this.cameraControls.autoRotateTimeout&&clearTimeout(this.cameraControls.autoRotateTimeout)}onTouchDragMove(e){if(!this.cameraControls.isDragging||e.touches.length!==1)return;e.preventDefault();const t=e.touches[0],i=t.clientX-this.cameraControls.previousMousePosition.x,s=t.clientY-this.cameraControls.previousMousePosition.y;this.cameraControls.targetRotation.y+=i*.005,this.cameraControls.targetRotation.x+=s*.005,this.cameraControls.targetRotation.x=Math.max(-Math.PI/3,Math.min(Math.PI/3,this.cameraControls.targetRotation.x)),this.cameraControls.previousMousePosition={x:t.clientX,y:t.clientY}}onTouchDragEnd(e){this.cameraControls.isDragging=!1,this.cameraControls.autoRotateTimeout=setTimeout(()=>{this.cameraControls.isAutoRotating=!0},2e3)}onWheel(e){e.preventDefault();const t=e.deltaY*.01;this.cameraControls.targetZoom=Math.max(this.cameraControls.minZoom,Math.min(this.cameraControls.maxZoom,this.cameraControls.targetZoom+t))}setupInteraction(){window.addEventListener("mousemove",this.onMouseMove.bind(this)),window.addEventListener("click",this.onClick.bind(this)),window.addEventListener("touchstart",this.onTouchStart.bind(this),{passive:!1}),window.addEventListener("touchend",this.onTouchEnd.bind(this),{passive:!1}),window.enterCapsuleExperience=e=>{console.log("Entering experience for day:",e),this.isActive&&this.enterExperience(e)}}onTouchStart(e){if(!this.isActive||e.touches.length===0)return;const t=e.touches[0];this.updateTouchHover(t)}onTouchEnd(e){if(!this.isActive||!this.hoveredCapsule)return;const t=this.hoveredCapsule.onClick();t.action==="enter"?this.enterExperience(t.dayIndex):t.action==="showPastMessage"?this.onDaySelected&&this.onDaySelected(t.dayIndex):t.action==="showFutureMessage"&&this.showMessage("future",t.dayIndex),this.hoveredCapsule&&(this.hoveredCapsule.onHoverExit(),this.hoveredCapsule=null,this.hideDayInfo())}updateTouchHover(e){const t=new v(e.clientX/window.innerWidth*2-1,-(e.clientY/window.innerHeight)*2+1);if(this.raycaster.setFromCamera(t,this.sceneManager.camera),this.raycaster.intersectObject(this.holographicHeart).length>0){this.onHeartHover();return}const s=this.capsules.map(a=>a.mesh),o=this.raycaster.intersectObjects(s);if(o.length>0){const a=o[0].object.userData.dayIndex,n=this.capsules[a];this.hoveredCapsule!==n&&(this.hoveredCapsule&&this.hoveredCapsule.onHoverExit(),this.hoveredCapsule=n,n.onHover(),this.showDayInfo(a))}else this.hoveredCapsule&&(this.hoveredCapsule.onHoverExit(),this.hoveredCapsule=null,this.hideDayInfo()),this.onHeartHoverExit()}onMouseMove(e){if(!this.isActive)return;const t=new v(e.clientX/window.innerWidth*2-1,-(e.clientY/window.innerHeight)*2+1);if(this.raycaster.setFromCamera(t,this.sceneManager.camera),this.raycaster.intersectObject(this.holographicHeart).length>0){this.onHeartHover();return}else this.onHeartHoverExit();const s=this.capsules.map(n=>n.mesh),o=this.raycaster.intersectObjects(s);if(o.length>0){const n=o[0].object.userData.dayIndex,r=this.capsules[n];this.hoveredCapsule!==r&&(this.hoveredCapsule&&this.hoveredCapsule.onHoverExit(),this.hoveredCapsule=r,r.onHover(),this.showDayInfo(n))}else this.hoveredCapsule&&(this.hoveredCapsule.onHoverExit(),this.hoveredCapsule=null,this.hideDayInfo());const a=document.getElementById("cursor");a&&this.hoveredCapsule?m.getCapsuleState(this.hoveredCapsule.dayIndex)!=="active"?(a.classList.add("locked"),a.classList.remove("hover")):a.classList.remove("locked"):a&&a.classList.remove("locked","hover")}onHeartHover(){this.holographicHeart&&this.holographicHeart.material.uniforms&&l.to(this.holographicHeart.material.uniforms.uHoverGlow,{value:1,duration:.3});const e=document.getElementById("cursor");e&&e.classList.add("hover")}onHeartHoverExit(){this.holographicHeart&&this.holographicHeart.material.uniforms&&l.to(this.holographicHeart.material.uniforms.uHoverGlow,{value:0,duration:.3})}onClick(e){if(!this.isActive||!this.hoveredCapsule)return;const t=this.hoveredCapsule.onClick();t.action==="enter"?this.enterExperience(t.dayIndex):t.action==="showPastMessage"?this.onDaySelected&&this.onDaySelected(t.dayIndex):t.action==="showFutureMessage"&&this.showMessage("future",t.dayIndex)}async enterExperience(e){this.isActive=!1;const t=this.capsules[e];this.capsules.forEach(i=>{i.emojiElement&&(i.emojiElement.style.display="none"),i.buttonElement&&(i.buttonElement.style.display="none")}),await this.sceneManager.animateCameraTo({x:t.mesh.position.x*.3,y:t.mesh.position.y+1,z:t.mesh.position.z*.3+2},t.mesh.position,1.5),l.to(this.ringGroup,{visible:!1,duration:.5}),this.onDaySelected&&this.onDaySelected(e)}showDayInfo(e){const t=u[e],i=m.getCapsuleState(e);let s=document.querySelector(".day-info");s||(s=document.createElement("div"),s.className="day-info",s.innerHTML=`
                <div class="day-name"></div>
                <div class="day-theme"></div>
            `,document.getElementById("ui-overlay").appendChild(s));const o=s.querySelector(".day-name"),a=s.querySelector(".day-theme");o.textContent=t.day,i==="past"?(a.textContent="This moment has passed",a.style.color="rgba(241, 194, 125, 0.3)"):i==="future"?(a.textContent="Not yet...",a.style.color="rgba(230, 57, 70, 0.5)"):(a.textContent=t.theme,a.style.color=""),s.classList.add("visible")}hideDayInfo(){const e=document.querySelector(".day-info");e&&e.classList.remove("visible")}showMessage(e,t){const i=u[t];let s=document.querySelector(".lock-message");s||(s=document.createElement("div"),s.className="lock-message",s.innerHTML='<div class="text"></div>',document.getElementById("ui-overlay").appendChild(s));const o=s.querySelector(".text");s.classList.remove("past","future"),s.classList.add(e),e==="past"?o.innerHTML=`${i.day} has slipped through time.<br>It cannot be recovered.`:o.innerHTML=`${i.day} awaits.<br>Patience is part of love.`,s.classList.add("visible"),setTimeout(()=>{s.classList.remove("visible")},3e3)}playIntroAnimation(){this.sceneManager.camera.position.set(0,10,30),this.holographicHeart.scale.set(0,0,0),this.romanticParticles.material.opacity=0,this.capsules.forEach(e=>e.mesh.scale.set(0,0,0)),l.to(this.sceneManager.camera.position,{x:0,y:4,z:this.cameraControls.zoom,duration:2.5,ease:"power3.out"}),l.to(this.holographicHeart.scale,{x:1,y:1,z:1,duration:1.5,delay:.5,ease:"back.out(1.7)"}),l.to(this.romanticParticles.material,{opacity:1,duration:1,delay:1}),this.capsules.forEach((e,t)=>{l.to(e.mesh.scale,{x:1,y:1,z:1,duration:.6,delay:1.5+t*.1,ease:"back.out(1.7)"})})}update(e,t){if(!this.isActive)return;this.cameraControls.rotation.x+=(this.cameraControls.targetRotation.x-this.cameraControls.rotation.x)*.1,this.cameraControls.rotation.y+=(this.cameraControls.targetRotation.y-this.cameraControls.rotation.y)*.1,this.cameraControls.isAutoRotating&&(this.cameraControls.targetRotation.y+=this.cameraControls.autoRotateSpeed),this.cameraControls.isDragging||(this.cameraControls.inertia.x*=.95,this.cameraControls.inertia.y*=.95,this.cameraControls.targetRotation.x+=this.cameraControls.inertia.x,this.cameraControls.targetRotation.y+=this.cameraControls.inertia.y),this.cameraControls.zoom+=(this.cameraControls.targetZoom-this.cameraControls.zoom)*.1;const i=this.cameraControls.zoom;this.sceneManager.camera.position.x=Math.sin(this.cameraControls.rotation.y)*Math.cos(this.cameraControls.rotation.x)*i,this.sceneManager.camera.position.y=Math.sin(this.cameraControls.rotation.x)*i+2,this.sceneManager.camera.position.z=Math.cos(this.cameraControls.rotation.y)*Math.cos(this.cameraControls.rotation.x)*i,this.sceneManager.camera.lookAt(0,0,0),this.ringGroup.rotation.y+=ne.capsuleRotationSpeed,this.holographicHeart&&this.holographicHeart.material.uniforms&&(this.holographicHeart.material.uniforms.uTime.value=t,this.holographicHeart.rotation.y+=.002),this.glowRing&&(this.glowRing.rotation.z+=.001,this.glowRing.material.opacity=.3+Math.sin(t*2)*.1),this.romanticParticles&&this.romanticParticles.material.uniforms&&(this.romanticParticles.material.uniforms.uTime.value=t),this.capsules.forEach(s=>{s.update(e,t)})}returnFromExperience(){this.ringGroup.visible=!0,this.isActive=!0,this.capsules.forEach(e=>{e.emojiElement&&(e.emojiElement.style.display="block"),e.buttonElement&&(e.buttonElement.style.display="block")}),this.sceneManager.animateCameraTo({x:0,y:4,z:this.cameraControls.zoom},{x:0,y:0,z:0},1.5),this.capsules.forEach((e,t)=>{const i=m.getCapsuleState(t);e.setState(i)})}setupDoubleClickInteraction(){window.addEventListener("dblclick",()=>{this.triggerTimeAcceleration()})}triggerTimeAcceleration(){l.to(this.ringGroup.rotation,{y:this.ringGroup.rotation.y+Math.PI*2,duration:2,ease:"power4.inOut"}),this.holographicHeart&&l.fromTo(this.holographicHeart.scale,{x:1,y:1,z:1},{x:1.5,y:1.5,z:1.5,duration:1,yoyo:!0,repeat:1,ease:"power2.inOut"})}dispose(){this.isActive=!1,this.unsubscribeUpdate&&this.unsubscribeUpdate(),this.returnButton&&this.returnButton.parentNode&&this.returnButton.parentNode.removeChild(this.returnButton),this.capsules.forEach(e=>e.dispose()),window.removeEventListener("mousemove",this.onMouseMove.bind(this)),window.removeEventListener("click",this.onClick.bind(this)),window.removeEventListener("mousedown",this.onCameraDragStart.bind(this)),window.removeEventListener("mousemove",this.onCameraDragMove.bind(this)),window.removeEventListener("mouseup",this.onCameraDragEnd.bind(this)),this.ringGroup.parent&&this.sceneManager.scene.remove(this.ringGroup)}}const k={RoseDay:()=>g(()=>import("./RoseDay-BERosexM.js"),__vite__mapDeps([0,1,2,3])),ProposeDay:()=>g(()=>import("./ProposeDay-CMo3uKu4.js"),__vite__mapDeps([4,1,2,3])),ChocolateDay:()=>g(()=>import("./ChocolateDay-BBZzdCTZ.js"),__vite__mapDeps([5,1,2,3])),TeddyDay:()=>g(()=>import("./TeddyDay-Bp1KOM4R.js"),__vite__mapDeps([6,1,2,3])),PromiseDay:()=>g(()=>import("./PromiseDay-Co1QPMzL.js"),__vite__mapDeps([7,1,2,3])),HugDay:()=>g(()=>import("./HugDay-Dl9QtOjs.js"),__vite__mapDeps([8,1,2,3])),KissDay:()=>g(()=>import("./KissDay-CY7fX3WD.js"),__vite__mapDeps([9,1,2,3])),ValentineDay:()=>g(()=>import("./ValentineDay-gBns3Caw.js"),__vite__mapDeps([10,1,2,3]))};class me{constructor(){this.sceneManager=null,this.landingScene=null,this.currentExperience=null,this.isInitialized=!1}async init(){if(m.onManipulationDetected=this.onManipulationDetected.bind(this),await m.validateTime(),m.isManipulated){this.showManipulationWarning();return}const e=document.getElementById("canvas-container");this.sceneManager=new re(e),this.landingScene=new ue(this.sceneManager,this.onDaySelected.bind(this)),this.sceneManager.start(),this.cursor=new ce,this.setupCountdown(),this.hideLoadingScreen(),this.isInitialized=!0}hideLoadingScreen(){const e=document.getElementById("loading-screen");e&&setTimeout(()=>{e.classList.add("fade-out"),setTimeout(()=>{e.remove()},500)},2500)}onManipulationDetected(e){console.warn("[App] Time manipulation detected:",e),this.showManipulationWarning()}showManipulationWarning(){const e=document.getElementById("manipulation-warning");e&&e.classList.add("visible"),this.sceneManager&&this.sceneManager.stop()}async onDaySelected(e){const t=u[e];if(m.getDayState(e)==="completed"){this.showPastEventPassword(e);return}if(!m.canEnterExperience(e)){console.log("[App] Cannot enter experience:",t.day);return}const s=t.experience,o=k[s];if(!o){console.error("[App] Experience not found:",s);return}try{const n=(await o()).default;this.currentExperience=new n(e,this.sceneManager,this.onExperienceComplete.bind(this)),await this.currentExperience.init()}catch(a){console.error("[App] Failed to load experience:",a),this.returnToLanding()}}showPastEventPassword(e){const t=u[e],i=document.createElement("div");i.className="past-event-password-overlay",i.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(13, 2, 28, 0.95), rgba(32, 14, 53, 0.95));
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s;
        `,i.innerHTML=`
            <div style="
                background: linear-gradient(135deg, #2d1b4e, #120c18);
                border: 3px solid #ff00ff;
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 0 40px rgba(255, 0, 255, 0.5);
                text-align: center;
            ">
                <div style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 2rem;
                    color: #00ffff;
                    margin-bottom: 10px;
                    text-shadow: 0 0 15px #00ffff;
                ">
                    🔒 ${t.day}
                </div>
                <div style="
                    font-family: 'Patrick Hand', cursive;
                    font-size: 1.2rem;
                    color: #ffffff;
                    margin-bottom: 30px;
                    opacity: 0.8;
                ">
                    This is a past event. Enter password to relive:
                </div>
                <input 
                    type="password" 
                    class="past-event-password-input"
                    placeholder="Enter password..."
                    style="
                        width: 100%;
                        padding: 15px 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 2px solid #00ffff;
                        border-radius: 10px;
                        color: #ffffff;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.1rem;
                        text-align: center;
                        margin-bottom: 20px;
                        outline: none;
                        transition: all 0.3s;
                    "
                />
                <div class="password-error" style="
                    color: #ff0055;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 0.9rem;
                    min-height: 20px;
                    margin-bottom: 15px;
                "></div>
                <div style="display: flex; gap: 15px;">
                    <button class="past-event-unlock-btn" style="
                        flex: 1;
                        padding: 15px 30px;
                        background: linear-gradient(135deg, #ff00ff, #00ffff);
                        border: none;
                        border-radius: 10px;
                        color: #ffffff;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
                    ">
                        Unlock
                    </button>
                    <button class="past-event-cancel-btn" style="
                        flex: 1;
                        padding: 15px 30px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 2px solid #ff0055;
                        border-radius: 10px;
                        color: #ff0055;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        Cancel
                    </button>
                </div>
            </div>
        `,document.body.appendChild(i),setTimeout(()=>i.style.opacity="1",10);const s=i.querySelector(".past-event-password-input"),o=i.querySelector(".password-error"),a=i.querySelector(".past-event-unlock-btn"),n=i.querySelector(".past-event-cancel-btn");s.focus();const r=()=>{s.value.trim()==="memories"?(i.style.opacity="0",setTimeout(()=>i.remove(),300),this.loadExperienceDirect(e)):(o.textContent="❌ Incorrect password",s.value="",s.focus(),s.style.animation="shake 0.5s",setTimeout(()=>s.style.animation="",500))};a.addEventListener("click",r),s.addEventListener("keydown",p=>{p.key==="Enter"&&r()}),n.addEventListener("click",()=>{i.style.opacity="0",setTimeout(()=>i.remove(),300)}),a.addEventListener("mouseenter",()=>{a.style.transform="scale(1.05)",a.style.boxShadow="0 0 30px rgba(255, 0, 255, 0.6)"}),a.addEventListener("mouseleave",()=>{a.style.transform="scale(1)",a.style.boxShadow="0 0 20px rgba(255, 0, 255, 0.4)"}),n.addEventListener("mouseenter",()=>{n.style.transform="scale(1.05)",n.style.background="rgba(255, 0, 85, 0.2)"}),n.addEventListener("mouseleave",()=>{n.style.transform="scale(1)",n.style.background="rgba(255, 255, 255, 0.1)"})}async loadExperienceDirect(e){const i=u[e].experience,s=k[i];if(!s){console.error("[App] Experience not found:",i);return}try{const a=(await s()).default;this.currentExperience=new a(e,this.sceneManager,this.onExperienceComplete.bind(this)),await this.currentExperience.init()}catch(o){console.error("[App] Failed to load experience:",o),this.returnToLanding()}}onExperienceComplete(e,t=!1){console.log("[App] Experience complete:",u[e].day,t?"(exited early)":""),this.currentExperience&&(this.currentExperience.dispose(),this.currentExperience=null),this.returnToLanding()}returnToLanding(){this.landingScene&&this.landingScene.returnFromExperience()}setupCountdown(){const e=()=>{const t=m.formatCountdown();let i=document.querySelector(".countdown");i||(i=document.createElement("div"),i.className="countdown",i.innerHTML=`
          <div class="label">Time remaining</div>
          <div class="time"></div>
        `,document.getElementById("ui-overlay").appendChild(i));const s=i.querySelector(".time");s&&(s.textContent=t.formatted)};e(),setInterval(e,1e3)}}document.addEventListener("DOMContentLoaded",()=>{new me().init().catch(console.error)});export{c as C,u as T,m as t};
