"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec3 aParam;
uniform float uTime;
uniform float uProgress;
uniform float uAspect;
uniform float uDpr;
varying vec3 vColor;
varying float vAlpha;
vec3 rotateField(vec3 p, float x, float y, float z) {
  p.yz = mat2(cos(x), -sin(x), sin(x), cos(x)) * p.yz;
  p.xz = mat2(cos(y), -sin(y), sin(y), cos(y)) * p.xz;
  p.xy = mat2(cos(z), -sin(z), sin(z), cos(z)) * p.xy;
  return p;
}
void main() {
  float u = aParam.x + uTime * 0.035;
  float v = aParam.y;
  vec3 center = vec3(1.62*cos(u), 0.57*sin(2.0*u), 0.54*sin(u));
  vec3 tangent = normalize(vec3(-1.62*sin(u), 1.14*cos(2.0*u), 0.54*cos(u)));
  vec3 normal = normalize(vec3(tangent.y, -tangent.x, 0.0));
  vec3 binormal = normalize(cross(tangent, normal));
  vec3 band = cos(u*0.5)*normal + sin(u*0.5)*binormal;
  vec3 p = center + v*band;
  p += normal * (sin(u*5.0+uTime*0.13+aParam.z*4.0)*0.012);
  float story = smoothstep(0.12, 0.85, uProgress);
  float placement = smoothstep(0.08, 0.34, uProgress);
  p = rotateField(p, 0.12+story*0.5, -0.18+story*0.85, -0.05+sin(uTime*0.045)*0.025);
  float perspective = 3.8 / (3.8-p.z*0.6);
  float zoom = mix(0.47, 0.44, placement) * min(1.0,uAspect);
  vec2 projected = p.xy * zoom * perspective;
  projected.x /= uAspect;
  projected += vec2(mix(0.0, -0.68, placement), mix(-0.45, -0.04, story));
  gl_Position = vec4(projected, 0.0, 1.0);
  gl_PointSize = (1.5 + aParam.z*1.1) * uDpr * perspective;
  float shimmer = 0.9+0.1*sin(u*2.0-uTime*0.22+aParam.z*2.0);
  vAlpha = clamp(0.55+aParam.z*0.35+p.z*0.2, 0.35, 1.0)*shimmer;
  vColor = mix(vec3(0.52,0.66,0.95),vec3(0.94,0.97,1.0),aParam.z);
}`;

const fragmentSource = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float radius = length(gl_PointCoord-vec2(0.5))*2.0;
  if(radius > 1.0) discard;
  float alpha = pow(1.0-radius,1.1)*vAlpha;
  gl_FragColor = vec4(vColor,alpha);
}`;

