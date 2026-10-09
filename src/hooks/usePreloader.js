import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useProgress } from '@react-three/drei';

export function usePreloader(onComplete) {
  const { progress: realProgress, active: loadingActive } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'ready' | 'exiting' | 'finished'
  const progressProxy = useRef({ value: 0 });
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Determine target progress (blend real asset progress with minimum timeline)
    const target = Math.max(realProgress || 0, progressProxy.current.value);

    gsap.to(progressProxy.current, {
      value: Math.max(target, 100),
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        const rounded = Math.round(progressProxy.current.value);
        setDisplayProgress(rounded);
      },
      onComplete: () => {
        const elapsed = Date.now() - startTime.current;
        const minTimeRemaining = Math.max(0, 1200 - elapsed);

        setTimeout(() => {
          setIsReady(true);
          setPhase('ready');
        }, minTimeRemaining);
      }
    });

    // Hard safety timeout fallback at 3.5s
    const fallbackTimer = setTimeout(() => {
      setIsReady(true);
      setPhase('ready');
      setDisplayProgress(100);
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, [realProgress]);

  const triggerExit = () => {
    setPhase('exiting');
    setTimeout(() => {
      setPhase('finished');
      onComplete?.();
    }, 900);
  };

  return { progress: displayProgress, isReady, phase, triggerExit };
}
