import React from 'react';

export default function BuildIntroHUD({ progress, isBuilt, onSkip }) {
  if (isBuilt) return null;

  const getStageText = (p) => {
    if (p < 30) return 'INITIALIZING SPATIAL SCENE';
    if (p < 70) return 'CALIBRATING 3D ARTIFACT';
    return 'FINALIZING EXPERIENCE';
  };

  const percentage = Math.min(100, Math.round(progress * 100));

  return (
    <div className="fixed inset-x-0 bottom-10 z-40 flex flex-col items-center justify-center pointer-events-auto select-none px-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-2.5 max-w-sm w-full p-3.5 px-5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(226,201,146,0.1)]">
        
        {/* Readout Header */}
        <div className="flex items-center justify-between w-full font-mono text-[11px] text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            <span>{getStageText(percentage)}</span>
          </div>
          <span className="font-semibold text-white">{percentage}%</span>
        </div>

        {/* Minimal Gold Progress Track */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-300 via-amber-200 to-white rounded-full shadow-[0_0_10px_rgba(226,201,146,0.5)] transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Studio Sub-label & Skip */}
        <div className="flex items-center justify-between w-full pt-0.5 text-[10px] font-mono text-slate-400">
          <span>STAR SOLUTIONS · SPATIAL WEB</span>
          <button
            onClick={onSkip}
            className="text-slate-400 hover:text-amber-200 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Enter Now →
          </button>
        </div>
      </div>
    </div>
  );
}
