import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePreloader } from '../../hooks/usePreloader';
import LoadingScene3D from './LoadingScene3D';
import LoadingText from './LoadingText';
import { soundEngine } from '../../utils/audio';

export default function Preloader({ onLoaded }) {
  const topCurtainRef = useRef(null);
  const bottomCurtainRef = useRef(null);
  const centerContentRef = useRef(null);
  const logoRef = useRef(null);
  const scanlineRef = useRef(null);

  const { progress, isReady, phase, triggerExit } = usePreloader(() => {
    onLoaded();
  });

  // Logo entrance animation on mount
  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(
      logoRef.current,
      { scale: 0.7, opacity: 0, filter: 'blur(10px)' },
      { scale: 1.0, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' }
    );
  }, []);

  // Play audio frequency sweep as progress climbs
  useEffect(() => {
    if (progress % 10 === 0 && progress > 0) {
      soundEngine.playChargingSweep(progress);
    }
  }, [progress]);

  // Automatic cinematic exit when 100% is reached
  useEffect(() => {
    if (isReady && phase === 'ready') {
      const exitTimer = setTimeout(() => {
        handleCinematicExit();
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [isReady, phase]);

  const handleCinematicExit = () => {
    if (phase === 'exiting' || phase === 'finished') return;
    triggerExit();
    soundEngine.playWarpBlast();

    const tl = gsap.timeline();

    // 1. Center content scales and radiates outward
    tl.to(centerContentRef.current, {
      scale: 1.15,
      opacity: 0,
      filter: 'blur(16px)',
      duration: 0.55,
      ease: 'power2.inOut',
    });

    // 2. Vertical Split Shutter Curtains slide away with power4 easing
    tl.to(topCurtainRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
    }, '-=0.25');

    tl.to(bottomCurtainRef.current, {
      yPercent: 100,
      duration: 0.85,
      ease: 'power4.inOut',
    }, '<');
  };

  if (phase === 'finished') return null;

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto select-none">
      
      {/* 1. Top Shutter Curtain Panel */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-slate-950 border-b border-cyan-400/25 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10 will-change-transform"
      >
        {/* Ambient Top Glow Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Top Telemetry Header */}
        <div className="absolute top-6 left-8 flex items-center gap-3 font-mono text-[10px] text-cyan-400/70">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYS.TELEMETRY // DEVCORE_OS_v4.2</span>
        </div>
        <div className="absolute top-6 right-8 font-mono text-[10px] text-slate-500">
          SECURE_BOOT // OK
        </div>
      </div>

      {/* 2. Bottom Shutter Curtain Panel */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-950 border-t border-cyan-400/25 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] z-10 will-change-transform"
      >
        {/* Ambient Bottom Glow Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        {/* Bottom Telemetry Footer */}
        <div className="absolute bottom-6 left-8 font-mono text-[10px] text-slate-500">
          LAT: 37.7749° N, LNG: 122.4194° W
        </div>
        <div className="absolute bottom-6 right-8 font-mono text-[10px] text-emerald-400/80">
          MEMORY_BUFFER: 60FPS_LOCKED
        </div>
      </div>

      {/* 3. Cyber Laser Scanline Sweeping Vertically */}
      <div 
        ref={scanlineRef}
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] z-15 pointer-events-none animate-[scanline_3s_ease-in-out_infinite]" 
      />

      {/* 4. Center Interactive Core Content */}
      <div
        ref={centerContentRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6"
      >
        {/* Brand Logo & Specular Sweep */}
        <div ref={logoRef} className="flex items-center gap-3 mb-2">
          <div className="relative w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)] overflow-hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#00f0ff" stroke="#ffffff" strokeWidth="1" />
            </svg>
            {/* Specular Light Sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <span className="font-mono text-xl font-bold tracking-widest text-white">
            DEVCORE <span className="text-cyan-400">LABS</span>
          </span>
        </div>

        {/* 3D Quantum Gyroscope Reactor */}
        <LoadingScene3D progress={progress} isExiting={phase === 'exiting'} />

        {/* Monospace Digital Percentage */}
        <div className="flex items-baseline gap-1 font-mono text-4xl sm:text-5xl font-black text-white mb-3">
          <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
            {progress.toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-slate-500 font-normal">%</span>
        </div>

        {/* High-Tech Progress Track */}
        <div className="w-64 sm:w-88 h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 rounded-full shadow-[0_0_15px_#00f0ff] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Kinetic Telemetry Text */}
        <LoadingText progress={progress} />

        {/* Manual Click Trigger (if ready) */}
        {isReady && (
          <button
            onClick={handleCinematicExit}
            className="mt-6 px-6 py-2 rounded-full bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 font-mono text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-slate-950 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.4)] animate-bounce"
          >
            Enter Experience ➔
          </button>
        )}
      </div>

    </div>
  );
}
