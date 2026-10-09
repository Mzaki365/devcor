import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { scrollDirector } from '../utils/scrollDirector';
import { LiquidCrystalShader } from '../shaders/liquidCrystalShader';

const SECTION_CONFIGS = {
  hero: {
    primaryColor: '#dfb776',      // Imperial Gold
    secondaryColor: '#ffffff',    // Diamond White Glint
    coreColor: '#c59b56',
    emissiveColor: '#dfb776',
    emissiveIntensity: 0.35,
    rotationSpeed: 0.6,
  },
  services: {
    primaryColor: '#e2c992',      // Warm Champagne Gold
    secondaryColor: '#38bdf8',    // Cyan Astral Glint
    coreColor: '#e2c992',
    emissiveColor: '#38bdf8',
    emissiveIntensity: 0.45,
    rotationSpeed: 1.0,
  },
  web: {
    primaryColor: '#38bdf8',      // Electric Cyan
    secondaryColor: '#00f0ff',    // Neon Cyber Blue
    coreColor: '#0284c7',
    emissiveColor: '#38bdf8',
    emissiveIntensity: 0.6,
    rotationSpeed: 1.4,
  },
  app: {
    primaryColor: '#cbd5e1',      // Titanium Silver
    secondaryColor: '#c084fc',    // Neon Violet
    coreColor: '#f8fafc',
    emissiveColor: '#a855f7',
    emissiveIntensity: 0.65,
    rotationSpeed: 1.5,
  },
  crm: {
    primaryColor: '#d4a373',      // Obsidian Copper
    secondaryColor: '#f59e0b',    // Molten Amber
    coreColor: '#f59e0b',
    emissiveColor: '#ea580c',
    emissiveIntensity: 0.7,
    rotationSpeed: 1.2,
  },
  work: {
    primaryColor: '#34d399',      // Aurora Emerald
    secondaryColor: '#fbbf24',    // Solar Gold
    coreColor: '#6ee7b7',
    emissiveColor: '#10b981',
    emissiveIntensity: 0.55,
    rotationSpeed: 1.1,
  },
  about: {
    primaryColor: '#f59e0b',      // High-Velocity Gold
    secondaryColor: '#38bdf8',    // Telemetric Cyan
    coreColor: '#ffffff',
    emissiveColor: '#f59e0b',
    emissiveIntensity: 0.75,
    rotationSpeed: 1.6,
  },
  tech: {
    primaryColor: '#818cf8',      // Quantum Indigo
    secondaryColor: '#c084fc',    // Ultraviolet
    coreColor: '#c084fc',
    emissiveColor: '#818cf8',
    emissiveIntensity: 0.65,
    rotationSpeed: 1.3,
  },
  footer: {
    primaryColor: '#dfb776',
    secondaryColor: '#c59b56',
    coreColor: '#dfb776',
    emissiveColor: '#c59b56',
    emissiveIntensity: 0.25,
    rotationSpeed: 0.7,
  },
};

