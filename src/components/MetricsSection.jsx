import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTilt } from '../hooks/useTilt';
import MechanicalOdometer from './MechanicalOdometer';
import SplitText from './SplitText';
import { GSAP_EASES, unevenStagger, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

function MetricCard({ metric, index = 0 }) {
  const cardRef = useTilt(6, 800);
  const cardWrapperRef = useRef(null);
  const borderRingRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = cardWrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      // 1. Card entry with deliberate escapement
      gsap.fromTo(
        wrapper,
        { opacity: 0, y: 30, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: unevenStagger(index, 0.08),
          ease: GSAP_EASES.escapement,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      // 2. Hairline brass border draw around metric card as odometer finishes
      if (borderRingRef.current) {
        gsap.fromTo(
          borderRingRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.4 + index * 0.1,
            ease: GSAP_EASES.drift,
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 85%',
            },
          }
        );
      }
    }, wrapper);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardWrapperRef} className="w-full">
      <div
        ref={cardRef}
        className="relative flex flex-col items-center sm:items-start p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-amber-300/30 transition-colors duration-500 group overflow-hidden pointer-events-auto select-none"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle Decorative Hairline Arc */}
        <div
          ref={borderRingRef}
          className="absolute inset-0 rounded-2xl border border-amber-300/20 pointer-events-none opacity-0"
        />

        {/* Dynamic Cursor Sheen */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${metric.color}15, transparent 60%)`,
          }}
        />

        <div className="relative z-10 flex items-center gap-3 mb-2">
          <span
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{ color: metric.color }}
          >
            <MechanicalOdometer
              value={metric.num}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.decimals}
              duration={1.8}
            />
          </span>
        </div>

        <span className="relative z-10 text-sm font-medium text-white mb-1.5">
          {metric.label}
        </span>
        <span className="relative z-10 text-xs text-slate-400 font-light">
          {metric.subtext}
        </span>
      </div>
    </div>
  );
}

export default function MetricsSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const quoteRef = useRef(null);

  const metrics = [
    {
      num: 99.99,
      prefix: '',
      suffix: '%',
      decimals: 2,
      label: 'Production Reliability SLA',
      subtext: 'High-availability Kubernetes clusters',
      color: '#e2c992',
    },
    {
      num: 48,
      prefix: '',
      suffix: '+',
      decimals: 0,
      label: 'Flagship Platforms Deployed',
      subtext: 'Web, iOS, Android & Custom SaaS',
      color: '#cbd5e1',
    },
    {
      num: 8.5,
      prefix: '',
      suffix: 'x',
      decimals: 1,
      label: 'Average Client ROI Velocity',
      subtext: 'Accelerated conversion & user growth',
      color: '#d4a373',
    },
    {
      num: 150,
      prefix: '< ',
      suffix: 'ms',
      decimals: 0,
      label: 'Global Edge Response Time',
      subtext: 'CDN optimized serverless delivery',
      color: '#94a3b8',
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: GSAP_EASES.mainspring,
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            ease: GSAP_EASES.drift,
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-5 sm:p-14 rounded-3xl bg-slate-950/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
          {/* Section Header */}
          <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-white/[0.03] border border-amber-300/30 text-xs font-mono text-amber-200 uppercase tracking-wider mb-4">
              Proven Track Record
            </span>

            <h3 className="font-editorial text-3xl sm:text-5xl font-semibold text-white leading-tight">
              Engineering Excellence <br />
              <span className="italic font-normal text-amber-200/90">at Global Scale</span>
            </h3>
          </div>

          {/* 4 Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {metrics.map((m, idx) => (
              <MetricCard key={idx} metric={m} index={idx} />
            ))}
          </div>

          {/* Client Testimonial Endorsement Box with Word-by-Word Reveal */}
          <div
            ref={quoteRef}
            className="p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/8 text-center max-w-3xl mx-auto"
          >
            <p className="font-editorial text-lg sm:text-2xl font-light italic text-slate-200 leading-relaxed mb-6">
              <SplitText
                text="“Star Solutions operates at a caliber rarely seen in modern agencies. Their synthesis of breathtaking 3D design and rock-solid engineering completely elevated our brand presence.”"
                delay={0.2}
              />
            </p>
            <div className="flex flex-col items-center gap-1">
              <span className="font-sans text-sm font-semibold text-white">Jonathan Vance</span>
              <span className="font-mono text-xs text-amber-200/80 uppercase tracking-wider">
                Managing Director, Apex Capital
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
