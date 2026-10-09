import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Preload, AdaptiveDpr, AdaptiveEvents, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import ArmillaryAstrolabe from './ArmillaryAstrolabe';
import CameraController from './CameraController';
import SceneModels from './SceneModels';
import GalaxyParticles from './GalaxyParticles';

const LIGHT_CONFIGS = {
  hero: {
    ambient: '#fcf8f0',
    ambientIntensity: 0.65,
    key: '#fff6e5',
    keyIntensity: 3.2,
    rim: '#cbd5e1',
    rimIntensity: 1.2,
    point: '#c59b56',
    pointIntensity: 2.0,
  },
  services: {
    ambient: '#f0fdf4',
    ambientIntensity: 0.7,
    key: '#e0f2fe',
    keyIntensity: 3.4,
    rim: '#38bdf8',
    rimIntensity: 1.6,
    point: '#e2c992',
    pointIntensity: 2.4,
  },
  web: {
    ambient: '#ecfeff',
    ambientIntensity: 0.75,
    key: '#bae6fd',
    keyIntensity: 3.6,
    rim: '#38bdf8',
    rimIntensity: 2.2,
    point: '#0284c7',
    pointIntensity: 3.0,
  },
  app: {
    ambient: '#fdf4ff',
    ambientIntensity: 0.75,
    key: '#f1f5f9',
    keyIntensity: 3.5,
    rim: '#c084fc',
    rimIntensity: 2.4,
    point: '#38bdf8',
    pointIntensity: 3.2,
  },
  crm: {
    ambient: '#fffbeb',
    ambientIntensity: 0.8,
    key: '#fed7aa',
    keyIntensity: 3.8,
    rim: '#f59e0b',
    rimIntensity: 2.2,
    point: '#ea580c',
    pointIntensity: 3.5,
  },
  work: {
    ambient: '#ecfdf5',
    ambientIntensity: 0.75,
    key: '#d1fae5',
    keyIntensity: 3.4,
    rim: '#34d399',
    rimIntensity: 2.0,
    point: '#fbbf24',
    pointIntensity: 2.8,
  },
  about: {
    ambient: '#fffbeb',
    ambientIntensity: 0.85,
    key: '#fef3c7',
    keyIntensity: 4.0,
    rim: '#38bdf8',
    rimIntensity: 2.5,
    point: '#f59e0b',
    pointIntensity: 3.6,
  },
  tech: {
    ambient: '#faf5ff',
    ambientIntensity: 0.75,
    key: '#e0e7ff',
    keyIntensity: 3.5,
    rim: '#818cf8',
    rimIntensity: 2.4,
    point: '#c084fc',
    pointIntensity: 3.2,
  },
  footer: {
    ambient: '#fcf8f0',
    ambientIntensity: 0.65,
    key: '#fff6e5',
    keyIntensity: 3.0,
    rim: '#cbd5e1',
    rimIntensity: 1.2,
    point: '#c59b56',
    pointIntensity: 2.0,
  },
};

function DynamicLighting({ activeSection = 'hero' }) {
  const ambientRef = useRef();
  const keyRef = useRef();
  const rimRef = useRef();
  const pointRef = useRef();

  const targetAmbient = useMemo(() => new THREE.Color(), []);
  const targetKey = useMemo(() => new THREE.Color(), []);
  const targetRim = useMemo(() => new THREE.Color(), []);
  const targetPoint = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const config = LIGHT_CONFIGS[activeSection] || LIGHT_CONFIGS.hero;

    targetAmbient.set(config.ambient);
    targetKey.set(config.key);
    targetRim.set(config.rim);
    targetPoint.set(config.point);

    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbient, 0.05);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, config.ambientIntensity, 0.05);
    }
    if (keyRef.current) {
      keyRef.current.color.lerp(targetKey, 0.05);
      keyRef.current.intensity = THREE.MathUtils.lerp(keyRef.current.intensity, config.keyIntensity, 0.05);
    }
    if (rimRef.current) {
      rimRef.current.color.lerp(targetRim, 0.05);
      rimRef.current.intensity = THREE.MathUtils.lerp(rimRef.current.intensity, config.rimIntensity, 0.05);
    }
    if (pointRef.current) {
      pointRef.current.color.lerp(targetPoint, 0.05);
      pointRef.current.intensity = THREE.MathUtils.lerp(pointRef.current.intensity, config.pointIntensity, 0.05);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.65} color="#fcf8f0" />
      <directionalLight
        ref={keyRef}
        position={[8, 12, 10]}
        intensity={3.2}
        color="#fff6e5"
      />
      <directionalLight
        ref={rimRef}
        position={[-8, -6, -6]}
        intensity={1.2}
        color="#cbd5e1"
      />
      <pointLight ref={pointRef} position={[0, 4, 2]} intensity={2.0} color="#c59b56" />
    </>
  );
}

class WebGLFallbackBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#0b0e14] flex items-center justify-center -z-10">
          <div className="w-80 h-80 rounded-full border border-[#c59b56]/20" />
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Scene3D({
  themeColor = '#c59b56',
  activeService = 'hero',
  onSectionChange,
  isLoaded = true
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    window.addEventListener('resize', checkMobile, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <WebGLFallbackBoundary>
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-auto">
        <Canvas
          frameloop={isTabHidden ? 'never' : 'always'}
          dpr={isMobile ? 1.0 : [1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            depth: true
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={45} />

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* GSAP Scroll-linked Camera Controller */}
          <CameraController onSectionChange={onSectionChange} isBuilt={isLoaded} />

          {/* Physically-based Dynamic Studio Lighting per section */}
          <DynamicLighting activeSection={activeService} />

          {/* Photorealistic HDRI Environment Lighting */}
          <Environment preset="city" />

          {/* 3D Floating Galaxy Constellation Particles */}
          <GalaxyParticles count={isMobile ? 1200 : 2600} activeService={activeService} color={themeColor} />

          <Suspense fallback={null}>
            {/* 3D Cyber Crystal Orb Centerpiece */}
            <ArmillaryAstrolabe
              isLoaded={isLoaded}
              activeService={activeService}
            />

            {/* Section-reactive GLTF model — isolated so network fetching never blocks 3D scene */}
            <Suspense fallback={null}>
              <SceneModels activeSection={activeService} />
            </Suspense>

            <Preload all />
          </Suspense>

          {/* Post-Processing Cinematic Bloom & Vignette */}
          {!isMobile && (
            <EffectComposer disableNormalPass>
              <Bloom
                intensity={0.65}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.85}
              />
              <Vignette offset={0.3} darkness={0.65} />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </WebGLFallbackBoundary>
  );
}
