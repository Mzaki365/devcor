import React, { useEffect, useState } from 'react';

export default function ScrollProgressHUD({ activeSection = 'hero' }) {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'hero', label: '01 · OVERVIEW' },
    { id: 'web', label: '02 · WEB' },
    { id: 'app', label: '03 · MOBILE' },
    { id: 'crm', label: '04 · SYSTEMS' },
    { id: 'work', label: '05 · WORKS' },
    { id: 'about', label: '06 · IMPACT' },
  ];

  return (
    <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 pointer-events-auto select-none">
      {/* Telemetry Index */}
      <div className="font-mono text-[9px] uppercase tracking-widest text-amber-200/70 rotate-90 origin-center mb-6">
        INDEX · {Math.round(scrollPercent).toString().padStart(2, '0')}%
      </div>

      {/* Subtle Progress Track */}
      <div className="relative w-1 h-32 rounded-full bg-white/10 overflow-hidden border border-white/5">
        <div
          className="w-full bg-gradient-to-b from-amber-300 via-amber-200 to-slate-400 rounded-full shadow-[0_0_8px_rgba(226,201,146,0.6)] transition-all duration-75"
          style={{ height: `${scrollPercent}%` }}
        />
      </div>

      {/* Node Markers */}
      <div className="flex flex-col gap-2.5 items-center mt-2">
        {sections.map((s, idx) => {
          const isActive = activeSection === s.id;
          return (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-amber-300 scale-150 shadow-[0_0_8px_rgba(226,201,146,0.8)]'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              title={s.label}
            />
          );
        })}
      </div>
    </div>
  );
}
