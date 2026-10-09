import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';

/**
 * HeroInteractiveField
 * 
 * Interactive Kinetic Ray / Needle Field & Click Digital Rain / Blast Physics:
 * - Full blast physics on tap/click for both desktop and mobile.
 * - Allows natural vertical touch scrolling (pan-y) so mobile phones scroll smoothly.
 */
export default function HeroInteractiveField() {
  const canvasRef = useRef(null);
  const isHoldingRef = useRef(false);
  const mouseRef = useRef({ x: -1000, y: -1000, isOver: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    let shockwaves = [];
    let ambientRain = [];
    let animId;

    let isMobile = width < 768;

    // 1. Initialize Ambient Floating Rain Droplets
    const ambientRainCount = isMobile ? 18 : 40;
    for (let i = 0; i < ambientRainCount; i++) {
      ambientRain.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 16 + 8,
        speedY: Math.random() * 2.2 + 1.0,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.1,
        width: Math.random() * 1.0 + 0.5,
      });
    }

    // 2. Grid spacing: larger spacing on mobile to optimize performance
    let spacing = isMobile ? 64 : 48;
    let lineLen = isMobile ? 10 : 14;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
      spacing = isMobile ? 64 : 48;
      lineLen = isMobile ? 10 : 14;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Spawn Burst & Digital Rain Cascade on Click / Tap Blast
    const triggerBlast = (x, y, intensity = 1.0, isTouch = false) => {
      const actualIntensity = isTouch ? intensity * 0.7 : intensity;

      // 1. Shockwave ring
      if (shockwaves.length < 4) {
        shockwaves.push({
          x,
          y,
          radius: 4,
          maxRadius: Math.min(width, height) * (isTouch ? 0.3 : 0.4) * actualIntensity,
          alpha: 0.9,
          speed: (isTouch ? 7 : 9) * actualIntensity,
        });
      }

      // 2. High-speed radiant sparks & rain trails
      const count = Math.floor((isTouch ? 16 : 32) * actualIntensity);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const hue = Math.random() > 0.4 ? '#ffffff' : Math.random() > 0.5 ? '#dfb776' : '#38bdf8';
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.0,
          gravity: 0.2,
          length: Math.random() * 18 + 10,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02,
          color: hue,
          size: Math.random() * 1.8 + 0.8,
        });
      }

      // Cap maximum active particles to prevent lag
      if (particles.length > 50) {
        particles.splice(0, particles.length - 50);
      }

      // Audio cue
      soundEngine.playEscapementClick();
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.isOver = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.isOver = false;
      isHoldingRef.current = false;
    };

    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const isTouch = e.pointerType === 'touch';

      // Always trigger blast effect on tap/click
      triggerBlast(x, y, 1.1, isTouch);

      // On mouse desktop: enable continuous hold blast
      if (!isTouch) {
        isHoldingRef.current = true;
      }
    };

    const handlePointerUp = () => {
      isHoldingRef.current = false;
    };

    // Render Loop
    let lastHoldTime = 0;
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isOver = mouseRef.current.isOver;

      // Continuous blast on mouse click & hold (desktop only)
      if (isHoldingRef.current && isOver && time - lastHoldTime > 150) {
        lastHoldTime = time;
        triggerBlast(mx, my, 0.6, false);
      }

      // ----------------------------------------------------
      // A. Ambient Digital Rain Droplets
      // ----------------------------------------------------
      for (let i = 0; i < ambientRain.length; i++) {
        const drop = ambientRain[i];
        drop.y += drop.speedY;
        drop.x += drop.speedX;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
        if (drop.x < 0) drop.x = width;
        if (drop.x > width) drop.x = 0;

        ctx.strokeStyle = `rgba(223, 183, 118, ${drop.alpha})`;
        ctx.lineWidth = drop.width;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.speedX * 2, drop.y + drop.length);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // B. Top Sunburst Radial Ray Lines
      // ----------------------------------------------------
      const sunCenterX = width * 0.5;
      const sunCenterY = -40;
      const rayCount = isMobile ? 16 : 28;
      const baseRayRadius = 140;

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / (rayCount - 1)) * Math.PI * 0.8 + Math.PI * 0.1;
        const len = 35 + (i % 3 === 0 ? 20 : 0);
        const x1 = sunCenterX + Math.cos(angle) * baseRayRadius;
        const y1 = sunCenterY + Math.sin(angle) * baseRayRadius;
        const x2 = sunCenterX + Math.cos(angle) * (baseRayRadius + len);
        const y2 = sunCenterY + Math.sin(angle) * (baseRayRadius + len);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // C. Interactive Needle / Ray Grid ("TOUCH THE LINES")
      // ----------------------------------------------------
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = c * spacing + spacing * 0.5;
          const gy = r * spacing + spacing * 0.5;

          // Default downward orientation
          let angle = Math.PI * 0.5;
          let alpha = 0.12;
          let len = lineLen;

          if (isOver) {
            const dx = mx - gx;
            const dy = my - gy;
            const distSq = dx * dx + dy * dy;

            if (distSq < 67600) { // 260px radius
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / 260;
              // Orient toward pointer
              angle = Math.atan2(dy, dx);
              alpha = 0.15 + factor * 0.45;
              len = lineLen + factor * 8;
            }
          }

          const halfLen = len * 0.5;
          const x1 = gx - Math.cos(angle) * halfLen;
          const y1 = gy - Math.sin(angle) * halfLen;
          const x2 = gx + Math.cos(angle) * halfLen;
          const y2 = gy + Math.sin(angle) * halfLen;

          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // ----------------------------------------------------
      // D. Shockwaves
      // ----------------------------------------------------
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha -= 0.025;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(223, 183, 118, ${sw.alpha * 0.75})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha * 0.5})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // E. Click / Tap Blast Rain Particles Shower
      // ----------------------------------------------------
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        // Particle rain streak
        const tailX = p.x - p.vx * 1.6;
        const tailY = p.y - p.vy * 1.6;

        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Glowing head
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const canvasEl = canvas;
    canvasEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvasEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    canvasEl.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('pointermove', handlePointerMove);
      canvasEl.removeEventListener('pointerleave', handlePointerLeave);
      canvasEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-0"
      style={{ touchAction: 'pan-y' }}
    />
  );
}
