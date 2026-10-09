/**
 * Master Motion Tokens & Animation System for Star Solutions (Framer Motion)
 * Features pronounced directional entrances, large weightless floating amplitudes,
 * and responsive micro-interactions.
 */

// Global Spring & Easing Tokens
export const TRANSITIONS = {
  smooth: {
    duration: 0.85,
    ease: [0.16, 1, 0.3, 1], // Luxury deceleration curve
  },
  deliberate: {
    duration: 0.95,
    ease: [0.22, 1, 0.36, 1],
  },
  cardSpring: {
    type: 'spring',
    damping: 24,
    stiffness: 120,
    mass: 0.8,
  },
  fast: {
    duration: 0.3,
    ease: [0.16, 1, 0.3, 1],
  },
};

// Standard Viewport Trigger Setting (Triggers smoothly on every scroll up and down)
export const VIEWPORT_CONFIG = {
  once: false,
  amount: 0.15,
};

export const VIEWPORT_REPEAT = {
  once: false,
  amount: 0.15,
};

// 1. Stagger Container Variant
export const staggerContainer = (staggerTime = 0.12, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
      delayChildren,
    },
  },
});

// 2. Directional Scroll Entrances (LEFT, RIGHT, TOP, BOTTOM)
export const fadeFromLeft = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const fadeFromRight = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const fadeFromTop = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const fadeFromBottom = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const fadeUp = fadeFromBottom;

// 3. Scale & Center Entrances
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: TRANSITIONS.deliberate,
  },
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// 4. Badges & Marginalia Marks (from TOP)
export const badgeVariant = {
  hidden: {
    opacity: 0,
    y: -25,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// 5. Directional Card & Box Entrances
export const cardFromLeft = {
  hidden: {
    opacity: 0,
    x: -90,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: TRANSITIONS.cardSpring,
  },
};

export const cardFromRight = {
  hidden: {
    opacity: 0,
    x: 90,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: TRANSITIONS.cardSpring,
  },
};

export const cardFromBottom = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: TRANSITIONS.cardSpring,
  },
};

export const cardVariant = cardFromBottom;

export const boxFromLeft = cardFromLeft;
export const boxFromRight = cardFromRight;
export const boxFromBottom = cardFromBottom;

// 6. Large, Pronounced Continuous Floating Patterns (Smooth, buoyant, weightless)
export const floatingPatterns = {
  vertical: {
    y: [-22, 22, -22],
    transition: {
      duration: 4.8,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  largeVertical: {
    y: [-30, 30, -30],
    transition: {
      duration: 5.2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  extraLargeVertical: {
    y: [-36, 36, -36],
    transition: {
      duration: 5.6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  horizontal: {
    x: [-18, 18, -18],
    transition: {
      duration: 5.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  diagonal: {
    y: [-24, 24, -24],
    x: [-14, 14, -14],
    transition: {
      duration: 5.8,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  subtleRotate: {
    y: [-24, 24, -24],
    rotate: [-2.5, 2.5, -2.5],
    transition: {
      duration: 6.0,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  largeFloatLeft: {
    y: [-26, 26, -26],
    x: [-12, 12, -12],
    rotate: [-2, 2, -2],
    transition: {
      duration: 5.2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  largeFloatRight: {
    y: [-26, 26, -26],
    x: [12, -12, 12],
    rotate: [2, -2, 2],
    transition: {
      duration: 5.6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// 7. Interactive Micro-Interactions (Hover & Tap)
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const buttonHover = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.04,
    y: -3,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.97,
    y: 0,
  },
};

export const linkHover = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -3,
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};
