import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceCard from './ServiceCard';
import { GSAP_EASES, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection({ onSelectService, activeService, onOpenContact }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const card1WrapperRef = useRef(null);
  const card2WrapperRef = useRef(null);
  const card3WrapperRef = useRef(null);

  const services = [
    {
      id: 'web',
      domId: 'service-web',
      number: '01',
      tag: 'Digital Experience & Platforms',
      icon: '✦',
      title: 'Flagship Web & Digital Experiences',
      desc: 'Bespoke web applications, headless commerce systems, and interactive 3D WebGL brand platforms engineered for unmatched conversion and aesthetic distinction.',
      color: '#e2c992',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-300/40',
      glowShadow: 'shadow-[0_0_40px_rgba(226,201,146,0.18)]',
      align: 'left',
      deliverables: [
        'React 19 & Next.js 15 Full-Stack Architectures',
        'Interactive Three.js & WebGL Visual Storytelling',
        'Headless Shopify & Enterprise Commerce Systems',
        'Sub-second Global Core Web Vitals Optimization',
      ],
    },
    {
      id: 'app',
      domId: 'service-app',
      number: '02',
      tag: 'Native & Cross-Platform Mobile',
      icon: '⬡',
      title: 'Mobile Applications & Digital Products',
      desc: 'Intuitive, beautifully crafted iOS and Android applications designed with fluid physics, biometric security, and robust offline synchronization for millions of users.',
      color: '#cbd5e1',
      textColor: 'text-slate-100',
      borderColor: 'border-slate-300/40',
      glowShadow: 'shadow-[0_0_40px_rgba(203,213,225,0.18)]',
      align: 'right',
      deliverables: [
        'High-Performance Swift (iOS) & Kotlin (Android)',
        'React Native & Flutter Cross-Platform Stacks',
        'Real-time WebSockets & Edge Push Architecture',
        'App Store Optimization & Global Production Launch',
      ],
    },
    {
      id: 'crm',
      domId: 'service-crm',
      number: '03',
      tag: 'Enterprise Systems & Automation',
      icon: '❖',
      title: 'Bespoke Enterprise Software & CRM',
      desc: 'Custom CRM suites, automated deal pipelines, and mission-critical ERP systems tailored precisely to your company’s unique operational intelligence and revenue workflows.',
      color: '#d4a373',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-400/40',
      glowShadow: 'shadow-[0_0_40px_rgba(212,163,115,0.18)]',
      align: 'left',
      deliverables: [
        'Custom Revenue & Lead Pipeline Automation',
        'Executive Real-time Financial Telemetry Dashboards',
        'Bi-directional ERP, Billing & Payment Infrastructure',
        'Granular RBAC Security & Enterprise Compliance',
      ],
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Header Reveal
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

      // 2. Card 1 (Web): Pulled from Left with -3.5° rotation settle
      if (card1WrapperRef.current) {
        gsap.fromTo(
          card1WrapperRef.current,
          { opacity: 0, x: -140, y: 30, rotate: -3.5, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.95,
            ease: GSAP_EASES.escapement,
            scrollTrigger: {
              trigger: card1WrapperRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 3. Card 2 (App): Pulled from Right with +4.2° rotation settle
      if (card2WrapperRef.current) {
        gsap.fromTo(
          card2WrapperRef.current,
          { opacity: 0, x: 140, y: 30, rotate: 4.2, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.95,
            ease: GSAP_EASES.escapement,
            scrollTrigger: {
              trigger: card2WrapperRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 4. Card 3 (CRM): Pulled from Left/Bottom with -2.8° rotation settle
      if (card3WrapperRef.current) {
        gsap.fromTo(
          card3WrapperRef.current,
          { opacity: 0, x: -120, y: 60, rotate: -2.8, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.95,
            ease: GSAP_EASES.escapement,
            scrollTrigger: {
              trigger: card3WrapperRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cardRefs = [card1WrapperRef, card2WrapperRef, card3WrapperRef];

  return (
    <section ref={sectionRef} className="py-28 relative" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-24">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-amber-300/30 text-xs font-mono text-amber-200 uppercase tracking-widest mb-4 pointer-events-auto">
            Studio Capabilities
          </span>

          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-5">
            Bespoke Solutions for <br />
            <span className="italic font-normal bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 bg-clip-text text-transparent">
              Exceptional Standards
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
            Every product we engineer is designed from first principles — balancing world-class aesthetics with bulletproof architecture.
          </p>
        </div>

        {/* Directional Zig-Zag Service Cards */}
        <div className="space-y-36">
          {services.map((s, idx) => {
            const isLeft = s.align === 'left';
            return (
              <div
                key={s.id}
                id={s.domId}
                ref={cardRefs[idx]}
                className={`min-h-[60vh] flex items-center ${isLeft ? 'justify-start' : 'justify-end'
                  }`}
              >
                <ServiceCard
                  service={s}
                  isSelected={activeService === s.id}
                  onSelect={onSelectService}
                  onOpenContact={onOpenContact}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
