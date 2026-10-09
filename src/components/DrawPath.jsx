import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../config/motion';

export default function DrawPath({
  d,
  className = '',
  stroke = '#c59b56',
  strokeWidth = 1,
  duration = 1.4,
  delay = 0,
  trigger = true
}) {
  const pathRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: duration,
      delay: delay,
      ease: MOTION.gsapEase.inkDraw,
    });
  }, [trigger, duration, delay]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  );
}
