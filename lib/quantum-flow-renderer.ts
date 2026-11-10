import type { CompanyDirection } from "./company-content";
import { quantumFlowTracks } from "./quantum-flow-paths";

export type QuantumMotionState = "loading" | "running" | "paused" | "offscreen" | "reduced" | "fallback";

const imageVertex = `attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=(aPosition+1.0)*.5;gl_Position=vec4(aPosition,0.,1.);}`;
const imageFragment = `precision mediump float;
uniform sampler2D uImage; uniform float uTime; uniform float uVariant; uniform vec2 uPointer;
varying vec2 vUv;
void main(){
  vec2 uv=vUv+uPointer*.008;
  vec2 p=uv-.5;
  float theta=atan(p.y,p.x);
  float phase=theta*3.-uTime*.7+length(p)*16.;
  if(uVariant<.5) phase=uv.y*24.-uTime*1.2+sin(uv.x*9.);
  if(uVariant>2.5&&uVariant<3.5) phase=(uv.x+uv.y)*32.-uTime*1.4;
  if(uVariant>3.5&&uVariant<4.5) phase=uv.x*30.-uTime*2.2;
  if(uVariant>5.5&&uVariant<6.5) phase=uv.x*20.-uTime*1.7;
  vec2 wave=vec2(sin(uv.y*17.+uTime*.65),cos(uv.x*14.-uTime*.5));
  if(uVariant>2.5&&uVariant<3.5) wave*=.16;
  vec3 source=texture2D(uImage,uv+wave*.0035).rgb;
  float density=smoothstep(.008,.14,source.b-source.r);
  float light=.5+.5*sin(phase);
  vec3 color=mix(source,source*vec3(.89,.95,1.015),density*light*.65);
  gl_FragColor=vec4(color,1.);
}`;
const pointVertex = `attribute vec4 aParticle; uniform float uDpr; uniform vec2 uPointer;
varying float vAlpha; varying vec2 vUv;
void main(){
  vUv=vec2(aParticle.x,1.-aParticle.y);
  vec2 p=vUv-uPointer*.008;
  gl_Position=vec4(p*2.-1.,0.,1.); gl_PointSize=aParticle.z*uDpr; vAlpha=aParticle.w;
}`;
const pointFragment = `precision mediump float;
uniform sampler2D uImage; varying float vAlpha; varying vec2 vUv;
void main(){
  float d=length(gl_PointCoord-.5)*2.; if(d>1.) discard;
  vec3 source=texture2D(uImage,vUv).rgb;
  float density=smoothstep(.008,.1,source.b-source.r);
  float alpha=exp(-d*d*4.5)*vAlpha*(.32+density*.68);
  vec3 color=mix(vec3(.35,.67,.97),vec3(.97,.995,1.),exp(-d*d*16.));
  gl_FragColor=vec4(color,alpha);
}`;
const variants = ["platform", "agents", "knowledge", "semantics", "voice", "personalization", "capture", "improvement"];

