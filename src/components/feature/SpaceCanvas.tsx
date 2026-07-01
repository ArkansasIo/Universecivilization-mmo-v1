import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

interface SpaceCanvasProps {
  className?: string;
  starCount?: number;
  showNebulae?: boolean;
  parallaxStrength?: number;
  animated?: boolean;
}

export default function SpaceCanvas({
  className = '',
  starCount = 300,
  showNebulae = true,
  animated = true,
}: SpaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
      if (showNebulae) initNebulae();
    };

    const STAR_COLORS = ['#ffffff', '#ffe8c0', '#c0d8ff', '#ffd0d0', '#d0ffd8', '#e8d0ff'];

    const initStars = () => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() * 2.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    const initNebulae = () => {
      const NEBULA_COLORS = [
        'rgba(120,40,180,',
        'rgba(20,120,200,',
        'rgba(180,40,80,',
        'rgba(40,160,120,',
        'rgba(200,100,20,',
      ];
      nebulaeRef.current = Array.from({ length: 5 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        color: NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)],
        opacity: Math.random() * 0.08 + 0.03,
      }));
    };

    const drawNebulae = () => {
      nebulaeRef.current.forEach(n => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, `${n.color}${n.opacity})`);
        grad.addColorStop(0.5, `${n.color}${n.opacity * 0.5})`);
        grad.addColorStop(1, `${n.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawStars = (t: number) => {
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(t * star.speed * 2 + star.x) * 0.3 + 0.7;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
        ctx.fill();

        // Glow for bigger stars
        if (star.size > 1.8) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `${star.color}60`);
          glow.addColorStop(1, `${star.color}00`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    };

    const render = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bg.addColorStop(0, '#020408');
      bg.addColorStop(0.5, '#050a14');
      bg.addColorStop(1, '#030608');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (showNebulae) drawNebulae();
      drawStars(timeRef.current);

      if (animated) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    resize();
    render();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
    };
  }, [starCount, showNebulae, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
