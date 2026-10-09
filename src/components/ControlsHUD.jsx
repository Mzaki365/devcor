import React from 'react';

export default function ControlsHUD({
  themeColor,
  setThemeColor,
  secondaryColor,
  setSecondaryColor,
  wireframe,
  setWireframe,
  speed,
  setSpeed
}) {
  const themes = [
    { name: 'Cyan Nova', primary: '#00f0ff', secondary: '#a855f7' },
    { name: 'Cyber Violet', primary: '#c084fc', secondary: '#3b82f6' },
    { name: 'Solar Gold', primary: '#fbbf24', secondary: '#f97316' },
    { name: 'Matrix Green', primary: '#10b981', secondary: '#06b6d4' },
  ];

  return (
    <div className="hidden sm:flex flex-col fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-[0_16px_36px_rgba(0,0,0,0.7),0_0_20px_rgba(0,240,255,0.1)] w-72 pointer-events-auto transition-all">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">⚡</span>
          <span className="font-mono text-xs font-bold text-white tracking-wider">3D Controller</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400">WebGL 60fps</span>
      </div>

      <div className="space-y-3">
        {/* Color themes */}
        <div>
          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1.5 tracking-wider">Core Frequency:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {themes.map((t) => (
              <button
                key={t.name}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                  themeColor === t.primary 
                    ? 'border-cyan-400 bg-white/10 text-white shadow-[0_0_10px_rgba(0,240,255,0.25)]' 
                    : 'border-white/5 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
                }`}
                onClick={() => {
                  setThemeColor(t.primary);
                  setSecondaryColor(t.secondary);
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.primary }}></span>
                <span className="truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed & Wireframe Toggles */}
        <div className="flex items-end gap-2 pt-1 border-t border-white/5">
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 tracking-wider">Spin:</label>
            <div className="flex gap-1">
              {[0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  className={`flex-1 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    speed === s 
                      ? 'bg-cyan-400 text-slate-950 font-bold' 
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 tracking-wider">Lattice:</label>
            <button
              className={`w-full py-1 px-2 rounded-md text-[11px] font-mono border transition-all cursor-pointer truncate ${
                wireframe 
                  ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400 font-semibold' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => setWireframe(!wireframe)}
            >
              {wireframe ? 'Mesh ON' : 'Solid'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
