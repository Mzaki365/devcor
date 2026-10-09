import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { soundEngine } from '../utils/audio';
import { prefersReducedMotion } from '../config/motionSystem';

/**
 * Star Solutions — Cinematic "Orbital Assembly" Entrance
 * 
 * Direct 3D Astrolabe Construction (Right-Aligned Hero Layout):
 * 1. Supersonic aircraft flies across, drops golden ball payload.
 * 2. Ball descends directly into the RIGHT side of the screen (matching the 3D Astrolabe core in Pic 2).
 * 3. Core activates with golden pulse & expanding circular shockwave ring on the right.
 * 4. A golden energy conduit travels up to the navbar, drawing the navbar across the top.
 * 5. Real 3D Brass Armillary Astrolabe on the right illuminates and rotates in full 3D depth.
 * 6. Golden energy scan sweeps down the left side of the screen to reveal:
 *    - Archival Badge
 *    - "Architects of / Digital Navigation / & Precision Systems"
 *    - Hand-drawn SVG underline
 *    - Description paragraph
 *    - Tactical CTA buttons
 * 7. Seamless dissolution into live interactive website.
 */
export default function AircraftCoreEntrance({ onComplete, isReady = true }) {
  const [isActive, setIsActive] = useState(true);
  const containerRef = useRef(null);
  const aircraftRef = useRef(null);
  const thrusterRef = useRef(null);
  const sphereRef = useRef(null);
  const sphereGlowRef = useRef(null);
  const sphereTrailRef = useRef(null);
  const shockwaveRef = useRef(null);

  // Navbar Energy Line Refs
  const navEnergyLineRef = useRef(null);
  const navEnergyFlareRef = useRef(null);
  const energyConduitRef = useRef(null);

  // Scanning Beams
  const heroHeadingScanRef = useRef(null);
  const heroDescScanRef = useRef(null);
  const heroCtaScanRef = useRef(null);
  const particlesCanvasRef = useRef(null);

  const handleFinish = () => {
    soundEngine.playEscapementClick();
    soundEngine.playPlateSlide();

    // Ensure all navbar and hero elements are 100% visible and interactive
    gsap.set([
      '.nav-header',
      '.nav-logo',
      '.nav-item-services',
      '.nav-item-work',
      '.nav-item-about',
      '.nav-acoustics',
      '.nav-cta-btn',
      '.hero-stamp-badge',
      '.hero-line-1',
      '.hero-line-2',
      '.hero-line-3',
      '.hero-desc-text',
      '.hero-cta-buttons',
    ], {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform',
    });

    setIsActive(false);
    onComplete();
  };

  useEffect(() => {
    if (!isReady) return;

    if (prefersReducedMotion()) {
      handleFinish();
      return;
    }

    const container = containerRef.current;
    const aircraft = aircraftRef.current;
    const thruster = thrusterRef.current;
    const sphere = sphereRef.current;
    const sphereGlow = sphereGlowRef.current;
    const sphereTrail = sphereTrailRef.current;
    const shockwave = shockwaveRef.current;
    const navLine = navEnergyLineRef.current;
    const navFlare = navEnergyFlareRef.current;
    const conduit = energyConduitRef.current;
    const headingScan = heroHeadingScanRef.current;
    const descScan = heroDescScanRef.current;
    const ctaScan = heroCtaScanRef.current;
    const canvas = particlesCanvasRef.current;

    const isMobile = window.innerWidth < 768;
    const targetLeft = isMobile ? '50%' : '72%';

    // ----------------------------------------------------
    // Particle Dust Canvas Setup
    // ----------------------------------------------------
    let animId;
    let particles = [];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = isMobile ? 18 : 38;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          alpha: Math.random() * 0.5 + 0.15,
        });
      }

      const renderParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#dfb776';
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        animId = requestAnimationFrame(renderParticles);
      };
      renderParticles();
    }

    // ----------------------------------------------------
    // Master GSAP Timeline — Direct 3D Astrolabe Alignment
    // ----------------------------------------------------
    const masterTl = gsap.timeline({
      onComplete: handleFinish,
    });

    // Initial States
    gsap.set(container, { opacity: 1 });
    gsap.set(aircraft, {
      x: -220,
      y: -120,
      scale: 0.3,
      rotate: 24,
      opacity: 0,
      transformPerspective: 1200,
    });
    gsap.set(sphere, {
      top: '18%',
      left: targetLeft,
      xPercent: -50,
      yPercent: -50,
      scale: 0.3,
      opacity: 0,
    });
    if (sphereGlow) gsap.set(sphereGlow, { opacity: 0, scale: 0.5 });
    if (sphereTrail) gsap.set(sphereTrail, { opacity: 0, scaleY: 0, left: targetLeft });
    if (shockwave) gsap.set(shockwave, { scale: 0, opacity: 0, left: targetLeft });
    if (conduit) gsap.set(conduit, { opacity: 0, scaleY: 0 });
    if (navLine) gsap.set(navLine, { scaleX: 0, opacity: 0 });
    if (navFlare) gsap.set(navFlare, { opacity: 0, left: '0%' });

    // Initial state for all Navbar & Hero elements (Revealed sequentially by energy)
    gsap.set('.nav-header', { opacity: 1, y: 0 });
    gsap.set([
      '.nav-logo',
      '.nav-item-hero',
      '.nav-item-about',
      '.nav-item-services',
      '.nav-item-work',
      '.nav-item-contact',
      '.nav-acoustics',
      '.nav-cta-btn',
      '.hero-stamp-badge',
      '.hero-line-1',
      '.hero-line-2',
      '.hero-line-3',
      '.hero-desc-text',
      '.hero-cta-buttons',
    ], {
      opacity: 0,
    });

    // ----------------------------------------------------
    // PHASE 1: Aircraft Flight & Payload Release (0.3s - 2.4s)
    // ----------------------------------------------------
    masterTl.to(aircraft, {
      x: window.innerWidth * (isMobile ? 0.5 : 0.72) - 75,
      y: window.innerHeight * 0.16,
      scale: 1.0,
      rotate: 20,
      opacity: 1,
      duration: 1.25,
      ease: 'power2.out',
      onStart: () => soundEngine.playPlateSlide(),
    }, 0.3);

    if (thruster) {
      masterTl.to(thruster, {
        scaleX: 1.4,
        opacity: 0.95,
        duration: 0.35,
        repeat: 3,
        yoyo: true,
      }, 0.4);
    }

    // Aircraft drops golden ball payload toward the RIGHT core position
    masterTl.call(() => {
      soundEngine.playEscapementClick();
    }, null, 1.45);

    masterTl.to(sphere, {
      opacity: 1,
      scale: 0.7,
      duration: 0.25,
      ease: 'power2.out',
    }, 1.5);

    // Aircraft exits to top-right into darkness
    masterTl.to(aircraft, {
      x: window.innerWidth + 240,
      y: -180,
      scale: 0.55,
      rotate: 14,
      opacity: 0,
      duration: 1.15,
      ease: 'power2.in',
    }, 1.6);

    // ----------------------------------------------------
    // PHASE 2: Ball Falls to RIGHT Astrolabe Core Position (1.6s - 2.8s)
    // ----------------------------------------------------
    if (sphereTrail) {
      masterTl.fromTo(sphereTrail, {
        top: '18%',
        xPercent: -50,
        height: '0px',
        opacity: 0,
      }, {
        height: '140px',
        opacity: 0.7,
        duration: 0.55,
        ease: 'power2.out',
      }, 1.65);

      masterTl.to(sphereTrail, {
        height: '0px',
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 2.3);
    }

    // Ball falls vertically on the right side and settles into the 3D astrolabe core
    masterTl.to(sphere, {
      top: '50%',
      scale: 1.0,
      duration: 1.2,
      ease: 'power3.inOut',
      onStart: () => soundEngine.playRatchetTick(820),
    }, 1.65);

    if (sphereGlow) {
      masterTl.to(sphereGlow, {
        opacity: 0.85,
        scale: 1.3,
        duration: 1.0,
        ease: 'power2.out',
      }, 1.9);
    }

    // ----------------------------------------------------
    // PHASE 3: Core Activation on the Right (2.8s - 3.5s)
    // ----------------------------------------------------
    masterTl.call(() => {
      soundEngine.playCelestialLock();
    }, null, 2.8);

    if (shockwave) {
      masterTl.fromTo(shockwave, {
        scale: 0.1,
        opacity: 0.9,
      }, {
        scale: 2.2,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 2.8);
    }

    // ----------------------------------------------------
    // PHASE 4: Golden Energy Conduit to Navbar (3.3s - 4.7s)
    // ----------------------------------------------------
    // Energy rises from the right-aligned core up to the navbar
    if (conduit) {
      masterTl.fromTo(conduit, {
        top: '50%',
        left: targetLeft,
        height: '0px',
        opacity: 0,
      }, {
        top: '48px',
        height: '42vh',
        opacity: 0.8,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => soundEngine.playPlateSlide(),
      }, 3.3);

      masterTl.to(conduit, {
        opacity: 0,
        duration: 0.35,
      }, 3.8);
    }

    // Energy line sweeps across the navbar horizontally (Left -> Right)
    if (navLine) {
      masterTl.fromTo(navLine, {
        scaleX: 0,
        opacity: 1,
      }, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        onStart: () => soundEngine.playRatchetTick(960),
      }, 3.65);
    }

    if (navFlare) {
      masterTl.fromTo(navFlare, {
        left: '0%',
        opacity: 1,
      }, {
        left: '100%',
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 3.65);
    }

    // Navbar elements are DRAWN sequentially as energy sweeps:
    masterTl.fromTo('.nav-logo', {
      opacity: 0,
      scale: 0.85,
      x: -15,
    }, {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 0.35,
      ease: 'back.out(1.5)',
      onStart: () => soundEngine.playEscapementClick(),
    }, 3.75);

    masterTl.fromTo('.nav-item-hero', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 4.0);
    masterTl.fromTo('.nav-item-about', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 4.15);
    masterTl.fromTo('.nav-item-services', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 4.3);
    masterTl.fromTo('.nav-item-work', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 4.45);
    masterTl.fromTo('.nav-item-contact', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 4.55);

    masterTl.fromTo('.nav-acoustics', {
      opacity: 0,
      scale: 0.9,
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.28,
      ease: 'power2.out',
    }, 4.6);

    masterTl.fromTo('.nav-cta-btn', {
      opacity: 0,
      scale: 0.9,
      x: 15,
    }, {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 0.38,
      ease: 'back.out(1.5)',
      onStart: () => soundEngine.playEscapementClick(),
    }, 4.65);

    // ----------------------------------------------------
    // PHASE 5: Seamless Dissolution into Live Website (4.8s - 5.3s)
    // ----------------------------------------------------
    masterTl.call(() => {
      soundEngine.playCelestialLock();
    }, null, 4.75);

    masterTl.to(sphere, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 4.8);

    masterTl.to(container, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
    }, 4.9);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      masterTl.kill();
    };
  }, [isReady]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99998] bg-[#05070a] pointer-events-auto select-none overflow-hidden"
      style={{ perspective: '1400px' }}
    >
      {/* Ambient Starlight Particle Dust Canvas */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* ---------------------------------------------------- */}
      {/* 1. SUPERSONIC STEALTH AIRCRAFT                       */}
      {/* ---------------------------------------------------- */}
      <div
        ref={aircraftRef}
        className="absolute top-0 left-0 w-44 h-24 sm:w-56 sm:h-32 z-30 pointer-events-none will-change-transform"
      >
        <svg
          viewBox="0 0 240 130"
          className="w-full h-full overflow-visible drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fuselage-titanium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#252f42" />
              <stop offset="45%" stopColor="#121722" />
              <stop offset="85%" stopColor="#0a0d14" />
              <stop offset="100%" stopColor="#1a2230" />
            </linearGradient>

            <linearGradient id="wing-facet" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#1a2333" />
              <stop offset="50%" stopColor="#101520" />
              <stop offset="100%" stopColor="#080b10" />
            </linearGradient>

            <linearGradient id="gold-edge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8c6b34" />
              <stop offset="50%" stopColor="#dfb776" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <linearGradient id="ion-exhaust" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#dfb776" />
              <stop offset="65%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Thruster Plumes */}
          <g ref={thrusterRef} className="origin-right">
            <ellipse cx="25" cy="55" rx="35" ry="5" fill="url(#ion-exhaust)" opacity="0.9" />
            <ellipse cx="25" cy="75" rx="35" ry="5" fill="url(#ion-exhaust)" opacity="0.9" />
          </g>

          {/* Wings & Hull */}
          <polygon
            points="60,35 140,50 200,65 110,15 45,20"
            fill="url(#wing-facet)"
            stroke="rgba(197, 155, 86, 0.4)"
            strokeWidth="0.75"
          />
          <polygon
            points="60,95 140,80 200,65 110,115 45,110"
            fill="url(#wing-facet)"
            stroke="rgba(197, 155, 86, 0.4)"
            strokeWidth="0.75"
          />
          <polygon
            points="230,65 170,52 60,50 40,65 60,80 170,78"
            fill="url(#fuselage-titanium)"
            stroke="url(#gold-edge)"
            strokeWidth="1.2"
          />

          <line x1="50" y1="65" x2="225" y2="65" stroke="#dfb776" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="185,65 160,58 135,59 150,65 135,71 160,72" fill="#c59b56" opacity="0.85" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="45" cy="20" r="2" fill="#38bdf8" />
          <circle cx="45" cy="110" r="2" fill="#dfb776" />
          <circle cx="230" cy="65" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. GOLDEN BALL PAYLOAD ON THE RIGHT                   */}
      {/* ---------------------------------------------------- */}
      <div
        ref={sphereTrailRef}
        className="absolute w-[2px] bg-gradient-to-t from-[#dfb776] via-[#dfb776]/40 to-transparent z-20 pointer-events-none origin-bottom opacity-0"
      />

      <div
        ref={sphereRef}
        className="absolute z-40 pointer-events-none will-change-transform flex items-center justify-center"
        style={{ width: '64px', height: '64px' }}
      >
        <div
          ref={sphereGlowRef}
          className="absolute inset-0 rounded-full bg-[#dfb776]/30 blur-[16px] pointer-events-none"
        />
        <div
          className="relative w-12 h-12 rounded-full shadow-[0_0_30px_#dfb776,0_0_60px_rgba(223,183,118,0.5),inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_4px_4px_12px_rgba(255,255,255,0.9)]"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #fff2c6 18%, #dfb776 48%, #9e7530 78%, #362408 100%)',
          }}
        >
          <div className="absolute top-2 left-2.5 w-3.5 h-2 rounded-full bg-white/90 blur-[0.6px] -rotate-30" />
        </div>
      </div>

      {/* Subtle Activation Pulse Shockwave on the Right */}
      <div
        ref={shockwaveRef}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#dfb776] z-20 pointer-events-none opacity-0 shadow-[0_0_30px_#dfb776]"
      />

      {/* Energy Conduit Line from Core up to Navbar */}
      <div
        ref={energyConduitRef}
        className="absolute w-[1.5px] bg-gradient-to-t from-[#dfb776] via-[#dfb776]/60 to-white z-30 pointer-events-none -translate-x-1/2 shadow-[0_0_10px_#dfb776]"
      />

      {/* Top Navbar Structural Energy Line */}
      <div className="absolute top-[48px] left-1/2 -translate-x-1/2 w-[92vw] max-w-5xl h-[1.5px] z-30 pointer-events-none overflow-visible">
        <div
          ref={navEnergyLineRef}
          className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_rgba(255,255,255,0.8)] origin-left"
        />
        <div
          ref={navEnergyFlareRef}
          className="absolute -top-2 w-16 h-5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent blur-[2px]"
        />
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. SEQUENTIAL ENERGY SCANNING BEAMS (HERO TEXT)      */}
      {/* ---------------------------------------------------- */}
      <div
        ref={heroHeadingScanRef}
        className="absolute left-0 lg:left-[4%] w-full lg:w-[48%] h-[2px] bg-gradient-to-r from-transparent via-[#ffffff] to-transparent z-50 pointer-events-none opacity-0 shadow-[0_0_18px_#dfb776,0_0_35px_#dfb776]"
      />

      <div
        ref={heroDescScanRef}
        className="absolute left-0 lg:left-[4%] w-full lg:w-[48%] h-[1.5px] bg-gradient-to-r from-transparent via-[#dfb776] to-transparent z-50 pointer-events-none opacity-0 shadow-[0_0_14px_#dfb776]"
      />

      <div
        ref={heroCtaScanRef}
        className="absolute left-0 lg:left-[4%] w-full lg:w-[48%] h-[2px] bg-gradient-to-r from-transparent via-[#ffffff] to-transparent z-50 pointer-events-none opacity-0 shadow-[0_0_20px_#dfb776,0_0_40px_#dfb776]"
      />

      {/* Skip Button */}
      <button
        onClick={handleFinish}
        className="absolute bottom-6 right-8 font-mono text-[10px] text-[#828b99] hover:text-white uppercase tracking-widest transition-colors cursor-pointer z-50 pointer-events-auto"
      >
        [ Skip Entrance → ]
      </button>
    </div>
  );
}
