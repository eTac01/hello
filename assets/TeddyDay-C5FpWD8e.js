import{B as M,a as m,d as u,e as f,f as d,g as x,i as b,h as P}from"./three-CTi2GLhd.js";import{g as p}from"./gsap-C8pce-KX.js";import{B as y}from"./BaseExperience-u8VwpAi8.js";import{C as c}from"./index-BLRnMeqI.js";class L extends y{constructor(t,o,e){super(t,o,e),this.comfortLevel=0,this.maxComfort=100}getInstruction(){return"Stay close... feel the comfort"}getCompletionMessage(){return"In stillness,<br>we find each other."}async init(){this.createComfortParticles(),this.createCenterGlow(),this.setupInteraction(),await super.init(),this.unsubscribeUpdate=this.sceneManager.onUpdate(this.update.bind(this))}createComfortParticles(){const o=new M,e=new Float32Array(300*3),i=new Float32Array(300*3),s=new Float32Array(300),v=new m(c.champagneGold),C=new m(c.roseRed);for(let r=0;r<300;r++){const h=Math.random()*Math.PI*2,a=Math.random()*Math.PI,n=3+Math.random()*2;e[r*3]=n*Math.sin(a)*Math.cos(h),e[r*3+1]=n*Math.sin(a)*Math.sin(h),e[r*3+2]=n*Math.cos(a);const g=Math.random(),l=v.clone().lerp(C,g);i[r*3]=l.r,i[r*3+1]=l.g,i[r*3+2]=l.b,s[r]=Math.random()*3+1}o.setAttribute("position",new u(e,3)),o.setAttribute("color",new u(i,3)),o.setAttribute("size",new u(s,1)),this.originalPositions=e.slice();const w=new f({uniforms:{uTime:{value:0},uComfort:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:`
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uComfort;
        uniform float uPixelRatio;
        
        void main() {
          vColor = color;
          
          // Move toward center based on comfort
          vec3 pos = position * (1.0 - uComfort * 0.7);
          pos += vec3(
            sin(uTime + position.x) * 0.1,
            cos(uTime + position.y) * 0.1,
            sin(uTime + position.z) * 0.1
          );
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (100.0 / -mvPosition.z) * (1.0 + uComfort * 0.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        uniform float uComfort;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * (0.3 + uComfort * 0.7);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,transparent:!0,depthWrite:!1,blending:d,vertexColors:!0});this.particles=new x(o,w),this.group.add(this.particles)}createCenterGlow(){const t=new b(.3,32,32),o=new f({uniforms:{uTime:{value:0},uComfort:{value:0},uColor:{value:new m(c.champagneGold)}},vertexShader:`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform float uComfort;
        uniform vec3 uColor;
        varying vec3 vNormal;
        
        void main() {
          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          float alpha = (0.2 + fresnel * 0.8) * uComfort * pulse;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,transparent:!0,blending:d});this.centerGlow=new P(t,o),this.group.add(this.centerGlow)}setupInteraction(){this.mousePos={x:0,y:0},this.boundMouseMove=t=>{this.mousePos.x=t.clientX/window.innerWidth*2-1,this.mousePos.y=-(t.clientY/window.innerHeight)*2+1},window.addEventListener("mousemove",this.boundMouseMove)}update(t,o){if(!this.isActive)return;const e=Math.sqrt(this.mousePos.x**2+this.mousePos.y**2);e<.5?this.comfortLevel+=t*20*(1-e*2):this.comfortLevel-=t*10,this.comfortLevel=Math.max(0,Math.min(this.maxComfort,this.comfortLevel));const i=this.comfortLevel/this.maxComfort;this.particles.material.uniforms.uTime.value=o,this.particles.material.uniforms.uComfort.value=i,this.centerGlow.material.uniforms.uTime.value=o,this.centerGlow.material.uniforms.uComfort.value=i;const s=1+i*2;this.centerGlow.scale.set(s,s,s),i>=1&&!this.isCompleted&&this.onComfortComplete()}async onComfortComplete(){p.to(this.particles.material.uniforms.uComfort,{value:1.2,duration:2,ease:"power2.out"}),p.to(this.centerGlow.scale,{x:10,y:10,z:10,duration:2,ease:"power2.out",onComplete:()=>this.complete()})}dispose(){this.unsubscribeUpdate&&this.unsubscribeUpdate(),window.removeEventListener("mousemove",this.boundMouseMove),super.dispose()}}export{L as default};
