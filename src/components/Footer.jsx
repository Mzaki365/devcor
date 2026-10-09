import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../utils/audio';
import { GSAP_EASES, unevenStagger, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ onOpenContact }) {
  const footerRef = useRef(null);
  const cardContainerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const col4Ref = useRef(null);
  const bottomBarRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cols = [col1Ref.current, col2Ref.current, col3Ref.current, col4Ref.current].filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardContainerRef.current,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(
        cardContainerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: GSAP_EASES.drift,
        }
      );

      tl.fromTo(
        cols,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: (idx) => unevenStagger(idx, 0.09),
          ease: GSAP_EASES.escapement,
        },
        '-=0.4'
      );

      if (bottomBarRef.current) {
        tl.fromTo(
          bottomBarRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.2'
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="py-16 relative pointer-events-auto" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={cardContainerRef}
          className="p-8 sm:p-14 rounded-3xl bg-slate-950/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Column 1 & 2: Brand Identity */}
            <div ref={col1Ref} className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-200/20 via-amber-300/40 to-white/60 border border-amber-300/40 flex items-center justify-center">
                  <span className="text-[10px] text-amber-200">✦</span>
                </div>
                <span className="font-editorial text-xl font-semibold tracking-wide text-white">
                  STAR SOLUTIONS
                </span>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm mb-6">
                An independent design and digital engineering firm. We craft bespoke web experiences, mobile applications, and enterprise software for forward-thinking brands.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>HQ: LONDON · NYC · REMOTE</span>
              </div>
            </div>

            {/* Column 3: Capabilities */}
            <div ref={col2Ref}>
              <h5 className="font-mono text-xs uppercase tracking-wider text-amber-200/90 font-semibold mb-4">
                Capabilities
              </h5>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400 font-light">
                <li>
                  <a href="#services" className="hover:text-amber-200 transition-colors">
                    Flagship Web Platforms
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-amber-200 transition-colors">
                    Interactive 3D WebGL
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-amber-200 transition-colors">
                    Native iOS & Android Apps
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-amber-200 transition-colors">
                    Custom SaaS & CRM Systems
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Company Index */}
            <div ref={col3Ref}>
              <h5 className="font-mono text-xs uppercase tracking-wider text-amber-200/90 font-semibold mb-4">
                Company Index
              </h5>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400 font-light">
                <li>
                  <a href="#work" className="hover:text-amber-200 transition-colors">
                    Selected Case Studies
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-amber-200 transition-colors">
                    Performance Standards
                  </a>
                </li>
                <li>
                  <a href="#tech" className="hover:text-amber-200 transition-colors">
                    Technical Philosophy
                  </a>
                </li>
                <li>
                  <a href="#hero" className="hover:text-amber-200 transition-colors">
                    Back to Top ↑
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Start a Dialogue CTA with Specular Sheen */}
            <div ref={col4Ref}>
              <h5 className="font-mono text-xs uppercase tracking-wider text-amber-200/90 font-semibold mb-4">
                Start a Dialogue
              </h5>
              <p className="text-xs sm:text-sm text-slate-400 font-light mb-4">
                Have an ambitious project in mind? We'd love to hear from you.
              </p>
              <button
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 hover:from-amber-100 hover:to-white text-slate-950 font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(226,201,146,0.3)] transition-all cursor-pointer overflow-hidden"
                onClick={() => {
                  soundEngine.playEscapementClick();
                  onOpenContact();
                }}
                onMouseEnter={() => soundEngine.playRatchetTick(880)}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                <span className="relative z-10">Commission Star Solutions</span>
                <span className="relative z-10 text-sm font-normal group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            ref={bottomBarRef}
            className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/8 gap-4 text-xs text-slate-500 font-light"
          >
            <p>© {new Date().getFullYear()} Star Solutions Inc. All rights reserved. Crafted with intention.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
