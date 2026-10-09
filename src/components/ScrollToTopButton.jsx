import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    soundEngine.playEscapementClick();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => soundEngine.playRatchetTick(850)}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-amber-300/60 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(223,183,118,0.25)] backdrop-blur-xl text-amber-200 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto group"
    >
      <span className="font-bold text-lg transition-transform duration-300 group-hover:-translate-y-1">
        ↑
      </span>
    </button>
  );
}
