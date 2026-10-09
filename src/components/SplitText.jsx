import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GSAP_EASES, prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

export default function SplitText({
  text,
  className = '',
  delay = 0,
  tag = 'span',
  trigger = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const el = containerRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      const words = el.querySelectorAll('.split-word');
      words.forEach((w) => {
        w.style.opacity = '1';
        w.style.transform = 'none';
        w.style.filter = 'none';
      });
      return;
    }

    const words = el.querySelectorAll('.split-word');
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: 25, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: (idx) => {
            const word = words[idx]?.textContent || '';
            const isPunctuation = /[,.!?“”]/.test(word);
            return delay + idx * 0.045 + (isPunctuation ? 0.06 : 0);
          },
          ease: GSAP_EASES.inkDraw,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, trigger]);

  const Tag = tag;
  const wordList = (typeof text === 'string' ? text : '').split(' ');

  return (
    <Tag ref={containerRef} className={`inline-block ${className}`}>
      {wordList.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.25em] align-baseline">
          <span className="split-word inline-block will-change-transform opacity-0">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
