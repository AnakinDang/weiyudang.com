import type { CompanyDirection } from "./company-content";

type Point = readonly [number, number];
export type FlowTrack = { samples: Float32Array; closed: boolean };

const TAU = Math.PI * 2;
const STEPS = 256;

function track(pointAt: (t: number) => Point, closed = false): FlowTrack {
  const points = Array.from({ length: STEPS + 1 }, (_, i) => pointAt(i / STEPS));
  const lengths = new Float32Array(STEPS + 1);
  for (let i = 1; i <= STEPS; i++) {
    lengths[i] = lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  const samples = new Float32Array((STEPS + 1) * 2);
  let segment = 1;
  for (let i = 0; i <= STEPS; i++) {
    const distance = lengths[STEPS] * i / STEPS;
    while (segment < STEPS && lengths[segment] < distance) segment++;
    const amount = (distance - lengths[segment - 1]) / (lengths[segment] - lengths[segment - 1] || 1);
    samples[i * 2] = points[segment - 1][0] + (points[segment][0] - points[segment - 1][0]) * amount;
    samples[i * 2 + 1] = points[segment - 1][1] + (points[segment][1] - points[segment - 1][1]) * amount;
  }
  return { samples, closed };
}

function orbit(x: number, y: number, rx: number, ry: number, rotation = 0): FlowTrack {
  return track(t => {
    const a = t * TAU;
    return [x + rx * Math.cos(a) * Math.cos(rotation) - ry * Math.sin(a) * Math.sin(rotation), y + rx * Math.cos(a) * Math.sin(rotation) + ry * Math.sin(a) * Math.cos(rotation)];
  }, true);
}

function curve(points: readonly Point[]): FlowTrack {
  return track(t => {
    const position = t * (points.length - 1);
    const i = Math.min(points.length - 2, Math.floor(position));
    const u = position - i, u2 = u * u, u3 = u2 * u;
    const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)];
    const coordinate = (axis: 0 | 1) => .5 * ((2 * b[axis]) + (-a[axis] + c[axis]) * u + (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * u2 + (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * u3);
    return [coordinate(0), coordinate(1)];
  });
}

/** Guides follow the production artwork, rather than replacing it with a dot cloud. */
export function quantumFlowTracks(direction: CompanyDirection["id"]): FlowTrack[] {
  switch (direction) {
    case "platform": return [
      orbit(.5, .23, .28, .058, -.23), orbit(.5, .43, .29, .063, -.12), orbit(.5, .59, .29, .064, -.06), orbit(.5, .77, .29, .066, -.08),
      curve([[.5,.27],[.35,.35],[.5,.45],[.62,.53],[.5,.62],[.36,.69],[.5,.78]])
    ];
    case "agents": return [
      curve([[.12,.18],[.23,.32],[.45,.43],[.66,.24],[.81,.21],[.8,.33],[.59,.43],[.47,.48],[.54,.61],[.43,.7],[.17,.81]]),
      curve([[.17,.83],[.32,.68],[.51,.61],[.54,.51],[.68,.51],[.87,.54]]),
      curve([[.12,.64],[.23,.52],[.4,.47],[.52,.5],[.63,.54],[.85,.56]])
    ];
    case "knowledge": return [
      orbit(.51,.5,.31,.18,-.4), orbit(.51,.49,.23,.32,.32), orbit(.51,.51,.33,.12,.52),
      curve([[.28,.34],[.4,.37],[.51,.49],[.62,.3],[.72,.27]]),
      curve([[.31,.68],[.42,.59],[.51,.49],[.66,.59],[.74,.63]])
    ];
    case "semantics": return [
      ...[.32,.43,.55,.66].map(y => curve([[.17,y+.06],[.5,y+.15],[.84,y+.02]])),
      ...[.34,.43,.5,.59,.68].map(x => curve([[x,.21+Math.abs(x-.5)*.3],[x,.82-Math.abs(x-.5)*.5]])),
      curve([[.12,.57],[.5,.67],[.91,.53]]), curve([[.18,.35],[.51,.44],[.86,.34]])
    ];
    case "voice": return [
      ...[0,1,2,3].map(i => track(t => [.1+t*.8, .55-t*.13+Math.sin(t*TAU*2.2+i*.3)*.044])),
      orbit(.51,.52,.43,.22,-.4)
    ];
    case "personalization": return [
      orbit(.51,.49,.32,.15,-.39), orbit(.51,.49,.26,.1,-.39),
      curve([[.19,.4],[.37,.43],[.5,.5],[.63,.53],[.76,.64]]),
      curve([[.19,.7],[.36,.61],[.5,.5],[.62,.37],[.74,.27]]),
      curve([[.19,.7],[.4,.75],[.77,.64],[.83,.4],[.74,.27],[.46,.31],[.19,.4]])
    ];
    case "capture": return [
      ...[.29,.42,.55,.68,.76].map((y,i) => curve([[.12,y],[.31,.46+i*.025],[.55,.51],[.68,.42+i*.045],[.85,.31+i*.065]]))
    ];
    case "improvement": return [
      orbit(.51,.51,.34,.19,-.38), orbit(.51,.51,.32,.17,-.38), orbit(.51,.51,.36,.2,-.38)
    ];
  }
}
