import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundEngine } from '../utils/audio';
import { prefersReducedMotion } from '../config/motionSystem';

gsap.registerPlugin(ScrollTrigger);

export default function MechanicalOdometer({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2.0,
}) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const targetNum = typeof value === 'number' ? value : parseFloat(value) || 0;

    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${targetNum.toFixed(decimals)}${suffix}`;
      return;
    }

    const obj = { val: 0 };

    const anim = gsap.to(obj, {
      val: targetNum,
      duration: duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      onStart: () => {
        soundEngine.playRatchetTick(680);
      },
      onUpdate: () => {
        if (el) {
          el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
        }
      },
      onComplete: () => {
        if (el) {
          el.textContent = `${prefix}${targetNum.toFixed(decimals)}${suffix}`;
        }
        soundEngine.playEscapementClick();
      },
    });

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [value, decimals, duration, prefix, suffix]);

  const targetNum = typeof value === 'number' ? value : parseFloat(value) || 0;

  return (
    <span
      ref={textRef}
      className="inline-block font-editorial font-bold italic tracking-tight select-none leading-none"
    >
      {prefix}{targetNum.toFixed(decimals)}{suffix}
    </span>
  );
}
