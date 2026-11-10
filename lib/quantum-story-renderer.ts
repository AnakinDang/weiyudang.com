import { quantumFlowTracks } from "./quantum-flow-paths";

const directions = ["knowledge", "agents", "semantics", "improvement"] as const;
export const storyImages = directions.map(direction => "/company/directions/" + direction + "-v4.webp");
const quadVertex = "attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=(aPosition+1.)*.5;gl_Position=vec4(aPosition,0.,1.);}";
const fieldFragment = "precision mediump float;uniform sampler2D uFrom;uniform sampler2D uTo;uniform float uMix;uniform float uTime;varying vec2 vUv;void main(){vec2 wave=vec2(sin(vUv.y*16.+uTime*.55),cos(vUv.x*14.-uTime*.4))*.0025;vec3 a=texture2D(uFrom,vUv+wave).rgb;vec3 b=texture2D(uTo,vUv+wave).rgb;vec3 c=mix(a,b,uMix);float density=smoothstep(.01,.13,c.b-c.r);float light=.5+.5*sin(vUv.x*22.+vUv.y*15.-uTime*.8);gl_FragColor=vec4(mix(c,c*vec3(.93,.97,1.01),density*light*.5),1.);}";
const pointVertex = "attribute vec4 aParticle;uniform float uDpr;varying float vAlpha;void main(){gl_Position=vec4(vec2(aParticle.x,1.-aParticle.y)*2.-1.,0.,1.);gl_PointSize=aParticle.z*uDpr;vAlpha=aParticle.w;}";
const pointFragment = "precision mediump float;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(mix(vec3(.25,.57,.87),vec3(.92,.98,1.),exp(-d*d*13.)),exp(-d*d*5.)*vAlpha);}";

