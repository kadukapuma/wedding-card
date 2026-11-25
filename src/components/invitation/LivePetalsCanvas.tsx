"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  type: "lotus" | "jasmine" | "goldSparkle";
  opacity: number;
  swayOffset: number;
}

export function LivePetalsCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particleCount = Math.min(36, Math.floor(width / 35));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 6,
        speedY: Math.random() * 0.7 + 0.35,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: i % 3 === 0 ? "lotus" : i % 3 === 1 ? "jasmine" : "goldSparkle",
        opacity: Math.random() * 0.6 + 0.3,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(time + p.swayOffset) * 0.8 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === "lotus") {
          // Sri Lankan golden-pink lotus petal
          const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
          grad.addColorStop(0, "rgba(224, 160, 180, 0.85)");
          grad.addColorStop(0.5, "rgba(212, 175, 55, 0.75)");
          grad.addColorStop(1, "rgba(197, 160, 90, 0.4)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.3, p.size * 0.7, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.7, -p.size * 0.3, 0, -p.size);
          ctx.fill();
        } else if (p.type === "jasmine") {
          // Auspicious white/ivory jasmine petal with gold tint
          ctx.fillStyle = "rgba(255, 250, 240, 0.75)";
          ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
          ctx.lineWidth = 0.5;

          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          // Floating golden fairy dust sparkle
          const sparkSize = p.size * 0.35;
          ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
          ctx.shadowColor = "#D4AF37";
          ctx.shadowBlur = 6;

          ctx.beginPath();
          ctx.arc(0, 0, sparkSize, 0, Math.PI * 2);
          ctx.fill();

          // 4-point star glint
          ctx.strokeStyle = "rgba(255, 240, 180, 0.9)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-sparkSize * 2.2, 0);
          ctx.lineTo(sparkSize * 2.2, 0);
          ctx.moveTo(0, -sparkSize * 2.2);
          ctx.lineTo(0, sparkSize * 2.2);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
