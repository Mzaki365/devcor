import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { soundEngine } from '../utils/audio';
import { prefersReducedMotion } from '../config/motionSystem';

/**
 * AircraftCoreEntrance — Ball drops -> Morphs to Sci-Fi Helmet -> Menu drops/bursts from Helmet
 * 
 * 1. Supersonic aircraft flies across and drops the golden orb/ball payload.
 * 2. Ball falls to screen center (50% x, 45% y).
 * 3. Ball morphs/converts directly into a glowing Sci-Fi Tactical Helmet with energetic shockwaves.
 * 4. Nav menu items burst directly OUT of the ball/helmet radially with energy connectors.
 * 5. Menu items arc smoothly up into the top navbar line, unlocking the site.
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
  const helmetRef = useRef(null);
  const menuBurstRef = useRef(null);

  // Navbar Energy Line Refs
  const navEnergyLineRef = useRef(null);
  const navEnergyFlareRef = useRef(null);
  const energyConduitRef = useRef(null);
  const particlesCanvasRef = useRef(null);

  const menuItems = [
    { label: 'HOME', section: 'hero' },
    { label: 'STUDIO', section: 'about' },
    { label: 'SERVICES', section: 'services' },
    { label: 'WORK', section: 'work' },
    { label: 'CONTACT', section: 'contact' },
  ];

  const handleFinish = () => {
    soundEngine.playEscapementClick();
    soundEngine.playPlateSlide();

    // Ensure all navbar and hero elements are 100% visible and interactive
    gsap.set([
      '.nav-header',
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
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'all',
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
    const helmet = helmetRef.current;
    const menuBurst = menuBurstRef.current;
    const navLine = navEnergyLineRef.current;
    const navFlare = navEnergyFlareRef.current;
    const conduit = energyConduitRef.current;
    const canvas = particlesCanvasRef.current;

    const isMobile = window.innerWidth < 768;

    // ----------------------------------------------------
    // Particle Dust Canvas Setup
    // ----------------------------------------------------
    let animId;
    let particles = [];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = isMobile ? 20 : 40;
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
    // Master GSAP Timeline — Ball -> Morph Helmet -> Menu Burst
    // ----------------------------------------------------
    const masterTl = gsap.timeline({
      onComplete: handleFinish,
    });

    // Initial States
    gsap.set(container, { opacity: 1 });
    gsap.set(aircraft, {
      x: -240,
      y: -120,
      scale: 0.3,
      rotate: 24,
      opacity: 0,
      transformPerspective: 1200,
    });
    gsap.set(sphere, {
      top: '18%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.3,
      opacity: 0,
    });
    gsap.set(helmet, {
      top: '45%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      rotateY: -180,
    });
    if (sphereGlow) gsap.set(sphereGlow, { opacity: 0, scale: 0.5 });
    if (sphereTrail) gsap.set(sphereTrail, { opacity: 0, scaleY: 0, left: '50%' });
    if (shockwave) gsap.set(shockwave, { scale: 0, opacity: 0, left: '50%', top: '45%' });
    if (conduit) gsap.set(conduit, { opacity: 0, scaleY: 0 });
    if (navLine) gsap.set(navLine, { scaleX: 0, opacity: 0 });
    if (navFlare) gsap.set(navFlare, { opacity: 0, left: '0%' });

    gsap.set('.menu-burst-item', { scale: 0, opacity: 0, x: 0, y: 0 });

    // Initial state for all Navbar elements
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
    ], {
      opacity: 0,
    });

    // ----------------------------------------------------
    // PHASE 1: Aircraft Flight & Payload Release (0.3s - 1.5s)
    // ----------------------------------------------------
    masterTl.to(aircraft, {
      x: window.innerWidth * 0.5 - 75,
      y: window.innerHeight * 0.16,
      scale: 1.0,
      rotate: 20,
      opacity: 1,
      duration: 1.15,
      ease: 'power2.out',
      onStart: () => soundEngine.playPlateSlide(),
    }, 0.3);

    if (thruster) {
      masterTl.to(thruster, {
        scaleX: 1.4,
        opacity: 0.95,
        duration: 0.35,
        repeat: 2,
        yoyo: true,
      }, 0.4);
    }

    // Aircraft drops ball payload at center top
    masterTl.call(() => {
      soundEngine.playEscapementClick();
    }, null, 1.4);

    masterTl.to(sphere, {
      opacity: 1,
      scale: 0.7,
      duration: 0.25,
      ease: 'power2.out',
    }, 1.45);

    // Aircraft exits into dark sky
    masterTl.to(aircraft, {
      x: window.innerWidth + 240,
      y: -180,
      scale: 0.55,
      rotate: 14,
      opacity: 0,
      duration: 1.0,
      ease: 'power2.in',
    }, 1.55);

    // ----------------------------------------------------
    // PHASE 2: Ball Falls to Center (1.5s - 2.5s)
    // ----------------------------------------------------
    if (sphereTrail) {
      masterTl.fromTo(sphereTrail, {
        top: '18%',
        xPercent: -50,
        height: '0px',
        opacity: 0,
      }, {
        height: '180px',
        opacity: 0.8,
        duration: 0.5,
        ease: 'power2.out',
      }, 1.55);

      masterTl.to(sphereTrail, {
        height: '0px',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      }, 2.15);
    }

    // Ball falls vertically to screen center
    masterTl.to(sphere, {
      top: '45%',
      scale: 1.1,
      duration: 1.0,
      ease: 'power3.inOut',
      onStart: () => soundEngine.playRatchetTick(820),
    }, 1.55);

    // ----------------------------------------------------
    // PHASE 3: Ball Morphs/Converts into Sci-Fi Helmet (2.5s - 3.4s)
    // ----------------------------------------------------
    masterTl.call(() => {
      soundEngine.playCelestialLock();
    }, null, 2.45);

    // Shockwave ring burst upon impact
    if (shockwave) {
      masterTl.fromTo(shockwave, {
        scale: 0.1,
        opacity: 0.95,
      }, {
        scale: 2.8,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.out',
      }, 2.45);
    }

    // Sphere dissolves as Sci-Fi Helmet materializes
    masterTl.to(sphere, {
      scale: 0.1,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 2.45);

    masterTl.to(helmet, {
      opacity: 1,
      scale: 1.2,
      rotateY: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, 2.5);

    // ----------------------------------------------------
    // PHASE 4: Navigation Menu Items Burst OUT of Helmet (3.3s - 4.4s)
    // ----------------------------------------------------
    masterTl.call(() => {
      soundEngine.playEscapementClick();
    }, null, 3.25);

    // Radial Menu Burst animation
    const radius = isMobile ? 110 : 160;
    const angles = [-140, -100, -60, -20, 20]; // Arced angles pointing upwards

    menuItems.forEach((_, idx) => {
      const angleRad = (angles[idx] * Math.PI) / 180;
      const targetX = Math.sin(angleRad) * radius;
      const targetY = Math.cos(angleRad) * radius * -0.7 - 20;

      masterTl.to(`.menu-burst-item-${idx}`, {
        opacity: 1,
        scale: 1,
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: 'back.out(2.0)',
      }, 3.3 + idx * 0.08);
    });

    // ----------------------------------------------------
    // PHASE 5: Energy Conduit Rises to Navbar & Items Arc Up (4.1s - 5.1s)
    // ----------------------------------------------------
    if (conduit) {
      masterTl.fromTo(conduit, {
        top: '45%',
        left: '50%',
        height: '0px',
        opacity: 0,
      }, {
        top: '48px',
        height: '38vh',
        opacity: 0.9,
        duration: 0.45,
        ease: 'power2.out',
        onStart: () => soundEngine.playPlateSlide(),
      }, 4.1);

      masterTl.to(conduit, {
        opacity: 0,
        duration: 0.3,
      }, 4.5);
    }

    // Navbar energy line draws across
    if (navLine) {
      masterTl.fromTo(navLine, {
        scaleX: 0,
        opacity: 1,
      }, {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.inOut',
        onStart: () => soundEngine.playRatchetTick(960),
      }, 4.3);
    }

    if (navFlare) {
      masterTl.fromTo(navFlare, {
        left: '0%',
        opacity: 1,
      }, {
        left: '100%',
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      }, 4.3);
    }

    // Menu burst items fly from radial positions up into Navbar positions
    menuItems.forEach((_, idx) => {
      masterTl.to(`.menu-burst-item-${idx}`, {
        y: -window.innerHeight * 0.38,
        opacity: 0,
        scale: 0.5,
        duration: 0.45,
        ease: 'power2.in',
      }, 4.4 + idx * 0.06);
    });

    // Reveal final Navbar elements
    masterTl.fromTo('.nav-logo', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.5)' }, 4.4);
    masterTl.fromTo('.nav-item-hero', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25 }, 4.5);
    masterTl.fromTo('.nav-item-about', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25 }, 4.6);
    masterTl.fromTo('.nav-item-services', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25 }, 4.7);
    masterTl.fromTo('.nav-item-work', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25 }, 4.8);
    masterTl.fromTo('.nav-item-contact', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25 }, 4.9);
    masterTl.fromTo('.nav-cta-btn', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }, 5.0);

    // Fade out entrance container
    masterTl.to(helmet, {
      opacity: 0,
      scale: 0.8,
      duration: 0.45,
      ease: 'power2.inOut',
    }, 5.0);

    masterTl.to(container, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 5.1);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      masterTl.kill();
    };
  }, [isReady]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99998] bg-[#05070a] pointer-events-auto select-none overflow-hidden flex items-center justify-center"
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
      {/* 2. DROPPED GOLDEN BALL PAYLOAD                       */}
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
          className="absolute inset-0 rounded-full bg-[#dfb776]/40 blur-[20px] pointer-events-none"
        />
        <div
          className="relative w-14 h-14 rounded-full shadow-[0_0_35px_#dfb776,0_0_70px_rgba(223,183,118,0.6),inset_-4px_-4px_10px_rgba(0,0,0,0.8),inset_4px_4px_12px_rgba(255,255,255,0.9)]"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #fff2c6 18%, #dfb776 48%, #9e7530 78%, #362408 100%)',
          }}
        >
          <div className="absolute top-2 left-2.5 w-3.5 h-2 rounded-full bg-white/90 blur-[0.6px] -rotate-30" />
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MORPHED TACTICAL FLIGHT HELMET CORE (SIDE PROFILE) */}
      {/* ---------------------------------------------------- */}
      <div
        ref={helmetRef}
        className="absolute z-40 pointer-events-none flex flex-col items-center justify-center w-56 h-56 sm:w-72 sm:h-72"
      >
        <svg
          viewBox="0 0 240 220"
          className="w-full h-full drop-shadow-[0_0_45px_rgba(255,255,255,0.35)] overflow-visible"
        >
          <defs>
            <linearGradient id="flight-shell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f1f5f9" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="visor-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="70%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            <linearGradient id="yellow-decals" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="hose-metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Outer Holographic Radar Reticle */}
          <circle cx="120" cy="110" r="102" fill="none" stroke="#dfb776" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
          <circle cx="120" cy="110" r="92" fill="none" stroke="#38bdf8" strokeWidth="0.75" opacity="0.35" />

          {/* Flexible Oxygen Hose Tubes (Coiling Below) */}
          <path d="M 65,145 C 50,175 75,200 120,195 C 160,190 185,170 170,140" fill="none" stroke="url(#hose-metal)" strokeWidth="16" strokeLinecap="round" />
          <path d="M 65,145 C 50,175 75,200 120,195 C 160,190 185,170 170,140" fill="none" stroke="#00f0ff" strokeWidth="2" strokeDasharray="3 4" opacity="0.7" />

          <path d="M 80,150 C 70,185 95,205 135,198 C 175,190 190,165 178,135" fill="none" stroke="url(#hose-metal)" strokeWidth="12" strokeLinecap="round" />

          {/* Main Aerodynamic White Composite Helmet Shell */}
          <path
            d="M 120,25 C 65,25 35,60 30,105 C 28,125 45,145 65,150 L 140,150 C 180,145 200,120 195,85 C 190,45 160,25 120,25 Z"
            fill="url(#flight-shell)"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* Side Black Carbon Facet Band */}
          <path d="M 70,40 L 180,68 C 190,80 185,100 175,105 L 85,75 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.75" />

          {/* Yellow Tactical Accent Decals */}
          <polygon points="145,105 168,98 165,120 148,125" fill="url(#yellow-decals)" stroke="#ffffff" strokeWidth="0.5" />

          {/* Side Filter / Ear Module Box */}
          <rect x="135" y="95" width="38" height="32" rx="6" fill="#1e293b" stroke="url(#yellow-decals)" strokeWidth="1.5" />
          <polygon points="148,102 165,102 165,120 148,120" fill="url(#yellow-decals)" />

          {/* Spherical Bubble Visor (Dark Glass with HUD Glint) */}
          <path
            d="M 30,90 C 22,110 32,138 58,142 C 82,145 102,130 108,110 C 112,90 95,70 65,72 C 45,74 34,80 30,90 Z"
            fill="url(#visor-glass)"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />

          {/* HUD Reticle Glint & Target Crosshairs inside Visor */}
          <circle cx="58" cy="105" r="16" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 2" className="animate-spin" />
          <line x1="58" y1="84" x2="58" y2="126" stroke="#00f0ff" strokeWidth="0.75" opacity="0.8" />
          <line x1="37" y1="105" x2="79" y2="105" stroke="#00f0ff" strokeWidth="0.75" opacity="0.8" />
          <path d="M 38,94 L 46,90 L 52,98" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />

          {/* Helmet Crest Vent Ribs */}
          <line x1="110" y1="32" x2="160" y2="44" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="105" y1="38" x2="155" y2="50" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        <span className="font-mono text-[9.5px] text-[#00f0ff] tracking-[0.25em] uppercase font-bold mt-1 drop-shadow-[0_0_8px_#00f0ff]">
          TACTICAL FLIGHT HELMET CORE
        </span>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. RADIAL MENU ITEMS BURSTING FROM HELMET            */}
      {/* ---------------------------------------------------- */}
      <div ref={menuBurstRef} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
        {menuItems.map((item, idx) => (
          <div
            key={item.label}
            className={`menu-burst-item menu-burst-item-${idx} absolute px-3.5 py-1.5 rounded-full bg-[#0a0d14]/90 border border-[#dfb776]/50 shadow-[0_0_20px_rgba(223,183,118,0.4)] backdrop-blur-md flex items-center gap-2 text-white font-mono text-xs tracking-widest uppercase font-bold`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Activation Shockwave */}
      <div
        ref={shockwaveRef}
        className="absolute w-72 h-72 rounded-full border border-[#dfb776] z-20 pointer-events-none opacity-0 shadow-[0_0_40px_#dfb776]"
      />

      {/* Energy Conduit Line from Helmet up to Navbar */}
      <div
        ref={energyConduitRef}
        className="absolute w-[2px] bg-gradient-to-t from-[#dfb776] via-[#00f0ff] to-white z-30 pointer-events-none -translate-x-1/2 shadow-[0_0_15px_#00f0ff]"
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
