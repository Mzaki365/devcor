import React, { useRef, useEffect } from 'react';
import { useTilt } from '../hooks/useTilt';
import { soundEngine } from '../utils/audio';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Splits a string into <span> chars, returns the spans and a ref collector
function TypewriterText({ text, className, style, tag: Tag = 'span', charRefs }) {
  return (
    <Tag className={className} style={style}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          ref={el => { if (charRefs) charRefs.current.push(el); }}
          style={{ opacity: 0, display: ch === ' ' ? 'inline' : 'inline-block' }}
        >
          {ch === ' ' ? '\u00a0' : ch}
        </span>
      ))}
    </Tag>
  );
}

export default function ServiceCard({
  service,
  isSelected,
  onSelect,
  onOpenContact,
}) {
  const cardRef = useTilt(isSelected ? 7 : 0, 1000);
  const containerRef = useRef(null);

  // Char ref buckets for each text block
  const tagChars         = useRef([]);
  const titleChars       = useRef([]);
  const descChars        = useRef([]);
  const labelChars       = useRef([]);
  const deliverableChars = useRef([]); // flat list of all deliverable chars

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reset all to invisible
    const allChars = [
      ...tagChars.current,
      ...titleChars.current,
      ...descChars.current,
      ...labelChars.current,
      ...deliverableChars.current,
    ].filter(Boolean);
    gsap.set(allChars, { opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 100%',
          toggleActions: 'play none none reverse',
        },
      });

      // Helper: stagger a char array into the timeline at a given label
      const typeIn = (chars, at, interval = 0.022, sound = false) => {
        chars.filter(Boolean).forEach((ch, i) => {
          tl.call(() => {
            ch.style.opacity = '1';
            if (sound && i % 4 === 0) soundEngine.playRatchetTick(680 + (i % 6) * 20);
          }, null, at + i * interval);
        });
        return at + chars.length * interval;
      };

      let cursor = 0;
      cursor = typeIn(tagChars.current,         cursor, 0.028);
      cursor = typeIn(titleChars.current,        cursor + 0.05, 0.024, true);
      cursor = typeIn(descChars.current,         cursor + 0.04, 0.012);
      cursor = typeIn(labelChars.current,        cursor + 0.06, 0.032);
      cursor = typeIn(deliverableChars.current,  cursor + 0.04, 0.010);
    }, el);

    return () => ctx.revert();
  }, [service.id]);

  return (
    <div ref={containerRef}>
      <div
        ref={cardRef}
        className={`relative w-full max-w-xl p-5 sm:p-12 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border transition-all duration-500 cursor-pointer pointer-events-auto group overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${
          isSelected
            ? `${service.borderColor} ${service.glowShadow} scale-[1.01]`
            : 'border-white/10 hover:border-amber-300/40'
        }`}
        onClick={() => {
          soundEngine.playEscapementClick();
          onSelect(service.id);
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glowing aura */}
        <div
          className={`absolute -inset-[1px] rounded-3xl pointer-events-none blur-[6px] transition-opacity duration-700 ${
            isSelected ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(500px circle at 50% 50%, ${service.color}40, transparent 75%)`,
          }}
        />

        {/* Active dot */}
        <div
          className={`absolute top-4 right-4 w-2 h-2 rounded-full pointer-events-none transition-all duration-500 ${
            isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ backgroundColor: service.color, boxShadow: `0 0 10px ${service.color}` }}
        />

        {/* Cursor sheen */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x,50%) var(--mouse-y,50%), ${service.color}18, transparent 50%)`,
          }}
        />

        {/* ── Top meta ─────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.04] text-xs font-serif group-hover:border-amber-300/40 group-hover:rotate-45 transition-all duration-300 shadow-sm"
              style={{ color: service.color }}
            >
              <span>{service.icon || '✦'}</span>
            </div>
            <span className="font-editorial text-2xl sm:text-3xl italic text-amber-200/80">
              {service.number} ·
            </span>
          </div>

          {/* Tag — typewriter */}
          <span className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.03] border border-white/8 group-hover:border-amber-300/20 transition-colors">
            <TypewriterText text={service.tag} charRefs={tagChars} />
          </span>
        </div>

        {/* ── Title — typewriter ───────────────────────────────────────── */}
        <h3 className="relative z-10 font-editorial text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight group-hover:text-amber-100 transition-colors">
          <TypewriterText text={service.title} charRefs={titleChars} />
        </h3>

        {/* ── Description — typewriter ─────────────────────────────────── */}
        <p className="relative z-10 text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-8">
          <TypewriterText text={service.desc} charRefs={descChars} />
        </p>

        {/* ── Deliverables — typewriter ────────────────────────────────── */}
        <div className="relative z-10 space-y-3 mb-10 pt-6 border-t border-white/8">
          <span className="block font-mono text-[11px] text-amber-200/70 uppercase tracking-wider mb-2">
            <TypewriterText text="Key Deliverables" charRefs={labelChars} />
          </span>
          {service.deliverables.map((d, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light">
              <span className="text-amber-300 font-serif mt-0.5">•</span>
              <span>
                <TypewriterText text={d} charRefs={deliverableChars} />
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA Button ───────────────────────────────────────────────── */}
        <div className="relative z-10">
          <button
            className="group/btn relative w-full flex items-center justify-between px-6 py-4 rounded-xl bg-white/[0.04] hover:bg-amber-200 hover:text-slate-950 border border-white/10 text-white font-medium text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer group-hover:border-amber-300/40 shadow-sm overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playEscapementClick();
              onOpenContact();
            }}
            onMouseEnter={() => soundEngine.playRatchetTick(780)}
          >
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <span className="relative z-10">Request Detailed Proposal</span>
            <span className="relative z-10 text-base font-normal group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
