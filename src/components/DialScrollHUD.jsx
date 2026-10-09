import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { scrollDirector } from '../utils/scrollDirector';
import { soundEngine } from '../utils/audio';
import { TRANSITIONS } from '../config/motionSystem';

export default function DialScrollHUD({ activeSection: _propActive = 'hero' }) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [degree, setDegree] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'HERO' },
    { id: 'services', name: 'SERVICES' },
    { id: 'work', name: 'WORK' },
    { id: 'about', name: 'METRICS' },
    { id: 'tech', name: 'TECH' },
  ];

  useEffect(() => {
    const unsubscribe = scrollDirector.subscribe((state) => {
      setScrollPercent(state.progress * 100);
      setDegree(state.degree);
      if (state.activeSection) {
        setActiveSection(state.activeSection);
      }
    });

    return unsubscribe;
  }, []);

  const handleNavClick = (sectionId, idx) => {
    soundEngine.playRatchetTick(640 + idx * 50);
    scrollDirector.scrollTo(`#${sectionId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1.25, 0.36, 1], delay: 0.5 }}
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 pointer-events-auto select-none"
    >
      {/* Astrolabe Vernier Degree Readout */}
      <div className="flex flex-col items-center gap-1 font-catalog text-[10px] text-[#c59b56] tracking-widest">
        <span className="text-[8px] text-[#828b99]">VERNIER</span>
        <span className="font-semibold">{degree.toString().padStart(3, '0')}°</span>
      </div>

      {/* Engraved Calibrated Arc Scale */}
      <div className="relative w-1.5 h-36 rounded-none bg-[#111620] border-l border-r border-[#c59b56]/20 flex flex-col justify-between py-1">
        {/* Physical Degree Hash Ticks */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-1.5 h-[1px] bg-[#c59b56]/30 self-center" />
        ))}

        {/* Vernier Cursor Index Indicator */}
        <div
          className="absolute left-[-3px] w-3 h-[2px] bg-[#c59b56] shadow-[0_0_8px_#c59b56] transition-all duration-75"
          style={{ top: `${Math.min(100, Math.max(0, scrollPercent))}%` }}
        />
      </div>

      {/* Dynamic Section Navigation Items */}
      <div className="flex flex-col gap-2.5 items-center mt-1">
        {sections.map((s, idx) => {
          const isActive = activeSection === s.id;
          return (
            <div key={s.id} className="relative flex items-center justify-center">
              <button
                className={`font-catalog text-[9.5px] tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${isActive
                    ? 'text-[#c59b56] font-bold scale-105'
                    : 'text-[#828b99]/50 hover:text-[#f4eee2]'
                  }`}
                onClick={() => handleNavClick(s.id, idx)}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHudDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#c59b56] shadow-[0_0_8px_#c59b56]"
                    transition={TRANSITIONS.escapement}
                  />
                )}
                <span>{s.name}</span>
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
