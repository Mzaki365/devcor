import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';
import { useMagnetic } from '../hooks/useMagnetic';
import { scrollDirector } from '../utils/scrollDirector';
import { TRANSITIONS, CSS_EASES } from '../config/motionSystem';

function MagneticItem({ children, onClick, onMouseEnter, className, title }) {
  const magneticRef = useMagnetic(30, 0.2);
  return (
    <div ref={magneticRef} className="inline-block">
      <button
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        title={title}
      >
        {children}
      </button>
    </div>
  );
}

export default function Navbar({ onOpenContact, activeSection = 'hero', onNavigate, isLoaded = true }) {
  const [soundActive, setSoundActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState(activeSection);

  useEffect(() => {
    const unsubscribe = scrollDirector.subscribe((state) => {
      setScrolled(state.progress > 0.04);
      if (state.activeSection) {
        setCurrentActive(state.activeSection);
      }
    });
    return unsubscribe;
  }, []);

  const handleToggleSound = () => {
    const isNowActive = soundEngine.toggle();
    setSoundActive(isNowActive);
  };

  const handleNavClick = (section) => {
    soundEngine.playPlateSlide();
    if (onNavigate) {
      onNavigate(section);
    } else {
      scrollDirector.scrollTo(`#${section}`);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'Studio' },
    { id: 'services', label: 'Services' },
    { id: 'work', label: 'Work' },
    { id: 'contact', label: 'Contact', isAction: true },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={isLoaded ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1.25, 0.36, 1], delay: 0.2 }}
        className={`nav-header fixed top-0 left-0 w-full flex justify-center z-50 px-4 sm:px-8 transition-all duration-500 pointer-events-none ${scrolled ? 'pt-3' : 'pt-5'
          }`}
        style={{
          transitionTimingFunction: CSS_EASES.escapement,
        }}
      >
        {/* Sleek Floating Capsule / Pill Container */}
        <nav
          className="flex items-center justify-between w-full max-w-5xl px-3 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0a0d14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(197,155,86,0.06)] pointer-events-auto transition-all duration-300"
        >
          {/* Left: Brand Badge & Typography */}
          <div
            className="nav-logo flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => handleNavClick('hero')}
            onMouseEnter={() => soundEngine.playRatchetTick(720)}
          >
            {/* Squared Badge Icon */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#141923] border border-white/25 flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.2)] group-hover:border-white transition-all duration-300">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white">
                D
              </span>
            </div>

            {/* Brand Text: DEVCORE */}
            <div className="flex items-center font-sans tracking-tight text-sm sm:text-base font-extrabold">
              <span className="text-white">DEV</span>
              <span className="text-[#dfb776] ml-0.5">CORE</span>
            </div>
          </div>

          {/* Center: Clean Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = currentActive === item.id;
              return (
                <MagneticItem
                  key={item.id}
                  className={`nav-item-${item.id} relative text-xs lg:text-[13px] font-medium tracking-wide transition-colors cursor-pointer py-1 ${isActive ? 'text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
                    }`}
                  onClick={() => {
                    if (item.isAction) {
                      onOpenContact();
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  onMouseEnter={() => soundEngine.playRatchetTick(600)}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activePillNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      transition={TRANSITIONS.escapement}
                    />
                  )}
                </MagneticItem>
              );
            })}
          </div>

          {/* Right: Actions (EMAIL pill + Divider + Start a project CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Email Pill Button */}
            <button
              className="nav-acoustics hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-[11px] font-mono tracking-wider text-white transition-all duration-300 cursor-pointer"
              onClick={() => onOpenContact()}
              onMouseEnter={() => soundEngine.playRatchetTick(640)}
            >
              <span className="text-[12px]">✉</span>
              <span className="font-semibold uppercase tracking-widest text-[10px]">EMAIL</span>
            </button>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-[1px] h-4 bg-white/20 mx-1" />

            {/* "Start a project" High-Contrast White Pill */}
            <div className="nav-cta-btn">
              <button
                className="group relative inline-flex items-center justify-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white hover:bg-[#f8fafc] text-black font-sans font-semibold text-xs sm:text-[13px] tracking-tight shadow-[0_0_20px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_28px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => {
                  soundEngine.playEscapementClick();
                  onOpenContact();
                }}
                onMouseEnter={() => soundEngine.playRatchetTick(880)}
              >
                <span className="relative z-10">Start a project</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white text-xs cursor-pointer ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? '✕' : '≡'}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={TRANSITIONS.escapement}
            className="fixed inset-0 z-40 bg-[#0a0d14]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 pointer-events-auto md:hidden"
          >
            <div className="flex flex-col items-center gap-7 text-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className="font-sans text-2xl font-semibold text-[#f4eee2] hover:text-[#f59e0b] transition-colors cursor-pointer tracking-tight"
                  onClick={() => {
                    if (item.isAction) {
                      setMobileMenuOpen(false);
                      onOpenContact();
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}

              <button
                className="mt-4 px-7 py-3 rounded-full bg-white text-black font-semibold text-sm tracking-tight shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
              >
                Start a project →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
