import{l,n as p,e as g,f as d,a as r,V as m,h as a,G as v,i as c,r as f,j as w}from"./three-BDTjZVi7.js";import{g as s}from"./gsap-C8pce-KX.js";import{B as L}from"./BaseExperience-h4Cay5xU.js";import{C as n}from"./index-BhknYvxf.js";class D extends L{constructor(t,e,i){super(t,e,i),this.leftLight=null,this.rightLight=null,this.embraceProgress=0}getInstruction(){return"Bring them together..."}getCompletionMessage(){return"In an embrace,<br>two become one warmth."}async init(){this.createLights(),this.createWarmthField(),this.setupInteraction(),await super.init(),this.unsubscribeUpdate=this.sceneManager.onUpdate(this.update.bind(this))}createLights(){const t=(e,i)=>{const o=new v,h=new a(new c(.3,32,32),new f({color:e,transparent:!0,opacity:.9}));o.add(h);const u=new a(new c(.5,32,32),new g({uniforms:{uColor:{value:new r(e)},uTime:{value:0}},vertexShader:`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,fragmentShader:`
            uniform vec3 uColor;
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
              float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
              float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
              gl_FragColor = vec4(uColor, fresnel * 0.6 * pulse);
            }
          `,transparent:!0,side:w,blending:d}));return o.add(u),o.position.copy(i),o.userData={core:h,glow:u},o};this.leftLight=t(n.champagneGold,new l(-3,0,0)),this.rightLight=t(n.roseRed,new l(3,0,0)),this.group.add(this.leftLight),this.group.add(this.rightLight)}createWarmthField(){const t=new p(12,12,32,32),e=new g({uniforms:{uTime:{value:0},uProgress:{value:0},uLeftPos:{value:new m(-3,0)},uRightPos:{value:new m(3,0)},uColor1:{value:new r(n.champagneGold)},uColor2:{value:new r(n.roseRed)}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uLeftPos;
        uniform vec2 uRightPos;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        
        void main() {
          vec2 pos = (vUv - 0.5) * 12.0;
          
          float distLeft = length(pos - uLeftPos);
          float distRight = length(pos - uRightPos);
          
          float glow1 = 1.0 / (distLeft * distLeft + 0.5);
          float glow2 = 1.0 / (distRight * distRight + 0.5);
          
          vec3 color = uColor1 * glow1 + uColor2 * glow2;
          
          // Merge glow when close
          float mergeDist = length(uLeftPos - uRightPos);
          float mergeGlow = smoothstep(2.0, 0.5, mergeDist) * uProgress;
          
          float alpha = (glow1 + glow2) * 0.1 + mergeGlow * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,transparent:!0,depthWrite:!1,blending:d});this.warmthField=new a(t,e),this.warmthField.position.z=-.1,this.group.add(this.warmthField)}setupInteraction(){this.mousePos={x:0,y:0},this.isDragging=null,this.boundMouseMove=t=>{t.type==="touchmove"&&t.preventDefault();const e=t.clientX||t.touches&&t.touches[0]&&t.touches[0].clientX,i=t.clientY||t.touches&&t.touches[0]&&t.touches[0].clientY;if(!(e===void 0||i===void 0)&&(this.mousePos.x=e/window.innerWidth*2-1,this.mousePos.y=-(i/window.innerHeight)*2+1,this.isDragging)){const o=this.isDragging==="left"?this.leftLight:this.rightLight;s.to(o.position,{x:this.mousePos.x*4,y:this.mousePos.y*3,duration:.2})}},this.boundMouseDown=t=>{t.type==="touchstart"&&t.preventDefault();const e=Math.hypot(this.mousePos.x*4-this.leftLight.position.x,this.mousePos.y*3-this.leftLight.position.y),i=Math.hypot(this.mousePos.x*4-this.rightLight.position.x,this.mousePos.y*3-this.rightLight.position.y);e<1.5?this.isDragging="left":i<1.5&&(this.isDragging="right")},this.boundMouseUp=t=>{t&&t.type==="touchend"&&t.preventDefault(),this.isDragging=null},window.addEventListener("mousemove",this.boundMouseMove),window.addEventListener("mousedown",this.boundMouseDown),window.addEventListener("mouseup",this.boundMouseUp),window.addEventListener("touchmove",this.boundMouseMove,{passive:!1}),window.addEventListener("touchstart",this.boundMouseDown,{passive:!1}),window.addEventListener("touchend",this.boundMouseUp,{passive:!1})}update(t,e){if(!this.isActive)return;[this.leftLight,this.rightLight].forEach(o=>{o.userData.glow.material.uniforms&&(o.userData.glow.material.uniforms.uTime.value=e)});const i=this.leftLight.position.distanceTo(this.rightLight.position);this.embraceProgress=Math.max(0,1-i/6),this.warmthField.material.uniforms.uTime.value=e,this.warmthField.material.uniforms.uProgress.value=this.embraceProgress,this.warmthField.material.uniforms.uLeftPos.value.set(this.leftLight.position.x,this.leftLight.position.y),this.warmthField.material.uniforms.uRightPos.value.set(this.rightLight.position.x,this.rightLight.position.y),i<.8&&!this.isCompleted&&this.onEmbraceComplete()}async onEmbraceComplete(){const t=this.leftLight.position.clone().add(this.rightLight.position).multiplyScalar(.5);s.to(this.leftLight.position,{x:t.x,y:t.y,duration:1,ease:"power2.in"}),s.to(this.rightLight.position,{x:t.x,y:t.y,duration:1,ease:"power2.in"}),s.to(this.warmthField.material.uniforms.uProgress,{value:3,duration:2,ease:"power2.out",onComplete:()=>this.complete()})}dispose(){this.unsubscribeUpdate&&this.unsubscribeUpdate(),window.removeEventListener("mousemove",this.boundMouseMove),window.removeEventListener("mousedown",this.boundMouseDown),window.removeEventListener("mouseup",this.boundMouseUp),window.removeEventListener("touchmove",this.boundMouseMove),window.removeEventListener("touchstart",this.boundMouseDown),window.removeEventListener("touchend",this.boundMouseUp),super.dispose()}}export{D as default};
