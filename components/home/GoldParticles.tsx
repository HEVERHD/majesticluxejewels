"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  opacity: number; life: number; maxLife: number;
}

export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Menos partículas en mobile para no afectar rendimiento
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 18 : 40;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];

    function spawn(): Particle {
      return {
        x:       Math.random() * canvas!.width,
        y:       canvas!.height + 10,
        size:    Math.random() * 2.5 + 0.8,
        speedX:  (Math.random() - 0.5) * 0.6,
        speedY:  -(Math.random() * 0.8 + 0.4),
        opacity: 0,
        life:    0,
        maxLife: Math.random() * 180 + 120,
      };
    }

    for (let i = 0; i < COUNT; i++) {
      const p = spawn();
      p.y     = Math.random() * canvas.height;
      p.life  = Math.random() * p.maxLife;
      particles.push(p);
    }

    let raf: number;

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life   += 1;
        p.x      += p.speedX;
        p.y      += p.speedY;

        const half = p.maxLife / 2;
        p.opacity = p.life < half
          ? (p.life / half) * 0.9
          : ((p.maxLife - p.life) / half) * 0.9;

        if (p.life >= p.maxLife) {
          particles[i] = spawn();
          continue;
        }

        // Destello dorado
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx!.fill();

        // Glow suave
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grad.addColorStop(0, `rgba(226, 201, 126, ${p.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(201, 168, 76, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
