/**
 * Renders the invitation's physical-looking assets (wax seal, paper, petals)
 * from height maps + lighting, so no stock or paid imagery is needed.
 *
 *   node scripts/generate-textures.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = new URL("../public/images/textures/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const outPath = (name) => decodeURIComponent(OUT.pathname.replace(/^\/([A-Za-z]:)/, "$1")) + name;

/* ------------------------------------------------------------------ */
/* Maths helpers                                                       */
/* ------------------------------------------------------------------ */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const mixRgb = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

function hash(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Value noise that wraps every `period` cells, so textures tile seamlessly. */
function noise(x, y, period, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const w = (v) => ((v % period) + period) % period;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return mix(
    mix(hash(w(xi), w(yi), seed), hash(w(xi + 1), w(yi), seed), u),
    mix(hash(w(xi), w(yi + 1), seed), hash(w(xi + 1), w(yi + 1), seed), u),
    v,
  );
}

function fbm(x, y, period, seed, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * f, y * f, period * f, seed + i * 17);
    amp *= 0.5;
    f *= 2;
  }
  return sum / (1 - 0.5 ** octaves);
}

const normalize = ([x, y, z]) => {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/* ------------------------------------------------------------------ */
/* Paper                                                               */
/* ------------------------------------------------------------------ */
async function paper(name, base, { grain, fibre, mottle, fleck, seed }) {
  const S = 512;
  const height = new Float32Array(S * S);

  // Individual cotton fibres scattered across the sheet.
  const strands = new Float32Array(S * S);
  let r = seed;
  const rand = () => hash(r++, seed, 91);
  for (let i = 0; i < 2600; i++) {
    let x = rand() * S;
    let y = rand() * S;
    let angle = rand() * Math.PI * 2;
    const len = 6 + rand() * 22;
    const tone = rand() > 0.5 ? 1 : -1;
    for (let s = 0; s < len; s++) {
      angle += (rand() - 0.5) * 0.5;
      x += Math.cos(angle);
      y += Math.sin(angle);
      const idx = ((Math.floor(y) + S) % S) * S + ((Math.floor(x) + S) % S);
      strands[idx] = tone * Math.sin((s / len) * Math.PI);
    }
  }

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = y * S + x;
      height[i] =
        fbm((x / S) * 96, (y / S) * 96, 96, seed, 3) * 1.5 +
        fbm((x / S) * 24, (y / S) * 24, 24, seed + 3, 3) * 1.1 +
        strands[i] * 0.22;
    }
  }

  const light = normalize([-0.6, -0.7, 0.75]);
  const buf = Buffer.alloc(S * S * 3);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = y * S + x;
      const dx = height[y * S + ((x + 1) % S)] - height[y * S + ((x - 1 + S) % S)];
      const dy = height[((y + 1) % S) * S + x] - height[((y - 1 + S) % S) * S + x];
      const n = normalize([-dx * grain, -dy * grain, 1]);
      const shade = dot(n, light) - light[2];
      const m = (fbm((x / S) * 5, (y / S) * 5, 5, seed + 9) - 0.5) * mottle;
      const speck = hash(x, y, seed + 5) - 0.5;
      for (let c = 0; c < 3; c++) {
        buf[i * 3 + c] = clamp(
          base[c] * (1 + shade * 0.16 + m + speck * fleck) + strands[i] * fibre,
          0,
          255,
        );
      }
    }
  }
  await sharp(buf, { raw: { width: S, height: S, channels: 3 } })
    .webp({ quality: 82 })
    .toFile(outPath(name));
}

