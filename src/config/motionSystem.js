/**
 * Star Solutions — Master Motion System & Token Specification
 * 
 * Philosophy: Haute-Horlogerie & Astronomical Precision
 * Eases modeled after clockwork escapements, mainspring releases, and planetary drift.
 * 
 * MASTER CONTROLS:
 * - MOTION_INTENSITY: 0 (completely still) to 1 (full cinematic mechanical motion)
 */

// Master Intensity Dial (Adjust 0.0 -> 1.0 to dial entire website motion up or down)
export const MOTION_INTENSITY = 1.0;

// Helper to check user reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// 1. Signature Custom Easing Curves (Mathematical Curves for Framer Motion, GSAP, CSS)
export const MOTION_EASES = {
  // Escapement: Fast snap with a subtle 1-2% ratchet overshoot before mechanical lock (ticks, buttons, detents)
  escapement: [0.22, 1.25, 0.36, 1],
  // Mainspring: Slow kinetic wind-up then quick release (hero headlines, section reveals)
  mainspring: [0.76, 0, 0.24, 1],
  // Drift: Heavy, slow, floating celestial inertia (3D astrolabe, parallax, large type)
  drift: [0.16, 1, 0.3, 1],
  // InkDraw: Natural calligraphic deceleration (SVG lines, path draws)
  inkDraw: [0.65, 0, 0.25, 1],
  // Aperture: Iris blade snap (shutter transitions, modals)
  aperture: [0.85, 0, 0.15, 1],
};

// GSAP string representations for exact parity
export const GSAP_EASES = {
  escapement: 'back.out(1.4)',
  escapementCrisp: 'back.out(1.8)',
  mainspring: 'power4.inOut',
  drift: 'power3.out',
  inkDraw: 'power2.inOut',
  aperture: 'expo.inOut',
};

// CSS cubic-bezier strings
export const CSS_EASES = {
  escapement: 'cubic-bezier(0.22, 1.25, 0.36, 1)',
  mainspring: 'cubic-bezier(0.76, 0, 0.24, 1)',
  drift: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inkDraw: 'cubic-bezier(0.65, 0, 0.25, 1)',
  aperture: 'cubic-bezier(0.85, 0, 0.15, 1)',
};

// 2. Duration Scale (in seconds, scaled by MOTION_INTENSITY)
export const DURATION = {
  tick: 0.15,
  snap: 0.35,
  deliberate: 0.75,
  ceremonial: 1.2,
  celestial: 2.2,
};

// 3. Spring Presets for Framer Motion
export const SPRINGS = {
  horology: {
    type: 'spring',
    damping: 24,
    stiffness: 140,
    mass: 0.8,
  },
  heavyGear: {
    type: 'spring',
    damping: 28,
    stiffness: 90,
    mass: 1.1,
  },
  reticle: {
    type: 'spring',
    damping: 18,
    stiffness: 220,
    mass: 0.5,
  },
};

// 4. Uneven Human Stagger Scale (Prevents AI-uniformity)
export const unevenStagger = (index, base = 0.08) => {
  if (prefersReducedMotion() || MOTION_INTENSITY === 0) return 0;
  const microOffsets = [0, 0.035, -0.015, 0.05, 0.01, 0.045];
  const offset = microOffsets[index % microOffsets.length] || 0;
  return (base * index + offset) * (1 / Math.max(0.2, MOTION_INTENSITY));
};

// 5. Global Motion Scaler Helper
export const scaleValue = (val) => {
  if (prefersReducedMotion()) return 0;
  return val * MOTION_INTENSITY;
};

// 6. Universal Framer Motion Standard Transitions
export const TRANSITIONS = {
  escapement: {
    duration: DURATION.deliberate,
    ease: MOTION_EASES.escapement,
  },
  mainspring: {
    duration: DURATION.ceremonial,
    ease: MOTION_EASES.mainspring,
  },
  drift: {
    duration: DURATION.deliberate,
    ease: MOTION_EASES.drift,
  },
  fast: {
    duration: DURATION.snap,
    ease: MOTION_EASES.drift,
  },
  cardSpring: SPRINGS.horology,
};

// Viewport Trigger Standards
export const VIEWPORT_STANDARD = {
  once: true,
  amount: 0.2,
};
