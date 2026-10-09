import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTilt } from '../hooks/useTilt';
import { soundEngine } from '../utils/audio';
import { GSAP_EASES, unevenStagger, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, onOpenContact, index = 0 }) {
  const cardRef = useTilt(6, 1000);
  const cardWrapperRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = cardWrapperRef.current;
    if (!wrapper) return;

    const isLeft = index % 2 === 0;
    const isTop = index < 2;
    const isMobileScreen = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapper,
        {
          opacity: 0,
          x: isMobileScreen ? 0 : (isLeft ? 100 : -100),
          y: isTop ? -60 : 60,
          scale: 0.85,
          rotate: isMobileScreen ? 0 : (isLeft ? 2.5 : -2.5),
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.95,
          delay: unevenStagger(index, 0.1),
          ease: GSAP_EASES.escapement,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }, wrapper);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardWrapperRef} className="w-full">
      <div
        ref={cardRef}
        data-cursor="view"
        className="relative flex flex-col justify-between p-5 sm:p-10 rounded-3xl bg-slate-950/75 backdrop-blur-2xl border border-white/10 hover:border-amber-300/40 transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group pointer-events-auto overflow-hidden min-h-[380px] sm:min-h-[440px] cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
        }}
        onClick={() => {
          soundEngine.playEscapementClick();
          onOpenContact();
        }}
        onMouseEnter={() => soundEngine.playRatchetTick(700 + index * 40)}
      >
        {/* Dynamic Cursor Glare Sheen */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.accent}14, transparent 50%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-200 px-3.5 py-1 rounded-full bg-white/[0.03] border border-amber-300/20">
              {project.category}
            </span>
            <span className="font-mono text-xs text-slate-400">{project.year}</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-white group-hover:text-amber-100 transition-colors mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-8">
            {project.desc}
          </p>

          {/* Tech / Deliverable Badges with Micro-Hover Glint */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t, idx) => (
              <span
                key={idx}
                className="font-mono text-[11px] text-slate-400 px-3 py-1 rounded-md bg-white/[0.03] border border-white/8 group-hover:border-white/15 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Metric Impact & Action CTA with Specular Sheen */}
        <div className="relative z-10 pt-6 border-t border-white/8 flex items-center justify-between">
          <div className="flex flex-col">
            <span
              className="font-editorial text-2xl font-bold italic tracking-tight transition-transform duration-300 group-hover:scale-105"
              style={{ color: project.accent }}
            >
              {project.metric}
            </span>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              {project.metricLabel}
            </span>
          </div>

          <button
            className="group/btn relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-200 hover:text-slate-950 text-white text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer border border-white/10 group-hover:border-amber-300/30 overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playEscapementClick();
              onOpenContact();
            }}
          >
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <span className="relative z-10">View Brief</span>
            <span className="relative z-10 text-sm font-normal group-hover/btn:translate-x-1 transition-transform duration-200">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkSection({ onOpenContact }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const projects = [
    {
      title: 'Apex Capital — Global Wealth Management Platform',
      category: 'Fintech & Web Platform',
      year: '2025 · Production',
      desc: 'Architected an ultra-secure, institutional-grade portfolio dashboard with sub-second data streaming and multi-entity wealth synchronization.',
      tech: ['Next.js 15', 'TypeScript', 'WebSockets', 'Tailwind', 'PostgreSQL'],
      metric: '$4.2B+',
      metricLabel: 'Assets Monitored in Real-time',
      accent: '#e2c992',
    },
    {
      title: 'Nova Media — Premium Live Streaming & Creator App',
      category: 'iOS & Android Native App',
      year: '2025 · Production',
      desc: 'Engineered a bespoke video broadcast engine with real-time biometric tipping, low-latency WebRTC streams, and synchronized live interaction.',
      tech: ['React Native', 'Swift', 'WebRTC', 'Redis', 'AWS Edge'],
      metric: '1.4M+',
      metricLabel: 'Active Monthly Subscribers',
      accent: '#cbd5e1',
    },
    {
      title: 'Zenith Logistics — Automated Enterprise ERP Backbone',
      category: 'Enterprise CRM & Automation',
      year: '2024 · Production',
      desc: 'Custom deal pipeline intelligence and supply-chain logistics software replacing legacy spreadsheets with predictive automated workflows.',
      tech: ['React 19', 'Node.js', 'GraphQL', 'Docker', 'Kubernetes'],
      metric: '68%',
      metricLabel: 'Operational Cost Reduction',
      accent: '#d4a373',
    },
    {
      title: 'Aura Spatial — Immersive 3D Architectural Showcase',
      category: 'Interactive 3D Web Experience',
      year: '2024 · Production',
      desc: 'Photorealistic WebGL real estate visualization suite running at 60 FPS across desktop and mobile devices with zero plugin downloads.',
      tech: ['Three.js', 'GLSL Shaders', 'WebGPU', 'Vite', 'GSAP'],
      metric: '< 1.1s',
      metricLabel: 'Average First Contentful Paint',
      accent: '#94a3b8',
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: GSAP_EASES.mainspring,
            scrollTrigger: {
              trigger: headerRef.current,
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
    <section ref={sectionRef} className="py-28 relative" id="work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-amber-300/30 text-xs font-mono text-amber-200 uppercase tracking-widest mb-4 pointer-events-auto">
            Selected Portfolio
          </span>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-5">
            Engineered with Purpose, <br />
            <span className="italic font-normal bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 bg-clip-text text-transparent">
              Validated by Impact
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
            A curated selection of mission-critical platforms built in close collaboration with industry-defining partners.
          </p>
        </div>

        {/* 2x2 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, idx) => (
            <ProjectCard
              key={idx}
              project={p}
              index={idx}
              onOpenContact={onOpenContact}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
