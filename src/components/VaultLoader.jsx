import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { soundEngine } from '../utils/audio';
import { GSAP_EASES, prefersReducedMotion } from '../config/motionSystem';

/**
 * Star Solutions — Two-Stage Entrance Loader Sequence
 * 
 * Stage 1 (Astrolabe Intro): Rotating engraved brass rings with mechanical degree countup (000° -> 360°).
 * Stage 2 (Kinetic Manifesto): Dedicated kinetic screen cycling "Design." -> "Build." -> "Innovate." 
 *                             with 3-digit bottom-right counter (000 -> 100) and bottom progress line.
 * Exit: Smooth cinematic upward aperture slide into the 3D flagship experience.
 */
export default function VaultLoader({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'manifesto' | 'opening' | 'finished'
  const containerRef = useRef(null);

  // Stage 1 (Intro Astrolabe) Refs
  const introViewRef = useRef(null);
  const astrolabeRing1 = useRef(null);
  const astrolabeRing2 = useRef(null);
  const astrolabeRing3 = useRef(null);
  const degreeTextRef = useRef(null);
  const introTagRef = useRef(null);

  // Stage 2 (Kinetic Manifesto) Refs
  const manifestoViewRef = useRef(null);
  const wordRef = useRef(null);
  const counterRef = useRef(null);
  const progressLineRef = useRef(null);
  const ringGroupRef = useRef(null);

  const words = ['Design.', 'Build.', 'Innovate.'];

  const handleFinishOpen = () => {
    if (phase === 'opening' || phase === 'finished') return;
    setPhase('opening');
    soundEngine.playEscapementClick();

    if (containerRef.current) {
      const finishTl = gsap.timeline({
        onComplete: () => {
          setPhase('finished');
          onComplete();
        },
      });

      // 1. Hold final frame for 0.35s pause, then fade out ALL manifesto elements (header text, word, counter, button) into pure black
      finishTl.to([manifestoViewRef.current, introViewRef.current, '.skip-intro-btn'], {
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.35,
      });

      // 2. Once all text & graphics have vanished into black, cleanly fade out container to pass control
      finishTl.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    } else {
      setPhase('finished');
      onComplete();
    }
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      handleFinishOpen();
      return;
    }

    const masterTl = gsap.timeline({
      onComplete: () => {
        handleFinishOpen();
      },
    });

    // ==========================================
    // STAGE 1: Astrolabe Calibration (0.0s - 1.8s)
    // ==========================================
    const degreeProxy = { val: 0 };
    masterTl.to(
      degreeProxy,
      {
        val: 360,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const rounded = Math.round(degreeProxy.val);
          if (degreeTextRef.current) {
            degreeTextRef.current.textContent = `${rounded.toString().padStart(3, '0')}°`;
          }
          if (rounded % 60 === 0 && rounded > 0 && rounded < 360) {
            soundEngine.playRatchetTick(600 + (rounded / 360) * 400);
          }
        },
      },
      0
    );

    if (astrolabeRing1.current) {
      masterTl.to(astrolabeRing1.current, { rotation: 360, duration: 1.8, ease: GSAP_EASES.escapement }, 0);
    }
    if (astrolabeRing2.current) {
      masterTl.to(astrolabeRing2.current, { rotation: -270, duration: 1.8, ease: GSAP_EASES.escapement }, 0);
    }
    if (astrolabeRing3.current) {
      masterTl.to(astrolabeRing3.current, { rotation: 180, duration: 1.8, ease: GSAP_EASES.escapement }, 0);
    }

    // Smooth dissolve of Stage 1 Intro
    masterTl.to(
      introViewRef.current,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setPhase('manifesto');
          soundEngine.playEscapementClick();
        },
      },
      1.75
    );

    // ==========================================
    // STAGE 2: Kinetic Manifesto Screen (2.0s - 4.4s)
    // ==========================================
    masterTl.fromTo(
      manifestoViewRef.current,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
      2.0
    );

    // Counter (000 -> 100) & Progress Line
    const progressProxy = { val: 0 };
    masterTl.to(
      progressProxy,
      {
        val: 100,
        duration: 2.3,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.round(progressProxy.val);
          if (counterRef.current) {
            counterRef.current.textContent = current.toString().padStart(3, '0');
          }
          if (progressLineRef.current) {
            progressLineRef.current.style.width = `${current}%`;
          }
          if (current % 20 === 0 && current > 0 && current < 100) {
            soundEngine.playRatchetTick(650 + (current / 100) * 350);
          }
        },
      },
      2.0
    );

    // 3 Words Sequence: "Design." -> "Build." -> "Innovate."
    const wordDuration = 0.72;
    words.forEach((w, idx) => {
      const startTime = 2.0 + idx * wordDuration;

      // Word Entrance
      masterTl.call(
        () => {
          if (wordRef.current) {
            wordRef.current.textContent = w;
            gsap.fromTo(
              wordRef.current,
              { y: 35, opacity: 0, filter: 'blur(8px)', skewX: -6 },
              { y: 0, opacity: 1, filter: 'blur(0px)', skewX: 0, duration: 0.38, ease: 'power3.out' }
            );
            soundEngine.playRatchetTick(740 + idx * 90);
          }
        },
        null,
        startTime
      );

      // Word Exit (unless last word)
      if (idx < words.length - 1) {
        masterTl.call(
          () => {
            if (wordRef.current) {
              gsap.to(wordRef.current, {
                y: -30,
                opacity: 0,
                filter: 'blur(6px)',
                skewX: 4,
                duration: 0.28,
                ease: 'power2.in',
              });
            }
          },
          null,
          startTime + 0.52
        );
      }
    });

    return () => {
      masterTl.kill();
    };
  }, []);

  if (phase === 'finished') return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#000000] text-[#f4eee2] select-none pointer-events-auto overflow-hidden font-sans"
    >
      {/* ---------------------------------------------------- */}
      {/* STAGE 1: Archival Astrolabe Calibration Intro        */}
      {/* ---------------------------------------------------- */}
      <div
        ref={introViewRef}
        className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${phase === 'manifesto' ? 'pointer-events-none' : ''
          }`}
      >
        <div className="relative w-56 h-56 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
          {/* Ring 1: Meridian Degree Circle */}
          <div
            ref={astrolabeRing1}
            className="absolute inset-0 rounded-full border border-[#c59b56]/40 flex items-center justify-center will-change-transform"
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-[#c59b56]/20" />
            <div className="absolute top-1 font-catalog text-[9px] text-[#c59b56]/70 tracking-widest">N 00°</div>
            <div className="absolute bottom-1 font-catalog text-[9px] text-[#c59b56]/70 tracking-widest">S 180°</div>
            <div className="absolute left-1 font-catalog text-[9px] text-[#c59b56]/70 tracking-widest">W 270°</div>
            <div className="absolute right-1 font-catalog text-[9px] text-[#c59b56]/70 tracking-widest">E 090°</div>
          </div>

          {/* Ring 2: Ecliptic Zodiac Band */}
          <div
            ref={astrolabeRing2}
            className="absolute inset-8 rounded-full border border-[#c59b56]/30 flex items-center justify-center will-change-transform"
          >
            <div className="w-full h-[1px] bg-[#c59b56]/25 rotate-45" />
            <div className="w-full h-[1px] bg-[#c59b56]/25 -rotate-45" />
          </div>

          {/* Ring 3: Horizon Reticle */}
          <div
            ref={astrolabeRing3}
            className="absolute inset-16 rounded-full border border-[#f4eee2]/20 flex items-center justify-center will-change-transform"
          >
            <div className="w-2 h-2 rounded-full bg-[#c59b56]" />
          </div>

          {/* Center Vernier Degree Display */}
          <div ref={degreeTextRef} className="absolute font-catalog text-sm text-[#c59b56] tracking-wider font-semibold">
            000°
          </div>
        </div>

        {/* Intro Brand Tag */}
        <div ref={introTagRef} className="flex flex-col items-center gap-2 text-center px-6">
          <span className="font-plate text-xs sm:text-sm tracking-[0.28em] text-[#c59b56] uppercase font-medium">
            Star Solutions · Astrometry Calibration
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* STAGE 2: Kinetic Manifesto Screen ("Design." -> "Build." -> "Innovate.") */}
      {/* ---------------------------------------------------- */}
      <div
        ref={manifestoViewRef}
        className="absolute inset-0 flex flex-col justify-between p-8 sm:p-14 opacity-0 pointer-events-none"
      >
        {/* Background Subtle Concentric Rings */}
        <div
          ref={ringGroupRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15"
        >
          <div className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full border border-white/20 absolute" />
          <div className="w-[520px] h-[520px] sm:w-[750px] sm:h-[750px] rounded-full border border-dashed border-white/10 absolute" />
          <div className="w-[720px] h-[720px] sm:w-[1050px] sm:h-[1050px] rounded-full border border-white/5 absolute" />
        </div>



        {/* Center Giant Kinetic Word */}
        <div className="relative z-10 my-auto flex items-center justify-center text-center w-full">
          <h1
            ref={wordRef}
            className="font-astronomy text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-normal italic tracking-tight text-[#f4eee2] drop-shadow-[0_4px_30px_rgba(255,255,255,0.12)] will-change-transform"
          >
            Design.
          </h1>
        </div>

        {/* Bottom Row: 3-Digit Counter & Baseline Progress Line */}
        <div className="relative z-10 w-full flex flex-col gap-4">
          <div className="flex items-baseline justify-end w-full pr-2">
            <span
              ref={counterRef}
              className="font-mono text-5xl sm:text-7xl md:text-8xl font-light italic tracking-tight text-[#f4eee2]"
            >
              000
            </span>
          </div>

          <div className="w-full h-[1.5px] bg-white/15 relative overflow-hidden">
            <div
              ref={progressLineRef}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#c59b56] via-[#dfb776] to-white shadow-[0_0_12px_rgba(223,183,118,0.8)] transition-[width] duration-75 ease-out"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Manual Skip Action */}
      <button
        onClick={handleFinishOpen}
        className="skip-intro-btn absolute bottom-6 left-8 sm:left-14 font-mono text-[10px] text-[#828b99] hover:text-[#c59b56] uppercase tracking-widest transition-colors cursor-pointer z-50 pointer-events-auto"
      >
        [ Skip Intro → ]
      </button>
    </div>
  );
}
