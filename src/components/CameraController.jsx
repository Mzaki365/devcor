import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function getHeroCameraConfig() {
  return { pos: [0, 0, 7.5], look: [0, 0, 0], fov: 45 };
}

export default function CameraController({ onSectionChange, isBuilt = true }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.8, 6.2));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const targetFov = useRef(45);
  const currentSectionRef = useRef('hero');

  useEffect(() => {
    if (!isBuilt) {
      targetPos.current.set(0, 1.8, 6.2);
      targetLook.current.set(0, -0.2, 0);
      targetFov.current = 46;
      return;
    }

    const setHeroCam = () => {
      const heroCam = getHeroCameraConfig();
      targetPos.current.set(...heroCam.pos);
      targetLook.current.set(...heroCam.look);
      targetFov.current = heroCam.fov;
    };

    setHeroCam();

    const handleResize = () => {
      if (currentSectionRef.current === 'hero') {
        setHeroCam();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const ctx = gsap.context(() => {
      // 1. Hero Section (Right-aligned 3D Astrolabe to balance left typography)
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          currentSectionRef.current = 'hero';
          setHeroCam();
          onSectionChange?.('hero');
        },
        onEnterBack: () => {
          currentSectionRef.current = 'hero';
          setHeroCam();
          onSectionChange?.('hero');
        }
      });

      // 2. Services Overview Header
      ScrollTrigger.create({
        trigger: '#services',
        start: 'top 80%',
        end: 'top 20%',
        onEnter: () => {
          targetPos.current.set(1.6, 0.8, 6.8);
          targetLook.current.set(-0.4, 0, 0);
          targetFov.current = 44;
          onSectionChange?.('services');
        },
        onEnterBack: () => {
          targetPos.current.set(1.6, 0.8, 6.8);
          targetLook.current.set(-0.4, 0, 0);
          targetFov.current = 44;
          onSectionChange?.('services');
        }
      });

      // 3. Web & Cloud Development (Camera pans right, Core shifts right to balance left-card)
      ScrollTrigger.create({
        trigger: '#service-web',
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => {
          targetPos.current.set(-2.6, 0.3, 5.8);
          targetLook.current.set(0.7, 0, 0);
          targetFov.current = 42;
          onSectionChange?.('web');
        },
        onEnterBack: () => {
          targetPos.current.set(-2.6, 0.3, 5.8);
          targetLook.current.set(0.7, 0, 0);
          targetFov.current = 42;
          onSectionChange?.('web');
        }
      });

      // 4. Mobile App Development (Camera pans left, Core shifts left to balance right-card)
      ScrollTrigger.create({
        trigger: '#service-app',
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => {
          targetPos.current.set(2.6, -0.3, 5.8);
          targetLook.current.set(-0.7, 0, 0);
          targetFov.current = 42;
          onSectionChange?.('app');
        },
        onEnterBack: () => {
          targetPos.current.set(2.6, -0.3, 5.8);
          targetLook.current.set(-0.7, 0, 0);
          targetFov.current = 42;
          onSectionChange?.('app');
        }
      });

      // 5. Enterprise Custom Systems (Elevated perspective into data core)
      ScrollTrigger.create({
        trigger: '#service-crm',
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => {
          targetPos.current.set(-2.4, 0.5, 5.5);
          targetLook.current.set(0.6, -0.1, 0);
          targetFov.current = 40;
          onSectionChange?.('crm');
        },
        onEnterBack: () => {
          targetPos.current.set(-2.4, 0.5, 5.5);
          targetLook.current.set(0.6, -0.1, 0);
          targetFov.current = 40;
          onSectionChange?.('crm');
        }
      });

      // 6. Selected Work Portfolio (Elevated panoramic view)
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => {
          targetPos.current.set(0, 1.4, 6.6);
          targetLook.current.set(0, -0.2, 0);
          targetFov.current = 44;
          onSectionChange?.('work');
        },
        onEnterBack: () => {
          targetPos.current.set(0, 1.4, 6.6);
          targetLook.current.set(0, -0.2, 0);
          targetFov.current = 44;
          onSectionChange?.('work');
        }
      });

      // 7. Metrics & Reliability (Tight reactor focus)
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => {
          targetPos.current.set(0, -0.3, 5.2);
          targetLook.current.set(0, 0.1, 0);
          targetFov.current = 38;
          onSectionChange?.('about');
        },
        onEnterBack: () => {
          targetPos.current.set(0, -0.3, 5.2);
          targetLook.current.set(0, 0.1, 0);
          targetFov.current = 38;
          onSectionChange?.('about');
        }
      });

      // 8. Tech Stack Philosophy (Quantum Matrix wide view)
      ScrollTrigger.create({
        trigger: '#tech',
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => {
          targetPos.current.set(0, 0.2, 7.6);
          targetLook.current.set(0, 0, 0);
          targetFov.current = 46;
          onSectionChange?.('tech');
        },
        onEnterBack: () => {
          targetPos.current.set(0, 0.2, 7.6);
          targetLook.current.set(0, 0, 0);
          targetFov.current = 46;
          onSectionChange?.('tech');
        }
      });

      // 9. Footer (Resting heritage pose)
      ScrollTrigger.create({
        trigger: '#footer',
        start: 'top 80%',
        onEnter: () => {
          targetPos.current.set(0, 0.8, 7.2);
          targetLook.current.set(0, 0, 0);
          targetFov.current = 45;
          onSectionChange?.('footer');
        },
        onEnterBack: () => {
          targetPos.current.set(0, 0.8, 7.2);
          targetLook.current.set(0, 0, 0);
          targetFov.current = 45;
          onSectionChange?.('footer');
        }
      });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [camera, onSectionChange, isBuilt]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(targetLook.current);
    if (camera.fov !== targetFov.current) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, 0.05);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
