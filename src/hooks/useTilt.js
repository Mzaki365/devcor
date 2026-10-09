import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Reusable 3D Perspective Card Tilt Hook
 * Computes rotateX, rotateY and specular glare sheen position based on cursor relative to card.
 */
export function useTilt(maxTilt = 12, perspective = 1000) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const xRot = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
    const yRot = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      // Set CSS custom properties for radial border glare tracking
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      xRot(normX * maxTilt);
      yRot(-normY * maxTilt);
    };

    const handleMouseLeave = () => {
      xRot(0);
      yRot(0);
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    };

    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = `${perspective}px`;

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(card);
    };
  }, [maxTilt, perspective]);

  return cardRef;
}