export default function ArmillaryAstrolabe({ isLoaded = true, activeSection = 'hero', activeService }) {
  const currentSection = activeService || activeSection || 'hero';

  const pointerGroupRef = useRef();
  const crystalOrbRef = useRef();
  const innerCoreRef = useRef();
  const facetCageRef = useRef();
  const haloRing1Ref = useRef();
  const haloRing2Ref = useRef();
  const nodeParticlesRef = useRef();
  const shaderMatRef = useRef();

  // Custom GLSL Liquid Crystal Shader Material
  const liquidShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(LiquidCrystalShader.uniforms),
      vertexShader: LiquidCrystalShader.vertexShader,
      fragmentShader: LiquidCrystalShader.fragmentShader,
      transparent: true,
      depthWrite: true,
    });
  }, []);

  // Sleek Metallic Materials
  const coreMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dfb776'),
    roughness: 0.12,
    metalness: 0.96,
    emissive: new THREE.Color('#dfb776'),
    emissiveIntensity: 0.6,
  }), []);

  const cageWireMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dfb776'),
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    emissive: new THREE.Color('#dfb776'),
    emissiveIntensity: 0.4,
  }), []);

  const haloRingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dfb776'),
    roughness: 0.2,
    metalness: 0.9,
    emissive: new THREE.Color('#dfb776'),
    emissiveIntensity: 0.3,
  }), []);

  const targetPrimaryCol = useMemo(() => new THREE.Color(), []);
  const targetSecondaryCol = useMemo(() => new THREE.Color(), []);
  const targetCoreCol = useMemo(() => new THREE.Color(), []);
  const targetEmissiveCol = useMemo(() => new THREE.Color(), []);

  const currentSpeed = useRef(0.8);
  const scrollOffset = useRef(0);

  const { size } = useThree();

  const responsiveScale = useMemo(() => {
    const w = size.width;
    if (w < 640) return 0.38;
    if (w < 768) return 0.44;
    if (w < 1024) return 0.50;
    if (w < 1440) return 0.56;
    return 0.62;
  }, [size.width]);

  useFrame((state) => {
    const config = SECTION_CONFIGS[currentSection] || SECTION_CONFIGS.hero;
    const scrollState = scrollDirector.getState();

    // 1. Lerp Materials Colors & Emissive Intensity
    targetPrimaryCol.set(config.primaryColor);
    targetSecondaryCol.set(config.secondaryColor);
    targetCoreCol.set(config.coreColor);
    targetEmissiveCol.set(config.emissiveColor);

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      shaderMatRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
      shaderMatRef.current.uniforms.uScrollSpeed.value = scrollState.velocity || 0;
      shaderMatRef.current.uniforms.uColor1.value.lerp(targetPrimaryCol, 0.05);
      shaderMatRef.current.uniforms.uColor2.value.lerp(targetSecondaryCol, 0.05);
    }

    coreMat.color.lerp(targetCoreCol, 0.05);
    coreMat.emissive.lerp(targetSecondaryCol, 0.05);
    coreMat.emissiveIntensity = THREE.MathUtils.lerp(coreMat.emissiveIntensity, config.emissiveIntensity * 1.4, 0.05);

    cageWireMat.color.lerp(targetSecondaryCol, 0.05);
    cageWireMat.emissive.lerp(targetSecondaryCol, 0.05);

    haloRingMat.color.lerp(targetPrimaryCol, 0.05);
    haloRingMat.emissive.lerp(targetPrimaryCol, 0.05);

    // 2. Lerp Speed & Scroll Rotation
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, config.rotationSpeed, 0.04);
    scrollOffset.current = THREE.MathUtils.lerp(scrollOffset.current, scrollState.progress * Math.PI * 3, 0.08);

    const t = state.clock.getElapsedTime() * currentSpeed.current + scrollOffset.current;

    // 3. Animate Outer Crystal Orb
    if (crystalOrbRef.current) {
      crystalOrbRef.current.rotation.y = t * 0.25;
      crystalOrbRef.current.rotation.x = Math.sin(t * 0.15) * 0.12;
      crystalOrbRef.current.rotation.z = Math.cos(t * 0.12) * 0.08;
    }

    // 4. Animate Luminous Inner Core (Glow Pulse)
    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(t * 2.0) * 0.04;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
      innerCoreRef.current.rotation.y = -t * 0.35;
    }

    // 5. Animate Outer Facet Wireframe Cage
    if (facetCageRef.current) {
      facetCageRef.current.rotation.y = -t * 0.18;
      facetCageRef.current.rotation.x = t * 0.14;
    }

    // 6. Animate Sleek Orbital Halo Rings
    if (haloRing1Ref.current) {
      haloRing1Ref.current.rotation.z = Math.PI / 6 + Math.sin(t * 0.2) * 0.05;
      haloRing1Ref.current.rotation.y = t * 0.3;
    }

    if (haloRing2Ref.current) {
      haloRing2Ref.current.rotation.x = -Math.PI / 4 + Math.cos(t * 0.18) * 0.05;
      haloRing2Ref.current.rotation.y = -t * 0.25;
    }

    // 7. Animate Orbiting Micro Nodes
    if (nodeParticlesRef.current) {
      nodeParticlesRef.current.rotation.y = t * 0.15;
    }

    // 8. Gentle Cursor Parallax
    if (pointerGroupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 20;
      const targetY = (state.pointer.y * Math.PI) / 24;
      pointerGroupRef.current.rotation.y = THREE.MathUtils.lerp(pointerGroupRef.current.rotation.y, targetX, 0.04);
      pointerGroupRef.current.rotation.x = THREE.MathUtils.lerp(pointerGroupRef.current.rotation.x, -targetY, 0.04);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25} floatingRange={[-0.08, 0.08]}>
      <group ref={pointerGroupRef} position={[0, 0, 0]} scale={[responsiveScale, responsiveScale, responsiveScale]}>

        {/* Central Luminous Energy Core */}
        <mesh ref={innerCoreRef} material={coreMat}>
          <sphereGeometry args={[0.48, 32, 32]} />
        </mesh>

        {/* Liquid Metal GLSL Shader Faceted Crystal Orb */}
        <group ref={crystalOrbRef}>
          <mesh ref={(el) => { if (el) shaderMatRef.current = el.material; }} material={liquidShaderMaterial}>
            <icosahedronGeometry args={[0.92, 2]} />
          </mesh>
        </group>

        {/* Delicate Outer Facet Wireframe Shell */}
        <group ref={facetCageRef}>
          <mesh material={cageWireMat}>
            <dodecahedronGeometry args={[1.22, 0]} />
          </mesh>
        </group>

        {/* Sleek Minimal Orbital Ring 1 */}
        <group ref={haloRing1Ref}>
          <mesh material={haloRingMat}>
            <torusGeometry args={[1.65, 0.016, 16, 64]} />
          </mesh>
          {/* Accent Diamond Nodes */}
          <mesh position={[1.65, 0, 0]} material={coreMat}>
            <octahedronGeometry args={[0.055, 0]} />
          </mesh>
          <mesh position={[-1.65, 0, 0]} material={coreMat}>
            <octahedronGeometry args={[0.055, 0]} />
          </mesh>
        </group>

        {/* Sleek Minimal Orbital Ring 2 */}
        <group ref={haloRing2Ref}>
          <mesh material={haloRingMat}>
            <torusGeometry args={[1.92, 0.014, 16, 64]} />
          </mesh>
          <mesh position={[0, 1.92, 0]} material={coreMat}>
            <sphereGeometry args={[0.04, 12, 12]} />
          </mesh>
          <mesh position={[0, -1.92, 0]} material={coreMat}>
            <sphereGeometry args={[0.04, 12, 12]} />
          </mesh>
        </group>

        {/* Orbiting Starlight Micro Nodes */}
        <group ref={nodeParticlesRef}>
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const angle = (idx / 6) * Math.PI * 2;
            const r = 2.2;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * r, Math.sin(angle * 2) * 0.3, Math.sin(angle) * r]}
                material={coreMat}
              >
                <sphereGeometry args={[0.03, 12, 12]} />
              </mesh>
            );
          })}
        </group>

      </group>
    </Float>
  );
}
