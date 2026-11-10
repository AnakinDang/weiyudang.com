"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const vertexSource = "attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=(aPosition+1.0)*0.5;gl_Position=vec4(aPosition,0.0,1.0);}";
const fragmentSource = [
  "precision mediump float;",
  "uniform sampler2D uImage; uniform vec4 uFit; uniform float uTime; uniform float uScroll; uniform vec2 uPointer;",
  "varying vec2 vUv;",
  "void main(){",
  "vec2 uv=(vUv-uFit.zw)/uFit.xy;",
  "uv=(uv-0.5)/(1.01+uScroll*0.025)+0.5;",
  "uv+=uPointer*0.002;",
  "if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){gl_FragColor=vec4(0.02745,0.03529,0.05490,1.0);return;}",
  "vec2 wave=vec2(sin(uv.y*15.0+uTime*0.2),cos(uv.x*12.0-uTime*0.16))*0.0013;",
  "vec3 color=texture2D(uImage,uv+wave).rgb;",
  "float light=1.0+0.035*sin(uTime*0.45+uv.x*22.0-uv.y*29.0);",
  "gl_FragColor=vec4(color*light,1.0);",
  "}"
].join("\n");

export function QuantumHero({ work = false }: { work?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) root.dataset.motion = "reduced";
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) { root.dataset.motion = "fallback"; return; }
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    if (!program) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unavailable shader");
      shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Unavailable shader");
      return shader;
    };
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource)); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Unavailable program");
    } catch {
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program);
      root.dataset.motion = "fallback"; return;
    }
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!buffer || !texture) {
      gl.deleteBuffer(buffer); gl.deleteTexture(texture);
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fit = gl.getUniformLocation(program,"uFit");
    const time = gl.getUniformLocation(program,"uTime");
    const scroll = gl.getUniformLocation(program,"uScroll");
    const pointer = gl.getUniformLocation(program,"uPointer");
    const artwork = new window.Image();
    let ready=false, disposed=false, lost=false, frame=0, visible=true, lastDraw=0;
    let targetX=0, targetY=0, mouseX=0, mouseY=0;
    const start=performance.now();
    const resize=() => {
      if (!ready || disposed || lost) return;
      const box=canvas.parentElement!;
      const dpr=Math.min(devicePixelRatio || 1,1.5);
      canvas.width=Math.round(box.clientWidth*dpr); canvas.height=Math.round(box.clientHeight*dpr);
      gl.viewport(0,0,canvas.width,canvas.height);
      const ratio=artwork.naturalWidth/artwork.naturalHeight;
      const container=box.clientWidth/box.clientHeight;
      const sx=container>ratio ? ratio/container : 1;
      const sy=container>ratio ? 1 : container/ratio;
      gl.uniform4f(fit,sx,sy,1-sx,(1-sy)*0.5);
    };
    const draw=(now: number) => {
      frame=0;
      if(disposed || lost || !ready || preference.matches) return;
      if(now-lastDraw<1000/60-0.5) { frame=requestAnimationFrame(draw); return; }
      lastDraw=now;
      mouseX+=(targetX-mouseX)*0.045; mouseY+=(targetY-mouseY)*0.045;
      const progress=Math.max(0,Math.min(1,-root.getBoundingClientRect().top/root.offsetHeight));
      gl.uniform1f(time,(now-start)/1000); gl.uniform1f(scroll,progress); gl.uniform2f(pointer,mouseX,mouseY);
      gl.drawArrays(gl.TRIANGLES,0,6);
      if(visible && !document.hidden) frame=requestAnimationFrame(draw);
    };
    const resume=() => { if(!frame && ready && !disposed && !lost && !preference.matches) frame=requestAnimationFrame(draw); };
    const onPreference=() => {
      root.dataset.motion=preference.matches ? "reduced" : lost ? "fallback" : ready ? "ready" : "loading";
      if(preference.matches) { cancelAnimationFrame(frame);frame=0; } else resume();
    };
    const onMove=(event: PointerEvent) => {
      if(event.pointerType!=="mouse") return;
      const bounds=root.getBoundingClientRect();
      targetX=(event.clientX-bounds.left)/bounds.width-0.5; targetY=(event.clientY-bounds.top)/bounds.height-0.5;
    };
    const onLeave=() => {targetX=0;targetY=0;};
    const onVisibility=() => {if(!document.hidden)resume();};
    const onLost=(event: Event) => {event.preventDefault();lost=true;root.dataset.motion="fallback";cancelAnimationFrame(frame);frame=0;};
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting && entries[0].intersectionRatio>.1;if(visible)resume();},{threshold:.1});
    observer.observe(root);
    const resizeObserver=new ResizeObserver(()=>{resize();resume();});resizeObserver.observe(canvas.parentElement!);
    preference.addEventListener("change",onPreference); root.addEventListener("pointermove",onMove);
    root.addEventListener("pointerleave",onLeave);document.addEventListener("visibilitychange",onVisibility);
    canvas.addEventListener("webglcontextlost",onLost);
    artwork.onload=() => {
      if(disposed || lost) return;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,artwork);
      ready=true;canvas.dataset.renderer="webgl";resize();onPreference();resume();
    };
    artwork.onerror=() => {root.dataset.motion="fallback";};
    artwork.src="/company/quantum-ribbon-v3.webp";
    return () => {
      disposed=true;artwork.onload=null;artwork.onerror=null;cancelAnimationFrame(frame);
      observer.disconnect();resizeObserver.disconnect();preference.removeEventListener("change",onPreference);
      root.removeEventListener("pointermove",onMove);root.removeEventListener("pointerleave",onLeave);
      document.removeEventListener("visibilitychange",onVisibility);canvas.removeEventListener("webglcontextlost",onLost);
      gl.deleteBuffer(buffer);gl.deleteTexture(texture);shaders.forEach(shader=>gl.deleteShader(shader));gl.deleteProgram(program);
    };
  },[]);
  return (
    <section ref={rootRef} className={"quantum-hero" + (work ? " work-index-hero" : "")} aria-label={work ? "演示案例" : "莫比乌斯愿景"}>
      <div className="hero-art" aria-hidden="true">
        <Image className="hero-art-image" src="/company/quantum-ribbon-v3.webp" fill sizes="100vw" preload unoptimized alt="" />
        <canvas ref={canvasRef} />
      </div>
      <div className="wrap hero-content">
        <div className="hero-copy">
          <h1>{work ? <>从一个任务，<br />看到系统如何工作。</> : <>让智能，<br />重塑世界的<br className="mobile-title-break" />运行方式。</>}</h1>
          <p>{work ? "用示例资料，体验从输入到可复核结果的完整流程。" : "我们相信，智能将成为组织持续进化的基础。莫比乌斯连接知识、人的判断与业务行动，构建能够在真实世界中运行、协作和改进的 AI 系统。"}</p>
          {work ? <p className="work-demo-note">交互演示 · 示例数据</p> : <a className="primary-link" href="#contact">开启对话<ArrowRight size={23} strokeWidth={1.1} aria-hidden="true" /></a>}
        </div>
      </div>
      {!work && <div className="hero-footnote wrap"><p>知识不断流动，行动彼此连接，进化从未停止。</p><a href="#evolution">探索我们的工作<ArrowRight size={18} strokeWidth={1.1} aria-hidden="true" /></a></div>}
    </section>
  );
}
