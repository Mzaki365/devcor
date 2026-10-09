import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Marquee from './Marquee';
import { GSAP_EASES, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

export default function TechStackSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const marqueeWrapperRef = useRef(null);

  const row1 = [
    'Next.js 15 & React 19',
    'Three.js & WebGL / WebGPU',
    'TypeScript Architecture',
    'Headless Shopify Systems',
    'Tailwind CSS & Design Systems',
    'GSAP Kinetic Animations',
    'Custom GLSL Shaders',
    'Node.js & GraphQL Microservices',
  ];

  const row2 = [
    'Native Swift (iOS)',
    'Kotlin & Jetpack (Android)',
    'React Native Cross-Platform',
    'PostgreSQL & Redis Cache',
    'Kubernetes Cloud Orchestration',
    'AWS Serverless Edge Delivery',
    'Enterprise OAuth & RBAC',
    'Real-time WebSockets',
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

      if (marqueeWrapperRef.current) {
        gsap.fromTo(
          marqueeWrapperRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: GSAP_EASES.drift,
            scrollTrigger: {
              trigger: marqueeWrapperRef.current,
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
    <section ref={sectionRef} className="py-24 relative overflow-hidden" id="tech">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-white/[0.03] border border-amber-300/30 text-xs font-mono text-amber-200 uppercase tracking-wider mb-4 pointer-events-auto">
            Technical Philosophy
          </span>

          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-white mb-4">
            Built on Battle-Tested <br />
            <span className="italic font-normal text-amber-200/90">Modern Infrastructure</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 font-light max-w-lg mx-auto">
            Zero bloat, zero compromises. We engineer with modern stacks that guarantee longevity, security, and lightning performance.
          </p>
        </div>
      </div>

      <div ref={marqueeWrapperRef} className="space-y-4 pointer-events-auto">
        <Marquee items={row1} direction="left" speed={26} />
        <Marquee items={row2} direction="right" speed={22} />
      </div>
    </section>
  );
}
