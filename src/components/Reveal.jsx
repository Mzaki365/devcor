import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  fadeFromLeft,
  fadeFromRight,
  fadeFromTop,
  fadeFromBottom,
  scaleIn,
  fadeIn,
  floatingPatterns,
  VIEWPORT_CONFIG
} from '../config/animations';

export function RevealFromLeft({ children, className = '', delay = 0, floatAfter = false, floatPattern = 'vertical' }) {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      onAnimationComplete={() => {
        if (floatAfter) setIsEntered(true);
      }}
      animate={isEntered ? floatingPatterns[floatPattern] : undefined}
      variants={{
        hidden: fadeFromLeft.hidden,
        visible: {
          ...fadeFromLeft.visible,
          transition: { ...fadeFromLeft.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealFromRight({ children, className = '', delay = 0, floatAfter = false, floatPattern = 'vertical' }) {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      onAnimationComplete={() => {
        if (floatAfter) setIsEntered(true);
      }}
      animate={isEntered ? floatingPatterns[floatPattern] : undefined}
      variants={{
        hidden: fadeFromRight.hidden,
        visible: {
          ...fadeFromRight.visible,
          transition: { ...fadeFromRight.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealFromTop({ children, className = '', delay = 0, floatAfter = false, floatPattern = 'vertical' }) {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      onAnimationComplete={() => {
        if (floatAfter) setIsEntered(true);
      }}
      animate={isEntered ? floatingPatterns[floatPattern] : undefined}
      variants={{
        hidden: fadeFromTop.hidden,
        visible: {
          ...fadeFromTop.visible,
          transition: { ...fadeFromTop.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealFromBottom({ children, className = '', delay = 0, floatAfter = false, floatPattern = 'vertical' }) {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      onAnimationComplete={() => {
        if (floatAfter) setIsEntered(true);
      }}
      animate={isEntered ? floatingPatterns[floatPattern] : undefined}
      variants={{
        hidden: fadeFromBottom.hidden,
        visible: {
          ...fadeFromBottom.visible,
          transition: { ...fadeFromBottom.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealScale({ children, className = '', delay = 0, floatAfter = false, floatPattern = 'vertical' }) {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      onAnimationComplete={() => {
        if (floatAfter) setIsEntered(true);
      }}
      animate={isEntered ? floatingPatterns[floatPattern] : undefined}
      variants={{
        hidden: scaleIn.hidden,
        visible: {
          ...scaleIn.visible,
          transition: { ...scaleIn.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealFade({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      variants={{
        hidden: fadeIn.hidden,
        visible: {
          ...fadeIn.visible,
          transition: { ...fadeIn.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reusable FloatingElement
 * Enters smoothly from a designated direction on scroll, then seamlessly begins continuous floating.
 */
export function FloatingElement({
  children,
  className = '',
  pattern = 'vertical', // 'vertical' | 'horizontal' | 'diagonal' | 'subtleRotate'
  entrance = 'scale',   // 'left' | 'right' | 'top' | 'bottom' | 'scale' | 'fade'
  delay = 0,
}) {
  const [hasEntered, setHasEntered] = useState(false);

  const getEntranceVariants = () => {
    switch (entrance) {
      case 'left':
        return fadeFromLeft;
      case 'right':
        return fadeFromRight;
      case 'top':
        return fadeFromTop;
      case 'bottom':
        return fadeFromBottom;
      case 'fade':
        return fadeIn;
      case 'scale':
      default:
        return scaleIn;
    }
  };

  const entranceVariant = getEntranceVariants();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      onAnimationComplete={() => setHasEntered(true)}
      animate={hasEntered ? floatingPatterns[pattern] || floatingPatterns.vertical : undefined}
      variants={{
        hidden: entranceVariant.hidden,
        visible: {
          ...entranceVariant.visible,
          transition: { ...entranceVariant.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Lightweight scroll-linked Parallax wrapper
 * Moves child element slightly on scroll with hardware-accelerated GPU transform
 */
export function Parallax({ children, className = '', offset = 40, reverse = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? [offset, -offset] : [-offset, offset]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export const ParallaxElement = Parallax;
