import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useMagnetic } from '../hooks/useMagnetic';
import { soundEngine } from '../utils/audio';
import { prefersReducedMotion } from '../config/motionSystem';
import HeroInteractiveField from './HeroInteractiveField';
import MechanicalOdometer from './MechanicalOdometer';

// Heading letters configuration: DEV in white, CORE in signature golden brass (#dfb776)
const letters = [
  { char: 'D', isCore: false },
  { char: 'E', isCore: false },
  { char: 'V', isCore: false },
  { char: 'C', isCore: true },
  { char: 'O', isCore: true },
  { char: 'R', isCore: true },
  { char: 'E', isCore: true },
];

// Pre-computed subtitle structure
let currentSubIndex = 0;
const createSubWordItems = (words) =>
  words.map((word) => ({
    word,
    chars: word.split('').map((char) => ({
      char,
      idx: currentSubIndex++,
    })),
  }));

const subPrefixItems = createSubWordItems(['We', 'build']);
const subHighlightItems = createSubWordItems(['AI', 'products']);
const subSuffixItems = createSubWordItems(['that', 'scale.']);

// Pre-computed description structure
const descriptionText =
  'Devcore is a software engineering studio. We design, build and ship production software end to end — web apps, POS systems, custom platforms and AI products — engineered clean and animated to the last detail.';
const descriptionWords = descriptionText.split(' ');

let currentDescIndex = 0;
const descriptionWordItems = descriptionWords.map((word) => ({
  word,
  chars: word.split('').map((char) => ({
    char,
    idx: currentDescIndex++,
  })),
}));

