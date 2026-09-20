import{r as v,j as u,o as q,m as N}from"./index-DOAce6Su.js";const B=({hue:g=230,xOffset:i=0,speed:f=1,intensity:r=1,size:d=1})=>{const n=v.useRef(null);return v.useEffect(()=>{const a=n.current;if(!a)return;const S=window.matchMedia("(max-width: 767px), (pointer: coarse)").matches,p=1e3/(S?30:45),y=()=>{const M=Math.min(window.devicePixelRatio||1,S?1:1.5),z=Math.max(1,Math.floor(a.clientWidth*M)),C=Math.max(1,Math.floor(a.clientHeight*M));(a.width!==z||a.height!==C)&&(a.width=z,a.height=C)};y();const h=new ResizeObserver(y);h.observe(a);const t=a.getContext("webgl");if(!t)return;const l=`
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `,m=`
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      #define OCTAVE_COUNT 10
      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }
      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }
      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }
      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }
      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }
      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }
      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        float aspect = iResolution.x / iResolution.y;
        uv.x *= aspect;
        uv.x += uXOffset;
          
          // 1. Alur Utama (Macroscopic Path)
          // Menggunakan gelombang sinus agar petir meliuk lembut seperti ular ke bawah
          float path = sin(uv.y * 3.0 - iTime * 2.5) * 0.25 
                     + sin(uv.y * 5.0 + iTime * 1.5) * 0.15;
          
          // 2. Detail Kasar (Microscopic Noise)
          // Menggunakan fbm untuk cabang dan pinggiran tajam khas petir
          vec2 noiseUv = uv * uSize * 1.5;
          float n = 2.0 * fbm(noiseUv + 1.2 * iTime * uSpeed) - 1.0;
          
        // Batasi lebar liukan pada layar portrait.
        float scale = aspect < 1.0 ? (aspect * 1.1) : 1.0;
        float center = (path + n * 0.4) * scale;
          
        uv.y += n * 0.2 * scale; // Sedikit distorsi vertikal
          float dist = abs(uv.x - center);
          
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          float alpha = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
          fragColor = vec4(col, alpha);
      }
      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `,s=(M,z)=>{const C=t.createShader(z);return C?(t.shaderSource(C,M),t.compileShader(C),t.getShaderParameter(C,t.COMPILE_STATUS)?C:(t.deleteShader(C),null)):null},x=s(l,t.VERTEX_SHADER),A=s(m,t.FRAGMENT_SHADER);if(!x||!A)return;const o=t.createProgram();if(!o||(t.attachShader(o,x),t.attachShader(o,A),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS)))return;t.useProgram(o);const b=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),U=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,U),t.bufferData(t.ARRAY_BUFFER,b,t.STATIC_DRAW);const R=t.getAttribLocation(o,"aPosition");t.enableVertexAttribArray(R),t.vertexAttribPointer(R,2,t.FLOAT,!1,0,0);const T=t.getUniformLocation(o,"iResolution"),P=t.getUniformLocation(o,"iTime"),w=t.getUniformLocation(o,"uHue"),c=t.getUniformLocation(o,"uXOffset"),j=t.getUniformLocation(o,"uSpeed"),I=t.getUniformLocation(o,"uIntensity"),F=t.getUniformLocation(o,"uSize");let e=0,E=0,L=document.visibilityState!=="hidden";const W=performance.now(),O=M=>{e=0,L&&(M-E>=p&&(E=M,t.viewport(0,0,a.width,a.height),t.uniform2f(T,a.width,a.height),t.uniform1f(P,(M-W)/1e3),t.uniform1f(w,g),t.uniform1f(c,i),t.uniform1f(j,f),t.uniform1f(I,r),t.uniform1f(F,d),t.drawArrays(t.TRIANGLES,0,6)),e=requestAnimationFrame(O))},_=()=>{!e&&L&&(e=requestAnimationFrame(O))},k=()=>{L=document.visibilityState!=="hidden",L&&_()};return document.addEventListener("visibilitychange",k),_(),()=>{h.disconnect(),document.removeEventListener("visibilitychange",k),e&&cancelAnimationFrame(e)}},[g,i,f,r,d]),u.jsx("canvas",{ref:n,className:"w-full h-full"})};class D{constructor(){this.pos={x:0,y:0},this.vel={x:0,y:0},this.acc={x:0,y:0},this.target={x:0,y:0},this.closeEnoughTarget=100,this.maxSpeed=1,this.maxForce=.1,this.particleSize=10,this.isKilled=!1,this.startColor={r:0,g:0,b:0},this.targetColor={r:0,g:0,b:0},this.colorWeight=0,this.colorBlendRate=.01}move(){let i=1;const f=Math.sqrt(Math.pow(this.pos.x-this.target.x,2)+Math.pow(this.pos.y-this.target.y,2));f<this.closeEnoughTarget&&(i=f/this.closeEnoughTarget);const r={x:this.target.x-this.pos.x,y:this.target.y-this.pos.y},d=Math.sqrt(r.x*r.x+r.y*r.y);d>0&&(r.x=r.x/d*this.maxSpeed*i,r.y=r.y/d*this.maxSpeed*i);const n={x:r.x-this.vel.x,y:r.y-this.vel.y},a=Math.sqrt(n.x*n.x+n.y*n.y);a>0&&(n.x=n.x/a*this.maxForce,n.y=n.y/a*this.maxForce),this.acc.x+=n.x,this.acc.y+=n.y,this.vel.x+=this.acc.x,this.vel.y+=this.acc.y,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.acc.x=0,this.acc.y=0}draw(i,f){this.colorWeight<1&&(this.colorWeight=Math.min(this.colorWeight+this.colorBlendRate,1));const r={r:Math.round(this.startColor.r+(this.targetColor.r-this.startColor.r)*this.colorWeight),g:Math.round(this.startColor.g+(this.targetColor.g-this.startColor.g)*this.colorWeight),b:Math.round(this.startColor.b+(this.targetColor.b-this.startColor.b)*this.colorWeight)};i.fillStyle=`rgb(${r.r}, ${r.g}, ${r.b})`,f?i.fillRect(this.pos.x,this.pos.y,this.particleSize,this.particleSize):(i.beginPath(),i.arc(this.pos.x,this.pos.y,this.particleSize/2,0,Math.PI*2),i.fill())}kill(i,f){if(!this.isKilled){const r=this.generateRandomPos(i/2,f/2,(i+f)/2,i,f);this.target.x=r.x,this.target.y=r.y,this.startColor={r:this.startColor.r+(this.targetColor.r-this.startColor.r)*this.colorWeight,g:this.startColor.g+(this.targetColor.g-this.startColor.g)*this.colorWeight,b:this.startColor.b+(this.targetColor.b-this.startColor.b)*this.colorWeight},this.targetColor={r:0,g:0,b:0},this.colorWeight=0,this.isKilled=!0}}generateRandomPos(i,f,r,d,n){const a=Math.random()*d,S=Math.random()*n,p={x:a-i,y:S-f},y=Math.sqrt(p.x*p.x+p.y*p.y);return y>0&&(p.x=p.x/y*r,p.y=p.y/y*r),{x:i+p.x,y:f+p.y}}}function $(){const g=v.useRef(null),i=v.useRef(),f=v.useRef([]),r=v.useRef(null),d=v.useRef(0),n=4,a=!1,S=(h,t,l,m,s)=>{const x=Math.random()*m,A=Math.random()*s,o={x:x-h,y:A-t},b=Math.sqrt(o.x*o.x+o.y*o.y);return b>0&&(o.x=o.x/b*l,o.y=o.y/b*l),{x:h+o.x,y:t+o.y}},p=(h,t,l)=>{d.current=0;const m=document.createElement("canvas");m.width=t,m.height=l;const s=m.getContext("2d",{willReadFrequently:!0});r.current=m,s.textAlign="center",s.textBaseline="middle";const x=Math.min(1,t/800),A=65*x,o=80*x;s.font=`bold ${A}px Arial, sans-serif`;const b=s.createLinearGradient(t/2-250,0,t/2+250,0);b.addColorStop(0,"#ffffff"),b.addColorStop(.5,"#dbeafe"),b.addColorStop(1,"#bfdbfe"),s.fillStyle=b,s.fillText("Welcome To My",t/2,l/2-A*.7),s.font=`bold ${o}px Arial, sans-serif`,s.fillStyle="#2563eb",s.fillText("Portofolio Website",t/2,l/2+o*.7);const R=s.getImageData(0,0,t,l).data,T=f.current;let P=0;const w=[];for(let c=0;c<R.length;c+=n*4)w.push(c);for(let c=w.length-1;c>0;c--){const j=Math.floor(Math.random()*(c+1));[w[c],w[j]]=[w[j],w[c]]}for(const c of w)if(R[c+3]>0){const I=c/4%t,F=Math.floor(c/4/t);let e;if(P<T.length)e=T[P],e.isKilled=!1,P++;else{e=new D;const E=S(t/2,l/2,(t+l)/2,t,l);e.pos.x=E.x,e.pos.y=E.y,e.maxSpeed=Math.random()*8+8,e.maxForce=e.maxSpeed*.1,e.particleSize=3,e.colorBlendRate=Math.random()*.0275+.0025,T.push(e)}e.startColor={r:e.startColor.r+(e.targetColor.r-e.startColor.r)*e.colorWeight,g:e.startColor.g+(e.targetColor.g-e.startColor.g)*e.colorWeight,b:e.startColor.b+(e.targetColor.b-e.startColor.b)*e.colorWeight},e.targetColor={r:R[c],g:R[c+1],b:R[c+2]},e.colorWeight=0,e.target.x=I,e.target.y=F}for(let c=P;c<T.length;c++)T[c].kill(t,l)},y=()=>{const h=g.current;if(!h)return;if(document.hidden){i.current=requestAnimationFrame(y);return}const t=h.getContext("2d"),l=f.current;t.clearRect(0,0,h.width,h.height),d.current++;let m=0;d.current>90&&(m=Math.min(1,(d.current-90)/60)),t.globalAlpha=1-m;for(let s=l.length-1;s>=0;s--){const x=l[s];x.move(),x.draw(t,a),x.isKilled&&(x.pos.x<0||x.pos.x>h.width||x.pos.y<0||x.pos.y>h.height)&&l.splice(s,1)}t.globalAlpha=1,r.current&&m>0&&(t.globalAlpha=m,t.drawImage(r.current,0,0),t.globalAlpha=1),i.current=requestAnimationFrame(y)};return v.useEffect(()=>{const h=g.current;if(!h)return;const t=()=>{const l=Math.min(window.devicePixelRatio||1,2),m=window.innerWidth,s=window.innerHeight;h.width=m*l,h.height=s*l,h.style.width=`${m}px`,h.style.height=`${s}px`,h.getContext("2d").scale(l,l),p(h,m,s)};return t(),y(),window.addEventListener("resize",t),()=>{i.current&&cancelAnimationFrame(i.current),window.removeEventListener("resize",t)}},[]),u.jsx("div",{className:"absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center",children:u.jsx("canvas",{ref:g,className:"block",style:{willChange:"transform"}})})}const V=()=>{const[g,i]=v.useState(0);return v.useEffect(()=>{let n=0;const a=setInterval(()=>{n++;const S=Math.min(100,Math.round(n/100*100));i(S),n>=100&&clearInterval(a)},40);return()=>clearInterval(a)},[]),u.jsxs("div",{className:"w-64 sm:w-80 mx-auto flex flex-col items-center gap-4",children:[u.jsxs("div",{className:"text-white font-mono text-sm sm:text-base font-bold tracking-widest flex items-center justify-between w-full px-1",children:[u.jsx("span",{children:"Loading"}),u.jsxs("span",{children:[g,"%"]})]}),u.jsxs("div",{className:"w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative",children:[u.jsx("div",{className:"absolute top-0 bottom-0 left-0 bg-white/50 blur-[2px] w-full",style:{transform:`translateX(${g-100}%)`,transition:"transform 0.1s linear"}}),u.jsx("div",{className:"h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]",style:{width:`${g}%`,transition:"width 0.1s linear"}})]})]})},K=({onLoadingComplete:g})=>{const[i,f]=v.useState(!0);v.useEffect(()=>{const n=setTimeout(()=>{f(!1),setTimeout(()=>{g==null||g()},1e3)},4500);return()=>clearTimeout(n)},[g]);const r={exit:{opacity:0,scale:1.1,filter:"blur(10px)",transition:{duration:.8,ease:"easeInOut",when:"beforeChildren",staggerChildren:.1}}},d={exit:{y:-20,opacity:0,transition:{duration:.4,ease:"easeInOut"}}};return u.jsx(q,{children:i&&u.jsxs(N.div,{className:"fixed inset-0 z-50",initial:{opacity:0},animate:{opacity:1},exit:"exit",variants:r,children:[u.jsx("div",{className:"absolute inset-0 z-[1] pointer-events-none",children:u.jsx(B,{hue:220,xOffset:0,speed:1.6,intensity:1.2,size:2})}),u.jsx("div",{className:"relative z-10 min-h-screen flex items-center justify-center px-4",children:u.jsxs("div",{className:"w-full max-w-4xl mx-auto",children:[u.jsx(N.div,{className:"text-center mb-6 sm:mb-8 md:mb-12 w-full h-[150px] sm:h-[200px] flex justify-center",variants:d,children:u.jsx($,{})}),u.jsx(N.div,{className:"text-center",variants:d,"data-aos":"fade-up","data-aos-delay":"1200",children:u.jsx(V,{})})]})})]})})};export{K as default};
