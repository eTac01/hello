import{t as h,e as u,a as n,V as c,h as m,B as p,d as v,k as d,f,g as M}from"./three-BDTjZVi7.js";import{g as r}from"./gsap-C8pce-KX.js";import{B as g}from"./BaseExperience-D8fMzVIG.js";import{C as l}from"./index-yl1ICO7q.js";class b extends g{constructor(i,a,s){super(i,a,s),this.chocolateMesh=null,this.heatLevel=0,this.maxHeat=100,this.heatRadius=2}getInstruction(){return"Bring warmth... let it melt"}getCompletionMessage(){return"Sweetness melts<br>into something beautiful."}async init(){this.createChocolate(),this.setupInteraction(),await super.init(),this.unsubscribeUpdate=this.sceneManager.onUpdate(this.update.bind(this))}createChocolate(){const i=new h(2,1.5,.5,32,32,8),a=new u({uniforms:{uTime:{value:0},uMelt:{value:0},uMousePos:{value:new c(0,0)},uColor1:{value:new n(4005642)},uColor2:{value:new n(9127187)},uGoldColor:{value:new n(l.champagneGold)}},vertexShader:`
        uniform float uTime;
        uniform float uMelt;
        uniform vec2 uMousePos;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vMeltAmount;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          
          // Melt deformation
          float dist = length(pos.xy - uMousePos * 2.0);
          float meltInfluence = smoothstep(2.0, 0.0, dist) * uMelt;
          vMeltAmount = meltInfluence;
          
          // Heart shape morphing as melt increases
          if (uMelt > 0.5) {
            float heartMorph = (uMelt - 0.5) * 2.0;
            float angle = atan(pos.y, pos.x);
            float r = length(pos.xy);
            
            // Heart polar equation approximation
            float heartR = 0.8 * (1.0 - sin(angle)) * (1.0 + 0.3 * cos(2.0 * angle));
            
            pos.x = mix(pos.x, heartR * cos(angle) * 1.5, heartMorph * 0.5);
            pos.y = mix(pos.y, heartR * sin(angle) * 1.5 + 0.5, heartMorph * 0.5);
          }
          
          // Drip effect
          pos.y -= meltInfluence * 0.3;
          pos.z += sin(pos.x * 3.0 + uTime) * meltInfluence * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform float uMelt;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uGoldColor;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vMeltAmount;
        
        void main() {
          // Base chocolate color with shine
          vec3 color = mix(uColor1, uColor2, vUv.y + sin(vUv.x * 10.0) * 0.1);
          
          // Heat glow
          color = mix(color, uGoldColor, vMeltAmount * 0.5);
          
          // Melted sheen
          float shine = pow(max(0.0, dot(normalize(vec3(vUv - 0.5, 1.0)), vec3(0.0, 0.0, 1.0))), 8.0);
          color += vec3(0.3) * shine * (0.5 + uMelt * 0.5);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `});this.chocolateMesh=new m(i,a),this.chocolateMesh.position.set(0,0,0),this.group.add(this.chocolateMesh),this.createHeatParticles()}createHeatParticles(){const a=new p,s=new Float32Array(100*3),o=new Float32Array(100*3);for(let e=0;e<100;e++)s[e*3]=0,s[e*3+1]=0,s[e*3+2]=0,o[e*3]=(Math.random()-.5)*.02,o[e*3+1]=Math.random()*.02,o[e*3+2]=(Math.random()-.5)*.01;a.setAttribute("position",new v(s,3)),this.particleVelocities=o;const t=new d({color:l.champagneGold,size:.05,transparent:!0,opacity:0,blending:f});this.heatParticles=new M(a,t),this.group.add(this.heatParticles)}setupInteraction(){this.boundMouseMove=i=>{this.mousePos={x:i.clientX/window.innerWidth*2-1,y:-(i.clientY/window.innerHeight)*2+1}},window.addEventListener("mousemove",this.boundMouseMove)}update(i,a){if(!this.isActive||!this.chocolateMesh)return;const s=this.chocolateMesh.material;if(s.uniforms.uTime.value=a,this.mousePos){s.uniforms.uMousePos.value.set(this.mousePos.x,this.mousePos.y);const t=Math.sqrt(this.mousePos.x**2+this.mousePos.y**2);t<1?(this.heatLevel+=i*15*(1-t),this.heatParticles.material.opacity=Math.min(.8,this.heatLevel/50)):this.heatLevel-=i*5,this.heatLevel=Math.max(0,Math.min(this.maxHeat,this.heatLevel))}const o=this.heatLevel/this.maxHeat;if(s.uniforms.uMelt.value=o,this.heatParticles&&o>.1){const t=this.heatParticles.geometry.attributes.position.array;for(let e=0;e<t.length;e+=3)t[e]+=this.particleVelocities[e]*o,t[e+1]+=this.particleVelocities[e+1]*o,t[e+2]+=this.particleVelocities[e+2]*o,Math.abs(t[e])>2&&(t[e]=(Math.random()-.5)*.5,t[e+1]=(Math.random()-.5)*.5);this.heatParticles.geometry.attributes.position.needsUpdate=!0}o>=1&&!this.isCompleted&&this.onMeltComplete()}async onMeltComplete(){r.to(this.chocolateMesh.rotation,{y:Math.PI*2,duration:2,ease:"power2.inOut"}),r.to(this.heatParticles.material,{opacity:0,duration:1,onComplete:()=>this.complete()})}dispose(){this.unsubscribeUpdate&&this.unsubscribeUpdate(),window.removeEventListener("mousemove",this.boundMouseMove),super.dispose()}}export{b as default};