export default function HeroSection({ onExplore, onOpenContact, isLoaded = true }) {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleContainerRef = useRef(null);
  const letterRefs = useRef([]);
  const titleCursorRef = useRef(null);
  const pulseSheenRef = useRef(null);

  const subLineRef = useRef(null);
  const subtitleRef = useRef(null);
  const aiProductsRef = useRef(null);
  const subCharRefs = useRef([]);
  const subCursorRef = useRef(null);

  const descRef = useRef(null);
  const descCharRefs = useRef([]);
  const descCursorRef = useRef(null);

  const ctaGroupRef = useRef(null);
  const hintRef = useRef(null);
  const metricsRef = useRef(null);

  const cta1Ref = useMagnetic(35, 0.25);
  const cta2Ref = useMagnetic(35, 0.25);

  const { scrollY } = useScroll();
  const contentParallax = useTransform(scrollY, [0, 800], [0, -40]);

  useEffect(() => {
    if (!isLoaded) return;

    if (prefersReducedMotion()) {
      letterRefs.current.forEach((el, idx) => {
        if (el) {
          gsap.set(el, {
            opacity: 1,
            color: letters[idx]?.isCore ? '#dfb776' : '#ffffff',
            textShadow: 'none',
          });
        }
      });
      subCharRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1 });
      });
      descCharRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1 });
      });
      if (titleCursorRef.current) gsap.set(titleCursorRef.current, { opacity: 0, display: 'none' });
      if (subCursorRef.current) gsap.set(subCursorRef.current, { opacity: 0, display: 'none' });
      if (descCursorRef.current) gsap.set(descCursorRef.current, { opacity: 0, display: 'none' });
      if (badgeRef.current) gsap.set(badgeRef.current, { opacity: 1, y: 0 });
      if (ctaGroupRef.current) gsap.set(ctaGroupRef.current, { opacity: 1, y: 0 });
      if (hintRef.current) gsap.set(hintRef.current, { opacity: 0.7 });
      if (metricsRef.current) gsap.set(metricsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 0. Initial Hidden States
      letterRefs.current.forEach((el, idx) => {
        if (el) {
          gsap.set(el, {
            opacity: 0,
            color: letters[idx]?.isCore ? '#dfb776' : '#ffffff',
            textShadow: 'none',
          });
        }
      });
      subCharRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0 });
      });
      descCharRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0 });
      });
      if (titleCursorRef.current) gsap.set(titleCursorRef.current, { opacity: 0, left: '0%' });
      if (subCursorRef.current) gsap.set(subCursorRef.current, { opacity: 0 });
      if (descCursorRef.current) gsap.set(descCursorRef.current, { opacity: 0 });
      if (pulseSheenRef.current) gsap.set(pulseSheenRef.current, { left: '-40%', opacity: 0 });
      if (subLineRef.current) gsap.set(subLineRef.current, { scaleX: 0, opacity: 0 });
      if (badgeRef.current) gsap.set(badgeRef.current, { opacity: 0, y: -12 });
      if (ctaGroupRef.current) gsap.set(ctaGroupRef.current, { opacity: 0, y: 15 });
      if (hintRef.current) gsap.set(hintRef.current, { opacity: 0 });
      if (metricsRef.current) gsap.set(metricsRef.current, { opacity: 0, y: 20 });

      const masterTl = gsap.timeline({
        delay: 0.35,
        onComplete: () => {
          // ----------------------------------------------------
          // CONTINUOUS LIVING AMBIENT LOOP ("DO NOT STOP")
          // ----------------------------------------------------
          // A. Periodic vibrant golden sheen across DEVCORE
          if (pulseSheenRef.current) {
            gsap.to(pulseSheenRef.current, {
              left: '140%',
              opacity: 0.75,
              duration: 1.4,
              ease: 'power2.inOut',
              repeat: -1,
              repeatDelay: 4.2,
              onRepeat: () => {
                soundEngine.playRatchetTick(920);
              },
            });
          }

          // B. Continuous gentle breathing luminescence on "AI products"
          if (aiProductsRef.current) {
            gsap.to(aiProductsRef.current, {
              color: '#dfb776',
              textShadow: '0 0 14px rgba(223, 183, 118, 0.65), 0 0 25px rgba(223, 183, 118, 0.25)',
              duration: 2.4,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          }

          // C. Ambient pulse: DEV in clean white glow, CORE in radiant golden #dfb776 glow
          letters.forEach((item, idx) => {
            const letterEl = letterRefs.current[idx];
            if (!letterEl) return;
            const isCore = item.isCore;
            gsap.to(letterEl, {
              textShadow: isCore
                ? '0 0 14px rgba(223, 183, 118, 0.75), 0 0 28px rgba(223, 183, 118, 0.35)'
                : '0 0 8px rgba(255, 255, 255, 0.45)',
              duration: 1.8,
              delay: idx * 0.22,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              repeatDelay: 3.5,
            });
          });
        },
      });

      // 1. Status Pill Badge reveal
      if (badgeRef.current) {
        masterTl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.1);
      }

      // ----------------------------------------------------
      // 2. DEVCORE TYPEWRITER LETTER-BY-LETTER REVEAL (0.35s - 1.1s)
      // DEV in pure white, CORE in signature golden brass (#dfb776)
      // ----------------------------------------------------
      masterTl.call(() => {
        const firstLetter = letterRefs.current[0];
        if (titleCursorRef.current && firstLetter) {
          titleCursorRef.current.style.left = `${firstLetter.offsetLeft}px`;
          titleCursorRef.current.style.opacity = '1';
        }
      }, null, 0.35);

      letters.forEach((item, idx) => {
        const letterEl = letterRefs.current[idx];
        if (!letterEl) return;
        const letterTime = 0.45 + idx * 0.095;
        const isCore = item.isCore;

        masterTl.call(() => {
          soundEngine.playRatchetTick(640 + idx * 45);
          letterEl.style.opacity = '1';
          if (titleCursorRef.current) {
            titleCursorRef.current.style.left = `${letterEl.offsetLeft + letterEl.offsetWidth}px`;
            // Switch caret color to gold when typing CORE
            if (isCore) {
              titleCursorRef.current.style.background = '#dfb776';
              titleCursorRef.current.style.boxShadow = '0 0 14px #dfb776, 0 0 28px rgba(223, 183, 118, 0.7)';
            }
          }
        }, null, letterTime);

        // Strike glow: pure white for DEV, warm gold (#dfb776) for CORE
        masterTl.fromTo(
          letterEl,
          {
            textShadow: isCore
              ? '0 0 26px rgba(223, 183, 118, 1), 0 0 45px rgba(223, 183, 118, 0.7)'
              : '0 0 22px rgba(255, 255, 255, 0.95), 0 0 35px rgba(255, 255, 255, 0.6)',
          },
          {
            textShadow: '0 0 0px transparent',
            duration: 0.35,
            ease: 'power2.out',
          },
          letterTime
        );
      });

      // ----------------------------------------------------
      // 3. HEADING COMPLETION & GOLDEN ENERGY PULSE (1.2s - 1.7s)
      // ----------------------------------------------------
      masterTl.call(() => {
        if (titleCursorRef.current) {
          titleCursorRef.current.style.opacity = '0';
        }
      }, null, 1.2);

      if (pulseSheenRef.current) {
        masterTl.set(pulseSheenRef.current, { opacity: 0.95, left: '-30%' }, 1.25);
        masterTl.to(pulseSheenRef.current, {
          left: '130%',
          duration: 0.65,
          ease: 'power2.out',
          onStart: () => soundEngine.playPlateSlide(),
        }, 1.25);
        masterTl.to(pulseSheenRef.current, { opacity: 0, duration: 0.2 }, 1.8);
      }

      // ----------------------------------------------------
      // 4. SUBHEADING TYPEWRITER REVEAL (1.85s - 3.1s)
      // "We build AI products that scale."
      // ----------------------------------------------------
      if (subLineRef.current) {
        masterTl.fromTo(subLineRef.current, {
          scaleX: 0,
          opacity: 0,
        }, {
          scaleX: 1,
          opacity: 0.95,
          duration: 0.5,
          ease: 'power2.out',
          onStart: () => soundEngine.playRatchetTick(880),
        }, 1.85);
      }

      let subTime = 1.95;
      subCharRefs.current.forEach((el, idx) => {
        if (!el) return;
        masterTl.call(() => {
          el.style.opacity = '1';
          if (subCursorRef.current) {
            el.appendChild(subCursorRef.current);
            subCursorRef.current.style.opacity = '1';
          }
          if (idx % 2 === 0) {
            soundEngine.playRatchetTick(780 + (idx % 5) * 30);
          }
        }, null, subTime);
        subTime += 0.012;
      });

      // Subtitle finish: hide cursor and guide line
      masterTl.call(() => {
        if (subCursorRef.current) {
          subCursorRef.current.style.opacity = '0';
        }
      }, null, subTime + 0.08);

      if (subLineRef.current) {
        masterTl.to(subLineRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        }, subTime + 0.08);
      }

      // ----------------------------------------------------
      // 5. SECONDARY DESCRIPTION TYPEWRITER REVEAL (Fast Reveal)
      // ----------------------------------------------------
      let descTime = Math.max(subTime + 0.1, 1.8);
      descCharRefs.current.forEach((el, idx) => {
        if (!el) return;
        const char = el.textContent || '';
        const isPunctuation = /[,.!?—]/.test(char);

        masterTl.call(() => {
          el.style.opacity = '1';
          if (descCursorRef.current) {
            el.appendChild(descCursorRef.current);
            descCursorRef.current.style.opacity = '1';
          }
          if (idx % 5 === 0) {
            soundEngine.playRatchetTick(620 + (idx % 4) * 25);
          }
        }, null, descTime);

        descTime += isPunctuation ? 0.015 : 0.005;
      });

      // Description finish: blink then fade cursor
      masterTl.call(() => {
        if (descCursorRef.current) {
          gsap.to(descCursorRef.current, {
            opacity: 0,
            duration: 0.6,
            delay: 0.8,
            ease: 'power2.out',
          });
        }
      }, null, descTime);

      // ----------------------------------------------------
      // 6. ACTION BUTTONS, HINT, AND METRICS
      // ----------------------------------------------------
      const ctaTime = Math.min(descTime - 0.8, 5.4);
      if (ctaGroupRef.current) {
        masterTl.to(ctaGroupRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, ctaTime);
      }
      if (hintRef.current) {
        masterTl.to(hintRef.current, { opacity: 0.7, duration: 0.7, ease: 'power2.out' }, ctaTime + 0.3);
      }
      if (metricsRef.current) {
        masterTl.to(metricsRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, ctaTime + 0.5);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const stats = [
    { num: 150, suffix: '+', label: 'PROJECTS SHIPPED' },
    { num: 8, suffix: '+', label: 'YEARS BUILDING' },
    { num: 100, suffix: '%', label: 'CLIENT RETENTION' },
    { text: '24/7', label: 'SUPPORT' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-14 px-4 sm:px-8 overflow-hidden select-none"
      id="hero"
    >
      {/* Interactive Ray / Needle Field & Digital Rain Blast Canvas */}
      <HeroInteractiveField />

      {/* Main Centered Hero Content */}
      <motion.div
        style={{ y: contentParallax }}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center my-auto w-full pointer-events-none"
      >
        {/* Top Status Pill Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl text-xs font-mono text-zinc-300 mb-8 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-default opacity-0"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>✦ Now taking new projects</span>
        </div>

        {/* 1. MASTER DEVCORE HEADING WITH TYPEWRITER LETTER-BY-LETTER REVEAL */}
        <div className="relative inline-block overflow-visible mb-4 max-w-full">
          <h1
            ref={titleContainerRef}
            className="font-sans font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[7.8rem] xl:text-[8.5rem] tracking-tight uppercase leading-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] select-none flex items-center justify-center relative flex-wrap"
          >
            {letters.map((item, idx) => (
              <span
                key={idx}
                ref={(el) => (letterRefs.current[idx] = el)}
                className={`inline-block relative transition-colors duration-200 opacity-0 ${item.isCore ? 'text-[#dfb776]' : 'text-white'
                  } ${idx === 3 ? 'ml-0.5 sm:ml-1 md:ml-2' : ''}`}
              >
                {item.char}
              </span>
            ))}

            {/* Glowing Typewriter Caret for DEVCORE */}
            <span
              ref={titleCursorRef}
              aria-hidden="true"
              className="absolute pointer-events-none z-30 opacity-0 animate-pulse"
              style={{
                width: '4px',
                top: '12%',
                bottom: '12%',
                background: '#ffffff',
                boxShadow: '0 0 12px #ffffff, 0 0 24px rgba(255, 255, 255, 0.6)',
              }}
            />
          </h1>

          {/* Golden Energy Pulse Sheen */}
          <div
            ref={pulseSheenRef}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#dfb776]/45 via-white/70 to-transparent pointer-events-none opacity-0 z-20 mix-blend-screen"
          />
        </div>

        {/* 2. SUBHEADING WITH TYPEWRITER CHARACTER-BY-CHARACTER REVEAL */}
        <div className="relative inline-block overflow-visible mb-5 max-w-full">
          {/* Thin Horizontal Guide Line */}
          <div
            ref={subLineRef}
            className="absolute -top-1 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#dfb776] to-transparent pointer-events-none opacity-0 z-20 shadow-[0_0_8px_#dfb776]"
            style={{ width: '100%', maxWidth: '440px' }}
          />

          <p
            ref={subtitleRef}
            className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-zinc-200 tracking-tight"
          >
            {subPrefixItems.map((item, wIdx) => (
              <React.Fragment key={`pre-${wIdx}`}>
                <span className="inline-block whitespace-nowrap">
                  {item.chars.map(({ char, idx }) => (
                    <span
                      key={idx}
                      ref={(el) => (subCharRefs.current[idx] = el)}
                      className="inline-block relative opacity-0"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {' '}
              </React.Fragment>
            ))}
            <span
              ref={aiProductsRef}
              className="font-mono italic font-normal text-zinc-400 inline-block transition-colors duration-300"
            >
              {subHighlightItems.map((item, wIdx) => (
                <React.Fragment key={`hi-${wIdx}`}>
                  <span className="inline-block whitespace-nowrap">
                    {item.chars.map(({ char, idx }) => (
                      <span
                        key={idx}
                        ref={(el) => (subCharRefs.current[idx] = el)}
                        className="inline-block relative opacity-0"
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  {wIdx < subHighlightItems.length - 1 && ' '}
                </React.Fragment>
              ))}
            </span>
            {' '}
            {subSuffixItems.map((item, wIdx) => (
              <React.Fragment key={`suf-${wIdx}`}>
                <span className="inline-block whitespace-nowrap">
                  {item.chars.map(({ char, idx }) => (
                    <span
                      key={idx}
                      ref={(el) => (subCharRefs.current[idx] = el)}
                      className="inline-block relative opacity-0"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {wIdx < subSuffixItems.length - 1 && ' '}
              </React.Fragment>
            ))}

            {/* Floating Subtitle Typewriter Caret */}
            <span
              ref={subCursorRef}
              aria-hidden="true"
              className="absolute pointer-events-none z-30 opacity-0 animate-pulse"
              style={{
                right: '-3px',
                top: '10%',
                bottom: '10%',
                width: '2.5px',
                background: '#dfb776',
                boxShadow: '0 0 8px #dfb776',
              }}
            />
          </p>
        </div>

        {/* 3. SECONDARY DESCRIPTION WITH TYPEWRITER CHARACTER-BY-CHARACTER REVEAL */}
        <div className="relative max-w-2xl mx-auto mb-9">
          <p
            ref={descRef}
            className="font-sans text-xs sm:text-sm md:text-base text-zinc-400 font-normal leading-relaxed text-center"
          >
            {descriptionWordItems.map((item, wIdx) => (
              <React.Fragment key={wIdx}>
                <span className="inline-block whitespace-nowrap">
                  {item.chars.map(({ char, idx }) => (
                    <span
                      key={idx}
                      ref={(el) => (descCharRefs.current[idx] = el)}
                      className="inline-block relative opacity-0"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {wIdx < descriptionWordItems.length - 1 && ' '}
              </React.Fragment>
            ))}

            {/* Floating Description Typewriter Caret */}
            <span
              ref={descCursorRef}
              aria-hidden="true"
              className="absolute pointer-events-none z-30 opacity-0 animate-pulse"
              style={{
                right: '-2.5px',
                top: '12%',
                bottom: '12%',
                width: '2px',
                background: '#dfb776',
                boxShadow: '0 0 6px #dfb776',
              }}
            />
          </p>
        </div>

        {/* Action Buttons Row */}
        <div
          ref={ctaGroupRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pointer-events-auto mb-7 opacity-0"
        >
          <div ref={cta1Ref}>
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white text-black font-sans font-semibold text-xs sm:text-sm tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.45),0_8px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.65)] hover:bg-[#f1f5f9] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              onClick={() => {
                soundEngine.playPlateSlide();
                onExplore();
              }}
              onMouseEnter={() => soundEngine.playRatchetTick(720)}
            >
              <span>View Services</span>
              <span className="text-sm font-bold">↓</span>
            </button>
          </div>

          <div ref={cta2Ref}>
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/[0.04] hover:bg-white/10 text-white font-sans font-semibold text-xs sm:text-sm tracking-tight border border-white/20 hover:border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer backdrop-blur-md"
              onClick={() => {
                soundEngine.playEscapementClick();
                onOpenContact();
              }}
              onMouseEnter={() => soundEngine.playRatchetTick(840)}
            >
              <span>Start a Project</span>
            </button>
          </div>
        </div>

        {/* Interactive Field Hint */}
        <div
          ref={hintRef}
          className="font-mono text-[10px] sm:text-[11px] text-zinc-500 tracking-[0.25em] uppercase select-none pointer-events-none opacity-0"
        >
          ✦ TOUCH THE LINES · CLICK & HOLD TO BLAST
        </div>
      </motion.div>

      {/* Bottom Horizontal Metrics Bar with Odometer Count-Up Animation */}
      <div
        ref={metricsRef}
        className="relative z-20 w-full max-w-6xl mx-auto pt-8 pb-4 border-t border-white/10 backdrop-blur-md bg-slate-950/40 rounded-2xl pointer-events-none mt-10 opacity-0"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-white italic tracking-tight mb-1">
                {stat.num !== undefined ? (
                  <MechanicalOdometer value={stat.num} suffix={stat.suffix} duration={1.8} />
                ) : (
                  stat.text
                )}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