export function startQuantumFlow(canvas: HTMLCanvasElement, src: string, direction: CompanyDirection["id"], report: (state: QuantumMotionState) => void) {
  const root = canvas.parentElement!;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const tracks = quantumFlowTracks(direction);
  const shaders: WebGLShader[] = [];
  const programs: WebGLProgram[] = [];
  const buffers: WebGLBuffer[] = [];
  const particles = 288;
  const vertices = new Float32Array(particles * 4);
  const seeds = Array.from({ length: particles }, (_, i) => ({
    track: i % tracks.length, phase: (i * .61803398875) % 1,
    speed: .035 + ((i * .371) % 1) * .025,
    spread: ((i * .719) % 1 - .5) * (i % 13 === 0 ? .004 : .024),
    bright: i % 13 === 0
  }));
  const image = new window.Image();
  let gl: WebGLRenderingContext | null = null;
  let texture: WebGLTexture | null = null;
  let frame = 0, ready = false, visible = false, paused = false, disposed = false, failed = false;
  let elapsed = 0, lastDraw = 0, dpr = 1, targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
  let drawScene: ((time: number) => void) | undefined;

  const canRun = () => ready && visible && !paused && !preference.matches && !document.hidden && !disposed && !failed;
  const state = (): QuantumMotionState => failed ? "fallback" : preference.matches ? "reduced" : !ready ? "loading" : paused ? "paused" : !visible || document.hidden ? "offscreen" : "running";
  const stop = () => { cancelAnimationFrame(frame); frame = 0; lastDraw = 0; };
  const draw = (now: number) => {
    frame = 0;
    if (!canRun()) return;
    const interval = root.clientWidth < 440 ? 1000 / 30 : 1000 / 60;
    if (lastDraw && now - lastDraw < interval - .5) { frame = requestAnimationFrame(draw); return; }
    elapsed += lastDraw ? (now - lastDraw) / 1000 : 0;
    lastDraw = now;
    pointerX += (targetX - pointerX) * .05; pointerY += (targetY - pointerY) * .05;
    drawScene?.(elapsed);
    frame = requestAnimationFrame(draw);
  };
  const sync = () => {
    report(state());
    if (canRun()) { if (!frame) frame = requestAnimationFrame(draw); }
    else stop();
  };
  const resize = () => {
    if (!gl || failed) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (ready) drawScene?.(elapsed);
  };
  const compile = (type: number, source: string) => {
    const shader = gl!.createShader(type);
    if (!shader) throw new Error("Shader unavailable");
    shaders.push(shader); gl!.shaderSource(shader, source); gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error("Shader unavailable");
    return shader;
  };
  const program = (vertex: string, fragment: string) => {
    const value = gl!.createProgram();
    if (!value) throw new Error("Program unavailable");
    programs.push(value); gl!.attachShader(value, compile(gl!.VERTEX_SHADER, vertex)); gl!.attachShader(value, compile(gl!.FRAGMENT_SHADER, fragment)); gl!.linkProgram(value);
    if (!gl!.getProgramParameter(value, gl!.LINK_STATUS)) throw new Error("Program unavailable");
    return value;
  };
  const initialize = () => {
    if (gl || failed || disposed || preference.matches) return;
    gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) { failed = true; sync(); return; }
    try {
      const field = program(imageVertex, imageFragment), points = program(pointVertex, pointFragment);
      const quad = gl.createBuffer(), dots = gl.createBuffer(); texture = gl.createTexture();
      if (!quad || !dots || !texture) { gl.deleteBuffer(quad); gl.deleteBuffer(dots); throw new Error("Buffer unavailable"); }
      buffers.push(quad, dots);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, dots); gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.DYNAMIC_DRAW);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fieldPosition = gl.getAttribLocation(field, "aPosition"), pointPosition = gl.getAttribLocation(points, "aParticle");
      const time = gl.getUniformLocation(field, "uTime"), variant = gl.getUniformLocation(field, "uVariant");
      const fieldPointer = gl.getUniformLocation(field, "uPointer"), pointPointer = gl.getUniformLocation(points, "uPointer"), pointDpr = gl.getUniformLocation(points, "uDpr");
      image.onload = () => {
        if (disposed || failed || !gl) return;
        try {
          gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          resize(); drawScene?.(elapsed); ready = true; canvas.dataset.renderer = "webgl-particles"; sync();
        } catch { failed = true; sync(); }
      };
      image.onerror = () => { failed = true; sync(); };
      drawScene = timeValue => {
        if (!gl) return;
        gl.disable(gl.BLEND); gl.useProgram(field);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.enableVertexAttribArray(fieldPosition); gl.vertexAttribPointer(fieldPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(time, timeValue); gl.uniform1f(variant, variants.indexOf(direction)); gl.uniform2f(fieldPointer, pointerX, pointerY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        for (let i = 0; i < particles; i++) {
          const seed = seeds[i], guide = tracks[seed.track];
          const t = (seed.phase + timeValue * seed.speed) % 1, at = t * 256, index = Math.floor(at), fraction = at - index;
          const x = guide.samples[index * 2] + (guide.samples[(index + 1) * 2] - guide.samples[index * 2]) * fraction;
          const y = guide.samples[index * 2 + 1] + (guide.samples[(index + 1) * 2 + 1] - guide.samples[index * 2 + 1]) * fraction;
          const drift = Math.sin(t * 19 + i) * seed.spread;
          vertices[i * 4] = x + drift; vertices[i * 4 + 1] = y + Math.cos(t * 17 + i) * seed.spread;
          vertices[i * 4 + 2] = seed.bright ? 8 : 1.2 + (i % 5) * .55;
          vertices[i * 4 + 3] = (seed.bright ? .95 : .3 + .3 * Math.sin(t * 13 + i) ** 2) * (guide.closed ? 1 : Math.min(1, t * 12, (1 - t) * 12));
        }
        gl.useProgram(points); gl.bindBuffer(gl.ARRAY_BUFFER, dots); gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        gl.enableVertexAttribArray(pointPosition); gl.vertexAttribPointer(pointPosition, 4, gl.FLOAT, false, 0, 0);
        gl.uniform1f(pointDpr, dpr); gl.uniform2f(pointPointer, pointerX, pointerY);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.drawArrays(gl.POINTS, 0, particles);
      };
      image.src = src;
    } catch { failed = true; sync(); }
  };
  const onPreference = () => { if (!preference.matches && visible) initialize(); sync(); };
  const onVisibility = () => sync();
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const bounds = root.getBoundingClientRect(); targetX = (event.clientX - bounds.left) / bounds.width - .5; targetY = (event.clientY - bounds.top) / bounds.height - .5;
  };
  const onLeave = () => { targetX = 0; targetY = 0; };
  const onLost = (event: Event) => { event.preventDefault(); failed = true; sync(); };
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio > .08;
    if (visible) initialize(); sync();
  }, { threshold: [.08] });
  const sizing = new ResizeObserver(() => { resize(); sync(); });
  intersection.observe(root); sizing.observe(root);
  preference.addEventListener("change", onPreference); document.addEventListener("visibilitychange", onVisibility);
  root.addEventListener("pointermove", onMove); root.addEventListener("pointerleave", onLeave); canvas.addEventListener("webglcontextlost", onLost);
  sync();
  return {
    setPaused(value: boolean) { paused = value; sync(); },
    dispose() {
      disposed = true; stop(); intersection.disconnect(); sizing.disconnect(); image.onload = null; image.onerror = null;
      preference.removeEventListener("change", onPreference); document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointermove", onMove); root.removeEventListener("pointerleave", onLeave); canvas.removeEventListener("webglcontextlost", onLost);
      if (gl) { buffers.forEach(buffer => gl!.deleteBuffer(buffer)); shaders.forEach(shader => gl!.deleteShader(shader)); programs.forEach(value => gl!.deleteProgram(value)); gl.deleteTexture(texture); }
    }
  };
}