export function startQuantumStory(canvas: HTMLCanvasElement, getProgress: () => number, report: (value: string) => void) {
  const root = canvas.parentElement!;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const tracks = directions.map(quantumFlowTracks);
  const shaders: WebGLShader[] = [], programs: WebGLProgram[] = [], buffers: WebGLBuffer[] = [], textures: WebGLTexture[] = [];
  const images: HTMLImageElement[] = [];
  const vertices = new Float32Array(480 * 4);
  let gl: WebGLRenderingContext | null = null, drawScene: ((time: number) => void) | undefined;
  let visible = false, paused = false, disposed = false, failed = false, ready = false, frame = 0, last = 0, elapsed = 0, dpr = 1;
  const canRun = () => ready && visible && !paused && !disposed && !failed && !preference.matches && !document.hidden;
  const sync = () => {
    report(failed ? "fallback" : preference.matches ? "reduced" : !ready ? "loading" : paused ? "paused" : !visible || document.hidden ? "offscreen" : "running");
    if (canRun()) { if (!frame) frame = requestAnimationFrame(draw); }
    else { cancelAnimationFrame(frame); frame = 0; last = 0; }
  };
  const draw = (now: number) => {
    frame = 0; if (!canRun()) return;
    const interval = root.clientWidth < 440 ? 1000 / 30 : 1000 / 60;
    if (last && now - last < interval - .5) { frame = requestAnimationFrame(draw); return; }
    elapsed += last ? (now - last) / 1000 : 0; last = now;
    drawScene?.(elapsed); frame = requestAnimationFrame(draw);
  };
  const resize = () => {
    if (!gl || failed || disposed) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(root.clientWidth * dpr)); canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height); if (ready) drawScene?.(elapsed);
  };
  function initialize() {
    if (gl || failed || disposed || preference.matches) return;
    gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) { failed = true; sync(); return; }
    const compile = (type: number, source: string) => {
      const shader = gl!.createShader(type); if (!shader) throw new Error("shader");
      shaders.push(shader); gl!.shaderSource(shader, source); gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error("shader");
      return shader;
    };
    const program = (vertex: string, fragment: string) => {
      const value = gl!.createProgram(); if (!value) throw new Error("program");
      programs.push(value); gl!.attachShader(value, compile(gl!.VERTEX_SHADER, vertex)); gl!.attachShader(value, compile(gl!.FRAGMENT_SHADER, fragment)); gl!.linkProgram(value);
      if (!gl!.getProgramParameter(value, gl!.LINK_STATUS)) throw new Error("program"); return value;
    };
    try {
      const field = program(quadVertex, fieldFragment), points = program(pointVertex, pointFragment);
      const quad = gl.createBuffer(), dots = gl.createBuffer();
      if (!quad || !dots) { gl.deleteBuffer(quad); gl.deleteBuffer(dots); throw new Error("buffers"); }
      buffers.push(quad, dots);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, dots); gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.DYNAMIC_DRAW);
      const fieldPosition = gl.getAttribLocation(field, "aPosition"), pointPosition = gl.getAttribLocation(points, "aParticle");
      const fromUniform = gl.getUniformLocation(field, "uFrom"), toUniform = gl.getUniformLocation(field, "uTo"), mixUniform = gl.getUniformLocation(field, "uMix"), timeUniform = gl.getUniformLocation(field, "uTime"), pointDpr = gl.getUniformLocation(points, "uDpr");
      let loaded = 0;
      storyImages.forEach(src => {
        const texture = gl!.createTexture(); if (!texture) throw new Error("texture"); textures.push(texture);
        const image = new Image(); images.push(image);
        image.onload = () => {
          if (disposed || failed || !gl) return;
          try {
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            loaded++; if (loaded === storyImages.length) { ready = true; canvas.dataset.renderer = "webgl-story-morph"; resize(); sync(); }
          } catch { failed = true; sync(); }
        };
        image.onerror = () => { failed = true; sync(); }; image.src = src;
      });
      drawScene = time => {
        if (!gl || !ready) return;
        const progress = Math.max(0, Math.min(3, getProgress()));
        const from = Math.min(2, Math.floor(progress)), to = from + 1, raw = progress - from, mix = raw * raw * (3 - 2 * raw);
        canvas.dataset.progress = progress.toFixed(3);
        gl.disable(gl.BLEND); gl.useProgram(field);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.enableVertexAttribArray(fieldPosition); gl.vertexAttribPointer(fieldPosition, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[from]); gl.uniform1i(fromUniform, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[to]); gl.uniform1i(toUniform, 1);
        gl.uniform1f(mixUniform, mix); gl.uniform1f(timeUniform, time); gl.drawArrays(gl.TRIANGLES, 0, 6);
        for (let i = 0; i < 480; i++) {
          const t = (i * .61803398875 + time * (.025 + (i % 7) * .003)) % 1;
          const position = t * 256, at = Math.floor(position), blend = position - at;
          const a = tracks[from][i % tracks[from].length].samples, b = tracks[to][i % tracks[to].length].samples;
          const ax = a[at * 2] + (a[(at + 1) * 2] - a[at * 2]) * blend, ay = a[at * 2 + 1] + (a[(at + 1) * 2 + 1] - a[at * 2 + 1]) * blend;
          const bx = b[at * 2] + (b[(at + 1) * 2] - b[at * 2]) * blend, by = b[at * 2 + 1] + (b[(at + 1) * 2 + 1] - b[at * 2 + 1]) * blend;
          const spread = (i % 17 === 0 ? .002 : .014) * Math.sin(time * .3 + i);
          vertices[i * 4] = ax + (bx - ax) * mix + spread; vertices[i * 4 + 1] = ay + (by - ay) * mix + spread * .6;
          vertices[i * 4 + 2] = i % 17 === 0 ? 8 : 1.3 + i % 4 * .55;
          vertices[i * 4 + 3] = (i % 17 === 0 ? .9 : .28) * Math.min(1, t * 12, (1 - t) * 12);
        }
        gl.useProgram(points); gl.bindBuffer(gl.ARRAY_BUFFER, dots); gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        gl.enableVertexAttribArray(pointPosition); gl.vertexAttribPointer(pointPosition, 4, gl.FLOAT, false, 0, 0); gl.uniform1f(pointDpr, dpr);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.drawArrays(gl.POINTS, 0, 480);
      };
    } catch { failed = true; sync(); }
  }
  const onPreference = () => { if (visible && !preference.matches) initialize(); sync(); };
  const onVisibility = () => sync();
  const onLost = (event: Event) => { event.preventDefault(); failed = true; sync(); };
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) initialize(); sync(); }, { threshold: .01 });
  const sizing = new ResizeObserver(resize);
  intersection.observe(root); sizing.observe(root); preference.addEventListener("change", onPreference); document.addEventListener("visibilitychange", onVisibility); canvas.addEventListener("webglcontextlost", onLost); sync();
  return {
    refresh() { if (ready && visible && !preference.matches && !failed && !document.hidden) drawScene?.(elapsed); },
    setPaused(value: boolean) { paused = value; sync(); },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); intersection.disconnect(); sizing.disconnect();
      preference.removeEventListener("change", onPreference); document.removeEventListener("visibilitychange", onVisibility); canvas.removeEventListener("webglcontextlost", onLost);
      images.forEach(image => { image.onload = null; image.onerror = null; });
      if (gl) { textures.forEach(value => gl!.deleteTexture(value)); buffers.forEach(value => gl!.deleteBuffer(value)); programs.forEach(value => gl!.deleteProgram(value)); shaders.forEach(value => gl!.deleteShader(value)); }
    }
  };
}