/* ------------------------------------------------------------------ */
/* Gold wax seal                                                       */
/* ------------------------------------------------------------------ */
async function waxSeal() {
  const S = 720;
  const C = S / 2;

  // Lotus emblem + beaded ring, drawn as a mask and softened into relief.
  const petal = (angle, len, width, y = 40) =>
    `<path d="M0 ${y} C ${width} ${y - len * 0.35}, ${width * 0.75} ${y - len * 0.75}, 0 ${y - len}
      C ${-width * 0.75} ${y - len * 0.75}, ${-width} ${y - len * 0.35}, 0 ${y} Z"
      transform="rotate(${angle} 0 ${y})" fill="white" stroke="black" stroke-width="5"/>`;
  const beads = Array.from({ length: 44 }, (_, i) => {
    const a = (i / 44) * Math.PI * 2;
    return `<circle cx="${Math.cos(a) * 178}" cy="${Math.sin(a) * 178}" r="7.5" fill="white"/>`;
  }).join("");
  const emblem = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
    <rect width="100%" height="100%" fill="black"/>
    <g transform="translate(${C} ${C})">
      ${beads}
      <circle r="158" fill="none" stroke="white" stroke-width="3.5"/>
      <g transform="translate(0 28) scale(1.08)">
        ${petal(-82, 112, 30)}${petal(82, 112, 30)}
        ${petal(-55, 132, 38)}${petal(55, 132, 38)}
        ${petal(-28, 150, 42)}${petal(28, 150, 42)}
        ${petal(0, 168, 44)}
        <path d="M-92 56 C -50 92, -18 70, 0 56 C 18 70, 50 92, 92 56 C 56 56, 26 44, 0 44 C -26 44, -56 56, -92 56 Z" fill="white"/>
        <circle cy="86" r="7" fill="white"/><circle cx="-26" cy="82" r="4.5" fill="white"/><circle cx="26" cy="82" r="4.5" fill="white"/>
      </g>
    </g>
  </svg>`;

  const relief = async (blur) =>
    sharp(Buffer.from(emblem)).blur(blur).extractChannel(0).raw().toBuffer();
  const fine = await relief(1.6);
  const soft = await relief(6);

  // Irregular molten edge.
  const edgeRadius = (a) => {
    const x = Math.cos(a) * 2.2 + 4;
    const y = Math.sin(a) * 2.2 + 4;
    return (
      300 +
      (fbm(x, y, 64, 41, 3) - 0.5) * 62 +
      Math.sin(a * 3 + 1.3) * 5 +
      Math.sin(a * 7 + 0.4) * 2.5
    );
  };

  const height = new Float32Array(S * S);
  const alpha = new Float32Array(S * S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = y * S + x;
      const dx = x - C;
      const dy = y - C;
      const d = Math.hypot(dx, dy);
      const R = edgeRadius(Math.atan2(dy, dx));
      alpha[i] = clamp(R - d + 0.5);
      if (d > R + 2) continue;

      // Rounded meniscus at the edge, a raised lip, then the pressed face.
      const edge = clamp((R - d) / 52);
      let h = Math.sqrt(clamp(1 - (1 - edge) ** 2)) * 30;
      const lip = Math.exp(-(((d - 226) / 20) ** 2)) * 17;
      const press = smooth(214, 196, d) * 15;
      const flow = (fbm(x / 95, y / 95, 64, 7, 4) - 0.5) * 11 * smooth(190, 260, d);
      h += lip - press + flow;
      h += (soft[i] / 255) * 9 + (fine[i] / 255) * 6.5;
      h += (fbm(x / 9, y / 9, 128, 23, 3) - 0.5) * 0.9;
      height[i] = h;
    }
  }

  const key = normalize([-0.55, -0.72, 0.58]);
  const fill = normalize([0.8, 0.35, 0.5]);
  const half = (l) => normalize([l[0], l[1], l[2] + 1]);
  const hKey = half(key);
  const hFill = half(fill);

  const buf = Buffer.alloc(S * S * 4);
  for (let y = 1; y < S - 1; y++) {
    for (let x = 1; x < S - 1; x++) {
      const i = y * S + x;
      if (alpha[i] <= 0) continue;
      const gx = (height[i + 1] - height[i - 1]) * 0.5;
      const gy = (height[i + S] - height[i - S]) * 0.5;
      const n = normalize([-gx * 1.25, -gy * 1.25, 1]);

      // Cheap ambient occlusion: pixels lower than their neighbourhood darken.
      let around = 0;
      for (const [ox, oy] of [[7, 0], [-7, 0], [0, 7], [0, -7], [5, 5], [-5, -5], [5, -5], [-5, 5]]) {
        const xx = clamp(x + ox, 0, S - 1);
        const yy = clamp(y + oy, 0, S - 1);
        around += height[yy * S + xx];
      }
      const ao = clamp(1 - Math.max(0, around / 8 - height[i]) * 0.11, 0.45, 1);

      // Fake environment reflection gives the metallic banding.
      const reflectY = 2 * n[2] * n[1];
      const env = smooth(0.35, -0.75, reflectY);
      const diffuse = clamp(dot(n, key));
      const t = clamp(diffuse * 0.62 + env * 0.42);

      let rgb =
        t < 0.5
          ? mixRgb([74, 44, 8], [168, 120, 40], t / 0.5)
          : mixRgb([168, 120, 40], [232, 196, 108], (t - 0.5) / 0.5);

      const spec =
        clamp(dot(n, hKey)) ** 38 * 0.95 + clamp(dot(n, hFill)) ** 22 * 0.35;
      const rim = (1 - n[2]) ** 2 * clamp(dot(n, fill)) * 0.8;
      rgb = mixRgb(rgb, [255, 244, 200], clamp(spec + rim * 0.5));
      const patina = 1 - (fbm(x / 60, y / 60, 64, 77, 4) - 0.5) * 0.28;

      buf[i * 4] = clamp(rgb[0] * ao * patina, 0, 255);
      buf[i * 4 + 1] = clamp(rgb[1] * ao * patina, 0, 255);
      buf[i * 4 + 2] = clamp(rgb[2] * ao * patina, 0, 255);
      buf[i * 4 + 3] = alpha[i] * 255;
    }
  }
  await sharp(buf, { raw: { width: S, height: S, channels: 4 } })
    .resize(520, 520)
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outPath("wax-seal.webp"));
}

/* ------------------------------------------------------------------ */
/* Petals & blossoms (rendered 3x then downsampled for soft edges)      */
/* ------------------------------------------------------------------ */

/** Colour of one petal at local coords: v runs base(0) → tip(1), u is -1..1. */
function petalSample(u, v, spec) {
  if (v <= 0 || v >= 1) return null;
  const half = spec.width(v);
  const s = u / half;
  if (Math.abs(s) >= 1) return null;
  let rgb = mixRgb(spec.base, spec.mid, smooth(0.05, 0.55, v));
  rgb = mixRgb(rgb, spec.tip, smooth(0.55, 1, v));
  const cup = 1 + (spec.tilt * s - s * s * 0.5) * 0.22; // curvature shading
  const crease = 1 - Math.exp(-((s * 9) ** 2)) * 0.09 * (1 - v);
  const veins =
    1 + (noise(s * 11 + 20, v * 2.5, 64, spec.seed) - 0.5) * 0.11 * smooth(0, 0.35, v);
  const grain = 1 + (noise(u * 70 + 50, v * 70, 256, spec.seed + 2) - 0.5) * 0.05;
  const shine = Math.exp(-(((s + 0.45) / 0.3) ** 2) - ((v - 0.68) / 0.22) ** 2) * 28;
  const k = cup * crease * veins * grain;
  const edge = smooth(1, 0.9, Math.abs(s));
  return {
    rgb: [rgb[0] * k + shine, rgb[1] * k + shine, rgb[2] * k + shine],
    a: edge * spec.opacity,
  };
}

async function renderSprite(name, size, shade) {
  const S = size * 3;
  const buf = Buffer.alloc(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const p = shade((x / S) * 2 - 1, (y / S) * 2 - 1);
      if (!p) continue;
      const i = (y * S + x) * 4;
      buf[i] = clamp(p.rgb[0], 0, 255);
      buf[i + 1] = clamp(p.rgb[1], 0, 255);
      buf[i + 2] = clamp(p.rgb[2], 0, 255);
      buf[i + 3] = clamp(p.a) * 255;
    }
  }
  await sharp(buf, { raw: { width: S, height: S, channels: 4 } })
    .resize(size, size)
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(outPath(name));
}

const loosePetal = (spec) => (x, y) => {
  const v = (0.92 - y) / 1.84;
  const bend = Math.sin(v * Math.PI) * spec.bend;
  return petalSample((x - bend) / 0.92, v, spec);
};

/** Five-petalled araliya (frangipani) with overlapping, rotated petals. */
const frangipani = (x, y) => {
  let out = null;
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + 0.25;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const lx = x * c + y * s;
    const ly = -x * s + y * c;
    const v = -ly / 0.96;
    const p = petalSample(lx - Math.sin(v * Math.PI * 0.9) * 0.1, v, {
      base: [236, 160, 20],
      mid: [255, 226, 128],
      tip: [255, 251, 240],
      width: (t) => 0.4 * Math.sin(Math.PI * t ** 1.35) ** 0.7,
      tilt: 1.1,
      opacity: 1,
      seed: 5 + k,
    });
    if (!p) continue;
    if (!out) {
      out = p;
      continue;
    }
    // Each petal overlaps the previous one and casts a faint shadow.
    const a2 = p.a + out.a * (1 - p.a);
    out = {
      rgb: out.rgb.map((c0, i) => (p.rgb[i] * p.a + c0 * 0.93 * out.a * (1 - p.a)) / a2),
      a: a2,
    };
  }
  return out;
};

await Promise.all([
  paper("paper-maroon.webp", [92, 20, 38], { grain: 1.5, fibre: 5, mottle: 0.14, fleck: 0.09, seed: 3 }),
  paper("paper-ivory.webp", [247, 239, 223], { grain: 0.55, fibre: 4, mottle: 0.035, fleck: 0.022, seed: 12 }),
  // Cold-pressed watercolour sheet behind the illustrations.
  paper("paper-white.webp", [249, 247, 243], { grain: 1.15, fibre: 2, mottle: 0.018, fleck: 0.012, seed: 27 }),
  waxSeal(),
  renderSprite("frangipani.webp", 160, frangipani),
  renderSprite(
    "petal-lotus.webp",
    120,
    loosePetal({
      base: [255, 236, 224],
      mid: [244, 170, 188],
      tip: [205, 76, 120],
      width: (t) => 0.62 * Math.sin(Math.PI * t ** 0.9) ** 0.85,
      tilt: 0.8,
      bend: 0.14,
      opacity: 0.97,
      seed: 31,
    }),
  ),
  renderSprite(
    "petal-rose.webp",
    120,
    loosePetal({
      base: [120, 8, 28],
      mid: [168, 18, 46],
      tip: [196, 40, 66],
      width: (t) => 0.82 * Math.sin(Math.PI * t ** 1.5) ** 0.55,
      tilt: -0.9,
      bend: -0.1,
      opacity: 1,
      seed: 58,
    }),
  ),
  renderSprite(
    "petal-jasmine.webp",
    96,
    loosePetal({
      base: [222, 226, 180],
      mid: [255, 252, 240],
      tip: [255, 255, 252],
      width: (t) => 0.44 * Math.sin(Math.PI * t ** 1.1) ** 0.8,
      tilt: 0.6,
      bend: 0.2,
      opacity: 0.98,
      seed: 73,
    }),
  ),
]);

console.log("Textures written to public/images/textures/");
