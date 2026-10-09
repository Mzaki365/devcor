import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

const CDN = 'https://threejs.org/examples';

// Pre-fetch both models
useGLTF.preload(`${CDN}/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf`);
useGLTF.preload(`${CDN}/models/gltf/FlightHelmet/glTF/FlightHelmet.gltf`);

// ── Per-section config: position, scale, rotation, opacity ────────────────
const SECTION_CONFIG = {
  hero:     { pos: [ 3.2, -0.2,  1.0 ], scale: 0.72, rotY:  0.4,  opacity: 1   },
  services: { pos: [-3.0,  0.2,  0.5 ], scale: 0.60, rotY: -0.3,  opacity: 0.8 },
  web:      { pos: [ 2.8, -0.4,  0.6 ], scale: 0.65, rotY:  0.5,  opacity: 1   },
  app:      { pos: [-2.6,  0.3,  0.4 ], scale: 0.55, rotY: -0.6,  opacity: 0.9 },
  crm:      { pos: [ 2.4, -0.2,  0.3 ], scale: 0.58, rotY:  0.3,  opacity: 0.9 },
  work:     { pos: [-3.0,  0.0,  0.5 ], scale: 0.60, rotY: -0.4,  opacity: 0.85},
  tech:     { pos: [ 2.6,  0.1,  0.4 ], scale: 0.55, rotY:  0.6,  opacity: 0.8 },
  footer:   { pos: [ 0.0,  0.0,  0.0 ], scale: 0.01, rotY:  0,    opacity: 0   },
};

const DEFAULT = SECTION_CONFIG.hero;

// ── Single GLTF model with lerped section-reactive transform ──────────────
function SectionModel({ activeSection }) {
  const { scene } = useGLTF(`${CDN}/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf`);
  const groupRef  = useRef();
  const cloned    = useMemo(() => scene.clone(true), [scene]);

  // Lerp targets
  const lerpPos   = useRef(new THREE.Vector3(...DEFAULT.pos));
  const lerpScale = useRef(DEFAULT.scale);
  const lerpRotY  = useRef(DEFAULT.rotY);
  const spinY     = useRef(0);

  useFrame((_, delta) => {
    const cfg = SECTION_CONFIG[activeSection] || DEFAULT;
    const g   = groupRef.current;
    if (!g) return;

    const spd = 1.8 * delta;

    // Lerp position
    lerpPos.current.lerp(new THREE.Vector3(...cfg.pos), spd);
    g.position.copy(lerpPos.current);

    // Lerp scale
    lerpScale.current = THREE.MathUtils.lerp(lerpScale.current, cfg.scale, spd);
    g.scale.setScalar(lerpScale.current);

    // Base rotation lerp + continuous slow spin
    lerpRotY.current  = THREE.MathUtils.lerp(lerpRotY.current, cfg.rotY, spd);
    spinY.current    += delta * 0.18;
    g.rotation.y      = lerpRotY.current + spinY.current;
    g.rotation.x      = Math.sin(spinY.current * 0.6) * 0.07;

    // Opacity on all meshes
    g.traverse(child => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(m => {
          m.transparent = true;
          m.opacity = THREE.MathUtils.lerp(m.opacity ?? 1, cfg.opacity, spd * 1.5);
        });
      }
    });
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.08}
      floatIntensity={0.18}
      floatingRange={[-0.06, 0.06]}
    >
      <group ref={groupRef}>
        <primitive object={cloned} />
      </group>
    </Float>
  );
}

// ── Exported component — drop straight into Scene3D's <Suspense> ──────────
export default function SceneModels({ activeSection = 'hero' }) {
  return <SectionModel activeSection={activeSection} />;
}
