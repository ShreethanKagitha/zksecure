import { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const resizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetAngleY = (e.clientX - window.innerWidth  / 2) * 0.00004;
      targetAngleX = (e.clientY - window.innerHeight / 2) * 0.00004;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();

    // ─── Theme palette ───────────────────────────────────────────────
    const DOT_COLORS = [
      [108,  59,  255],   // violet #6C3BFF
      [59,   130, 246],   // blue   #3B82F6
      [99,   102, 241],   // indigo #6366f1
    ];
    const LINE_COLORS = [
      [108,  59,  255],
      [59,   130, 246],
    ];

    class Particle {
      x = 0; y = 0; z = 0;
      size    = 0;
      opacity = 0;
      color: number[] = [108, 59, 255];
      drift   = 0;

      constructor() {
        const theta  = Math.random() * Math.PI * 2;
        const phi    = Math.acos(Math.random() * 2 - 1);
        const radius = Math.random() * 950 + 80;
        this.x = radius * Math.sin(phi) * Math.cos(theta);
        this.y = radius * Math.sin(phi) * Math.sin(theta);
        this.z = radius * Math.cos(phi);
        this.size    = Math.random() * 1.4 + 0.4;
        this.opacity = Math.random() * 0.5 + 0.14;
        this.drift   = (Math.random() - 0.5) * 0.25;
        const idx    = Math.floor(Math.random() * DOT_COLORS.length);
        this.color   = DOT_COLORS[idx];
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      particles = [];
      const count = Math.min(260, Math.floor((window.innerWidth * window.innerHeight) / 11000));
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      // Soft persistence trail for motion blur effect
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Slow autonomous rotation + mouse influence
      angleY += 0.00075 + targetAngleY * 0.55;
      angleX += 0.00025 + targetAngleX * 0.55;

      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const fov  = 1200;

      type Pt2D = { x: number; y: number; scale: number; p: Particle };
      const pts: Pt2D[] = [];

      for (const p of particles) {
        // Individual vertical drift for data-flow feel
        p.y += p.drift;
        if (Math.abs(p.y) > 1050) p.drift *= -1;

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y1 = p.y * cosX - z1  * sinX;
        const z2 = z1  * cosX + p.y * sinX;

        if (z2 + fov > 0) {
          const scale = fov / (fov + z2);
          pts.push({
            x: x1 * scale + canvas.width  / 2,
            y: y1 * scale + canvas.height / 2,
            scale,
            p,
          });
        }
      }

      // Connection lines between nearby particles
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const pA = pts[a], pB = pts[b];
          const dx = pA.x - pB.x, dy = pA.y - pB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = 88 * Math.max(pA.scale, pB.scale);
          if (dist < threshold) {
            const alpha = (1 - dist / threshold) * 0.17;
            const [r, g, bl] = LINE_COLORS[(a + b) & 1];
            ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
            ctx.lineWidth   = Math.min(pA.scale, pB.scale) * 0.85;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const pt of pts) {
        const [r, g, b] = pt.p.color;
        const sz = pt.p.size * pt.scale * 2.1;
        ctx.fillStyle = `rgba(${r},${g},${b},${pt.p.opacity})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, sz, 0, Math.PI * 2);
        ctx.fill();
        // Soft halo on foreground particles
        if (pt.scale > 1.15) {
          ctx.fillStyle = `rgba(${r},${g},${b},${pt.p.opacity * 0.16})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, sz * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: -2,
        pointerEvents: 'none',
        background: '#000000',
      }}
    />
  );
}
