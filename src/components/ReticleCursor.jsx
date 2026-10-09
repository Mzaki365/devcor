import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../config/motionSystem';

export default function ReticleCursor() {
  const canvasRef = useRef(null);
  const reticleRef = useRef(null);
  const dotRef = useRef(null);
  const hudRef = useRef(null);
  const shadowOrbRef = useRef(null);

  const [cursorMode, setCursorMode] = useState('idle'); // 'idle' | 'link' | 'view' | 'text'
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const shadowPos = useRef({ x: -100, y: -100 });
  const points = useRef([]);
  const particles = useRef([]);
  const cursorModeRef = useRef('idle');
  const isVisibleRef = useRef(false);

  useEffect(() => {
    cursorModeRef.current = cursorMode;
  }, [cursorMode]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) setIsVisible(true);

      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        const count = Math.min(2, Math.floor(dist / 8) + 1);
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.0 - dx * 0.04,
            vy: (Math.random() - 0.5) * 1.0 - dy * 0.04,
            size: Math.random() * 2.2 + 0.8,
            alpha: 0.8,
            decay: Math.random() * 0.03 + 0.02,
            color: Math.random() > 0.3 ? '#c59b56' : '#f4eee2',
          });
        }
      }
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e) => {
      // Celestial ripple burst upon click
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = Math.random() * 2.2 + 1.8;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.2,
          alpha: 1.0,
          decay: 0.035,
          color: i % 2 === 0 ? '#dfb776' : '#f4eee2',
        });
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e) => {
      const target = e.target;
      const explicitMode = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (explicitMode) {
        setCursorMode(explicitMode);
        return;
      }

      const isInput = target.closest('input, textarea, [contenteditable="true"]');
      if (isInput) {
        setCursorMode('text');
        return;
      }

      const isInteractive = target.closest(
        'button, a, select, .cursor-pointer, [role="button"]'
      );
      if (isInteractive) {
        setCursorMode('link');
        return;
      }

      setCursorMode('idle');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementHover);

    const MAX_POINTS = 20;
    let animId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isVisibleRef.current) {
        // 1. Tail points history
        points.current.unshift({ x: mousePos.current.x, y: mousePos.current.y });
        if (points.current.length > MAX_POINTS) {
          points.current.pop();
        }

        // 2. Smoothly update lagging shadow orb with spring damping
        shadowPos.current.x += (mousePos.current.x - shadowPos.current.x) * 0.16;
        shadowPos.current.y += (mousePos.current.y - shadowPos.current.y) * 0.16;

        if (shadowOrbRef.current) {
          shadowOrbRef.current.style.transform = `translate3d(${shadowPos.current.x}px, ${shadowPos.current.y}px, 0) translate(-50%, -50%)`;
        }

        // 3. Update DOM reticle positions directly for zero-lag 120 FPS
        if (reticleRef.current) {
          reticleRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
        }
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
        }
        if (hudRef.current) {
          hudRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
        }

        // 4. Draw Glowing Tail / Ribbon on Canvas
        if (points.current.length > 2) {
          for (let i = 0; i < points.current.length - 1; i++) {
            const p1 = points.current[i];
            const p2 = points.current[i + 1];
            const ratio = 1 - i / points.current.length;
            const isHover = cursorModeRef.current !== 'idle';

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            ctx.strokeStyle = isHover
              ? `rgba(223, 183, 118, ${ratio * 0.75})`
              : `rgba(197, 155, 86, ${ratio * 0.55})`;
            ctx.lineWidth = Math.max(0.6, ratio * (isHover ? 4.2 : 3.0));
            ctx.lineCap = 'round';
            ctx.shadowColor = '#c59b56';
            ctx.shadowBlur = ratio * 10;
            ctx.stroke();
          }
        }

        // 5. Draw & Update Stardust Sparkle Particles
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.size *= 0.96;

          if (p.alpha <= 0.01 || p.size <= 0.2) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, []);

  const isView = cursorMode === 'view';
  const isLink = cursorMode === 'link';
  const isText = cursorMode === 'text';

  const reticleSize = isView ? 64 : isLink ? 48 : isText ? 18 : 28;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Hardware-Accelerated 120 FPS Cursor Tail Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9997] w-full h-full"
      />

      {/* 2. Lagging Atmospheric Golden Shadow Orb */}
      <div
        ref={shadowOrbRef}
        className="fixed top-0 left-0 pointer-events-none rounded-full blur-xl transition-opacity duration-300 z-[9998]"
        style={{
          width: isView ? '110px' : isLink ? '85px' : '65px',
          height: isView ? '110px' : isLink ? '85px' : '65px',
          background:
            'radial-gradient(circle, rgba(197, 155, 86, 0.32) 0%, rgba(197, 155, 86, 0.10) 50%, transparent 75%)',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* 3. Outer Brass Reticle Ring */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 rounded-full border border-[#c59b56]/70 flex items-center justify-center transition-[width,height,background-color,border-color] duration-200 ease-out z-[9999]"
        style={{
          width: `${reticleSize}px`,
          height: `${reticleSize}px`,
          backgroundColor: isView
            ? 'rgba(197, 155, 86, 0.22)'
            : isLink
            ? 'rgba(197, 155, 86, 0.12)'
            : 'rgba(11, 14, 20, 0.25)',
          boxShadow: isView
            ? '0 0 25px rgba(197, 155, 86, 0.5)'
            : isLink
            ? '0 0 15px rgba(197, 155, 86, 0.35)'
            : '0 0 8px rgba(197, 155, 86, 0.15)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {isView && (
          <span className="font-catalog text-[8px] text-[#f4eee2] font-semibold tracking-widest uppercase">
            VIEW
          </span>
        )}

        {/* Optical Crosshair Ticks */}
        {!isView && (
          <>
            <div className="absolute -top-1.5 w-[1px] h-2.5 bg-[#c59b56]" />
            <div className="absolute -bottom-1.5 w-[1px] h-2.5 bg-[#c59b56]" />
            <div className="absolute -left-1.5 h-[1px] w-2.5 bg-[#c59b56]" />
            <div className="absolute -right-1.5 h-[1px] w-2.5 bg-[#c59b56]" />
          </>
        )}
      </div>

      {/* 4. Center Astrolabe Sight Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#f4eee2] shadow-[0_0_8px_#f4eee2] z-[9999]"
        style={{ opacity: isVisible && !isView ? 1 : 0 }}
      />

      {/* 5. Micro Coordinate Readout on Link / View */}
      {(isLink || isView) && isVisible && (
        <div
          ref={hudRef}
          className="fixed top-0 left-0 font-catalog text-[8px] text-[#c59b56] tracking-widest pointer-events-none ml-6 mt-4 select-none bg-[#0b0e14]/85 px-1.5 py-0.5 border border-[#c59b56]/30 backdrop-blur-sm z-[9999]"
        >
          {isView ? 'PORTFOLIO · BRIEF' : 'COMMISSION · LAT 51°N'}
        </div>
      )}
    </div>
  );
}
