import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { scrollDirector } from '../utils/scrollDirector';

export default function Marquee({
  items,
  direction = 'left',
  speed = 25,
  className = '',
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const dirMultiplier = direction === 'left' ? -1 : 1;
    let xPos = 0;
    let smoothedVelocity = 0;

    const ticker = gsap.ticker.add((time, deltaTime) => {
      // Pull velocity directly from Master Scroll Director
      const currentScrollState = scrollDirector.getState();
      const rawVelocity = currentScrollState.velocity || 0;

      // Smooth inertia flywheel interpolation
      smoothedVelocity = gsap.utils.interpolate(smoothedVelocity, rawVelocity, 0.08);

      const effectiveSpeed =
        (speed + Math.min(60, Math.abs(smoothedVelocity * 14))) * (deltaTime / 1000);
      xPos += effectiveSpeed * dirMultiplier;

      const trackWidth = track.scrollWidth / 3;
      if (direction === 'left' && Math.abs(xPos) >= trackWidth) {
        xPos = 0;
      } else if (direction === 'right' && xPos >= 0) {
        xPos = -trackWidth;
      }

      gsap.set(track, { x: xPos });
    });

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, [direction, speed]);

  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden whitespace-nowrap select-none py-2 ${className}`}
    >
      <div ref={trackRef} className="inline-flex gap-4 will-change-transform">
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/8 hover:border-amber-300/40 transition-all duration-300 cursor-pointer group shadow-sm hover:scale-[1.04]"
          >
            <span className="text-[10px] text-amber-300/70 group-hover:text-amber-200 group-hover:rotate-45 transition-all duration-300">
              ✦
            </span>
            <span className="font-sans text-xs sm:text-sm font-medium tracking-wide text-slate-300 group-hover:text-white transition-colors">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