export function QuantumSequence() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) { root.dataset.motion = "fallback"; return; }
    const shaders: WebGLShader[] = [];
    function shader(type: number, source: string) {
      const result = gl!.createShader(type);
      if (!result) throw new Error("Shader unavailable");
      shaders.push(result);
      gl!.shaderSource(result, source);
      gl!.compileShader(result);
      if (!gl!.getShaderParameter(result, gl!.COMPILE_STATUS)) throw new Error("Shader unavailable");
      return result;
    }
    const program = gl.createProgram();
    if (!program) { root.dataset.motion = "fallback"; return; }
    try {
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Program unavailable");
    } catch {
      root.dataset.motion = "fallback";
      shaders.forEach(value => gl.deleteShader(value));
      gl.deleteProgram(program);
      return;
    }
    const narrow = window.matchMedia("(max-width: 760px)");
    let mobile = narrow.matches;
    const count = 32000;
    const points = new Float32Array(count*3);
    let seed = 19;
    const random = () => { seed = (seed*16807)%2147483647; return seed/2147483647; };
    for (let i=0;i<count;i++) {
      points[i*3] = random()*Math.PI*2;
      points[i*3+1] = (random()-0.5)*0.62;
      points[i*3+2] = random();
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);
    gl.useProgram(program);
    const attribute = gl.getAttribLocation(program,"aParam");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute,3,gl.FLOAT,false,0,0);
    const time = gl.getUniformLocation(program,"uTime");
    const progressUniform = gl.getUniformLocation(program,"uProgress");
    const aspect = gl.getUniformLocation(program,"uAspect");
    const dprUniform = gl.getUniformLocation(program,"uDpr");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    gl.clearColor(0,0,0,0);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0, visible=true, disposed=false, contextLost=false, target=0, progress=0, frames=0, sampleStart=performance.now();
    const start=performance.now();
    const intro=root.querySelector<HTMLElement>(".quantum-intro");
    const story=root.querySelector<HTMLElement>(".quantum-story");
    const explore=root.querySelector<HTMLElement>(".explore-link");
    const resize = () => {
      mobile=narrow.matches;
      const stage=canvas.parentElement!;
      const dpr=Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
      canvas.width=Math.round(stage.clientWidth*dpr);
      canvas.height=Math.round(stage.clientHeight*dpr);
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform1f(aspect,stage.clientWidth/stage.clientHeight);
      gl.uniform1f(dprUniform,dpr);
    };
    const onScroll=() => {
      const distance=root.offsetHeight-window.innerHeight;
      target=distance>0 ? Math.max(0,Math.min(1,-root.getBoundingClientRect().top/distance)) : 0;
    };
    const draw=(now: number) => {
      frame=0;
      if(disposed || contextLost) return;
      const reduced=preference.matches;
      progress=reduced ? 0 : progress+(target-progress)*0.1;
      root.style.setProperty("--scene-progress",progress.toFixed(4));
      root.dataset.storyStage=String(Math.min(2,Math.max(0,Math.floor(progress*3))));
      if(intro) intro.inert=!reduced && progress>=0.22;
      if(story) story.inert=!reduced && progress<=0.23;
      if(explore) explore.inert=!reduced && progress>0.13;
      gl.uniform1f(time,reduced ? 0 : (now-start)/1000);
      gl.uniform1f(progressUniform,mobile ? 0 : progress);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS,0,mobile ? 14000 : count);
      frames++;
      if(now-sampleStart>1800) { canvas.dataset.fps=String(Math.round(frames*1000/(now-sampleStart))); sampleStart=now;frames=0; }
      if(!reduced && visible && !document.hidden) frame=requestAnimationFrame(draw);
    };
    const resume=() => { if(!frame && !disposed && !contextLost) frame=requestAnimationFrame(draw); };
    const onPreference=() => { if(contextLost) return; root.dataset.motion=preference.matches ? "reduced" : "ready"; onScroll();resume(); };
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();},{rootMargin:"100px"});
    observer.observe(root);
    const resizeObserver=new ResizeObserver(()=>{resize();onScroll();resume();});
    resizeObserver.observe(canvas.parentElement!);
    const onVisibility=()=>{if(!document.hidden)resume();};
    const onContextLost=(event: Event)=>{
      event.preventDefault();contextLost=true;root.dataset.motion="fallback";cancelAnimationFrame(frame);
      if(intro) intro.inert=false;
      if(story) story.inert=false;
      if(explore) explore.inert=false;
    };
    canvas.addEventListener("webglcontextlost",onContextLost);
    window.addEventListener("scroll",onScroll,{passive:true});
    preference.addEventListener("change",onPreference);
    document.addEventListener("visibilitychange",onVisibility);
    canvas.dataset.renderer="webgl";
    resize();onPreference();
    return () => {
      disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost",onContextLost);
      window.removeEventListener("scroll",onScroll);preference.removeEventListener("change",onPreference);
      document.removeEventListener("visibilitychange",onVisibility);
      gl.deleteBuffer(buffer);shaders.forEach(value=>gl.deleteShader(value));gl.deleteProgram(program);
    };
  },[]);

  return (
    <section ref={rootRef} className="quantum-sequence" aria-label="莫比乌斯：从企业应用到持续进化">
      <div className="quantum-stage">
        <Image className="quantum-poster" src="/company/mobius-particles.webp" alt="" width={1536} height={1024} sizes="100vw" preload quality={95} />
        <canvas ref={canvasRef} className="quantum-field" aria-hidden="true" />
        <div className="quantum-intro">
          <h1>让 AI 成为<br />企业的运行方式。</h1>
          <p>连接企业知识与业务系统，构建持续进化的 AI 应用。</p>
          <a className="primary-link" href="#contact">探讨业务场景<ArrowRight size={21} aria-hidden="true" /></a>
        </div>
        <div className="quantum-story">
          <h2>每一次实践，<br />都成为下一次的起点。</h2>
          <p>知识连接应用。应用产生反馈。<br />反馈推动下一轮进化。</p>
        </div>
        <a href="#technology" className="explore-link">向下探索<ArrowDown size={19} strokeWidth={1.1} aria-hidden="true" /></a>
        <div className="story-chapters" aria-hidden="true"><span>连接知识</span><i /><span>构建应用</span><i /><span>持续进化</span></div>
      </div>
      <noscript><style>{`.quantum-sequence{height:auto!important}.quantum-stage{position:relative!important;height:auto!important}.quantum-field{display:none}.quantum-intro{position:relative!important;top:auto!important;inset-inline:auto!important;margin-inline:24px;padding-top:140px;height:100svh;transform:none!important}.quantum-poster{top:40svh;bottom:auto;height:53svh}.quantum-story{position:relative!important;opacity:1!important;inset:auto!important;width:min(740px,calc(100% - 48px));margin-inline:auto;padding:80px 0 120px}.explore-link,.story-chapters{display:none!important}`}</style></noscript>
    </section>
  );
}
