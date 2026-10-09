import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function SectionTransitionOverlay({ activeSection, themeColor }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const ringRef = useRef(null);
  const prevSectionRef = useRef(activeSection);

  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      prevSectionRef.current = activeSection;
      setIsTransitioning(true);

      const el = ringRef.current;
      if (el) {
        gsap.fromTo(
          el,
          { scale: 0.1, opacity: 0.8, filter: 'blur(2px)' },
          {
            scale: 2.8,
            opacity: 0,
            filter: 'blur(16px)',
            duration: 0.75,
            ease: 'power3.out',
            onComplete: () => setIsTransitioning(false),
          }
        );
      }
    }
  }, [activeSection]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Expanding Chromatic Portal Shockwave */}
      <div
        ref={ringRef}
        className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border-2 will-change-transform"
        style={{
          borderColor: themeColor,
          boxShadow: `0 0 80px ${themeColor}60, inset 0 0 60px ${themeColor}40`,
        }}
      />
    </div>
  );
}
