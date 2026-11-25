"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const SPRITES = [
  { src: "/images/textures/petal-jasmine.webp", size: 20, weight: 4 },
  { src: "/images/textures/petal-lotus.webp", size: 24, weight: 3 },
  { src: "/images/textures/petal-rose.webp", size: 22, weight: 2 },
  { src: "/images/textures/frangipani.webp", size: 34, weight: 1 },
];

interface Petal {
  x: number;
  y: number;
  depth: number; // 0.45 (far) → 1.35 (near)
  sprite: number;
  angle: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

/** Tumbling flower petals and drifting gold dust, layered over the invitation. */
export function PetalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reducedMotion) return;

    const images = SPRITES.map((s) => {
      const img = new window.Image();
      img.src = s.src;
      return img;
    });
    const deck = SPRITES.flatMap((s, i) => Array<number>(s.weight).fill(i));

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (y: number): Petal => ({
      x: Math.random() * width,
      y,
      depth: 0.45 + Math.random() ** 1.6 * 0.9,
      sprite: deck[Math.floor(Math.random() * deck.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.2,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.6 + Math.random() * 1.8,
      sway: Math.random() * Math.PI * 2,
    });

    const petalCount = Math.max(14, Math.min(34, Math.round(width / 42)));
    // Start above the screen so the first moments read as a flower shower.
    const petals = Array.from({ length: petalCount }, () =>
      spawn(-Math.random() * height * 1.1 - 20),
    ).sort((a, b) => a.depth - b.depth);

    const motes: Mote[] = Array.from({ length: petalCount + 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 6 + Math.random() * 16,
    }));

    let gust = 0;
    let lastScroll = window.scrollY;
    const onScroll = () => {
      gust = Math.max(-90, Math.min(90, gust + (window.scrollY - lastScroll) * 0.35));
      lastScroll = window.scrollY;
    };

    let frame = 0;
    let previous = performance.now();
    const render = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const t = now / 1000;
      gust *= 0.94;
      ctx.clearRect(0, 0, width, height);

      // Plain alpha blending, so the gold dust shows on white paper too.
      for (const m of motes) {
        m.y -= m.speed * dt;
        m.x += Math.sin(t * 0.6 + m.phase) * 6 * dt;
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(t * 2.2 + m.phase * 3);
        ctx.globalAlpha = 0.06 + twinkle * 0.16;
        ctx.fillStyle = "#e0ac45";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.25 + twinkle * 0.55;
        ctx.fillStyle = "#d3a23c";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of petals) {
        p.y += (22 + p.depth * 38) * dt - gust * p.depth * dt * 2;
        p.x += (Math.sin(t * 0.9 + p.sway) * 26 + 8) * p.depth * dt;
        p.angle += p.spin * dt;
        p.flip += p.flipSpeed * dt;

        if (p.y > height + 50) Object.assign(p, spawn(-50), { depth: p.depth });
        if (p.x > width + 50) p.x = -40;

        const img = images[p.sprite];
        if (!img.complete || !img.naturalWidth || p.y < -50) continue;

        const size = SPRITES[p.sprite].size * p.depth;
        const face = Math.cos(p.flip);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        // Squashing one axis fakes a petal turning over in the air.
        ctx.scale(Math.sign(face || 1) * Math.max(0.18, Math.abs(face)), 1);
        ctx.globalAlpha = Math.min(0.95, 0.35 + p.depth * 0.55) * (face < 0 ? 0.82 : 1);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      frame = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
