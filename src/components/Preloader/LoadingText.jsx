import React from 'react';

export default function LoadingText({ progress }) {
  const getStatusText = (p) => {
    if (p < 25) return 'INITIALIZING QUANTUM CORE...';
    if (p < 55) return 'COMPILING 3D GLSL SHADERS...';
    if (p < 85) return 'HYDRATING WEBGL PIPELINE...';
    if (p < 100) return 'SYNCHRONIZING AUDIO ENGINE...';
    return 'SYSTEMS 100% OPERATIONAL // LAUNCHING';
  };

  return (
    <div className="flex flex-col items-center gap-1.5 text-center select-none">
      <span className="font-mono text-[10px] sm:text-xs text-cyan-400 uppercase tracking-widest animate-pulse">
        {getStatusText(progress)}
      </span>
      <span className="font-sans text-xs text-slate-400">
        Architecting Next-Generation Digital Experiences
      </span>
    </div>
  );
}
