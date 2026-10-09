import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { scrollDirector } from '../utils/scrollDirector';

const SECTION_CONFIGS = {
  hero: {
    primaryColor: '#c59b56',      // Imperial Antique Gold
    secondaryColor: '#dfb776',    // Bright Polished Brass
    tertiaryColor: '#8c6b34',     // Dark Burnished Brass
    coreColor: '#dfb776',         // Polished Celestial Sphere
    emissiveColor: '#c59b56',
    emissiveIntensity: 0,
    roughness: 0.32,
    metalness: 0.88,
    meridianScale: 0.0001,
    equatorScale: 0.0001,
    eclipticScale: 0.0001,
    colureScale: 0.0001,
    coreScale: 0.0001,
    wireframeScale: 0.0001,
    satelliteScale: 0.0001,
    latticeScale: 0.0001,
    starPointsScale: 0.0001,
    rotationSpeed: 0.5,
    equatorTilt: 0,
    eclipticTilt: 0,
  },
  services: {
    primaryColor: '#e2c992',      // Warm Champagne Gold
    secondaryColor: '#38bdf8',    // Cyan Astral Glint
    tertiaryColor: '#78716c',
    coreColor: '#e2c992',
    emissiveColor: '#38bdf8',
    emissiveIntensity: 0.32,
    roughness: 0.25,
    metalness: 0.90,
    meridianScale: 1.08,
    equatorScale: 1.15,
    eclipticScale: 1.1,
    colureScale: 0.95,
    coreScale: 0.82,
    wireframeScale: 0.85,
    satelliteScale: 0.001,
    latticeScale: 0.001,
    starPointsScale: 0.001,
    rotationSpeed: 1.3,
    equatorTilt: Math.PI / 6,
    eclipticTilt: -Math.PI / 4,
  },
  web: {
    primaryColor: '#38bdf8',      // Electric Cyan / WebGL Blue
    secondaryColor: '#e2c992',    // Digital Gold
    tertiaryColor: '#0284c7',     // Deep Azure
    coreColor: '#38bdf8',         // Glowing Cyber Core
    emissiveColor: '#0284c7',
    emissiveIntensity: 0.6,
    roughness: 0.16,
    metalness: 0.94,
    meridianScale: 1.25,
    equatorScale: 1.35,
    eclipticScale: 1.2,
    colureScale: 1.1,
    coreScale: 0.85,
    wireframeScale: 1.35,         // Holographic Cyber Hex Cage
    satelliteScale: 0.001,
    latticeScale: 0.001,
    starPointsScale: 0.8,
    rotationSpeed: 1.8,
    equatorTilt: Math.PI / 4,
    eclipticTilt: -Math.PI / 3,
  },
  app: {
    primaryColor: '#cbd5e1',      // Titanium / Silver
    secondaryColor: '#c084fc',    // Neon Violet / Biometric Purple
    tertiaryColor: '#38bdf8',     // Swift Ice Blue
    coreColor: '#f8fafc',         // Pure Starlight Chrome
    emissiveColor: '#a855f7',
    emissiveIntensity: 0.65,
    roughness: 0.12,
    metalness: 0.96,
    meridianScale: 1.15,
    equatorScale: 1.15,
    eclipticScale: 1.3,
    colureScale: 1.25,
    coreScale: 0.70,
    wireframeScale: 0.001,
    satelliteScale: 1.2,          // Floating Diamond Prisms
    latticeScale: 0.001,
    starPointsScale: 1.0,
    rotationSpeed: 2.0,
    equatorTilt: Math.PI / 3,
    eclipticTilt: -Math.PI / 3,
  },
  crm: {
    primaryColor: '#d4a373',      // Obsidian Copper
    secondaryColor: '#f59e0b',    // Molten Amber Core
    tertiaryColor: '#78350f',     // Dark Bronze
    coreColor: '#f59e0b',         // Radiant Energy Core
    emissiveColor: '#ea580c',
    emissiveIntensity: 0.7,
    roughness: 0.22,
    metalness: 0.92,
    meridianScale: 1.35,
    equatorScale: 0.95,
    eclipticScale: 1.25,
    colureScale: 1.35,
    coreScale: 0.95,              // Expanded Data Core
    wireframeScale: 0.001,
    satelliteScale: 0.001,
    latticeScale: 1.3,            // Geometric Data Matrix Lattice
    starPointsScale: 0.6,
    rotationSpeed: 1.5,
    equatorTilt: Math.PI / 2.5,
    eclipticTilt: -Math.PI / 2.5,
  },
  work: {
    primaryColor: '#34d399',      // Aurora Emerald
    secondaryColor: '#fbbf24',    // Radiant Solar Gold
    tertiaryColor: '#059669',     // Deep Jade
    coreColor: '#6ee7b7',         // Prismatic Emerald
    emissiveColor: '#10b981',
    emissiveIntensity: 0.55,
    roughness: 0.2,
    metalness: 0.92,
    meridianScale: 1.2,
    equatorScale: 1.28,
    eclipticScale: 1.35,
    colureScale: 1.05,
    coreScale: 0.8,
    wireframeScale: 0.7,
    satelliteScale: 0.9,
    latticeScale: 0.001,
    starPointsScale: 1.4,         // Celestial Constellations
    rotationSpeed: 1.6,
    equatorTilt: Math.PI / 5,
    eclipticTilt: -Math.PI / 5,
  },
  about: {
    primaryColor: '#f59e0b',      // High-Velocity Solar Gold
    secondaryColor: '#38bdf8',    // Telemetric Cyan
    tertiaryColor: '#d97706',
    coreColor: '#ffffff',         // Pure White Core
    emissiveColor: '#f59e0b',
    emissiveIntensity: 0.75,
    roughness: 0.15,
    metalness: 0.95,
    meridianScale: 1.3,
    equatorScale: 1.3,
    eclipticScale: 1.3,
    colureScale: 1.3,
    coreScale: 0.9,
    wireframeScale: 1.1,
    satelliteScale: 1.1,
    latticeScale: 1.1,
    starPointsScale: 1.2,
    rotationSpeed: 2.4,           // Accelerated rotational cadence
    equatorTilt: Math.PI / 4,
    eclipticTilt: -Math.PI / 4,
  },
  tech: {
    primaryColor: '#818cf8',      // Quantum Indigo / Violet
    secondaryColor: '#e2c992',    // Gold Monolith
    tertiaryColor: '#6366f1',     // Deep Electric Iris
    coreColor: '#c084fc',         // Ultraviolet Core
    emissiveColor: '#818cf8',
    emissiveIntensity: 0.65,
    roughness: 0.18,
    metalness: 0.94,
    meridianScale: 1.22,
    equatorScale: 1.4,
    eclipticScale: 1.15,
    colureScale: 1.25,
    coreScale: 0.82,
    wireframeScale: 1.25,
    satelliteScale: 1.0,
    latticeScale: 0.8,
    starPointsScale: 1.5,
    rotationSpeed: 1.8,
    equatorTilt: Math.PI / 3.5,
    eclipticTilt: -Math.PI / 3.5,
  },
  footer: {
    primaryColor: '#c59b56',
    secondaryColor: '#dfb776',
    tertiaryColor: '#8c6b34',
    coreColor: '#dfb776',
    emissiveColor: '#c59b56',
    emissiveIntensity: 0.2,
    roughness: 0.32,
    metalness: 0.88,
    meridianScale: 1.0,
    equatorScale: 1.0,
    eclipticScale: 1.0,
    colureScale: 1.0,
    coreScale: 0.75,
    wireframeScale: 0.001,
    satelliteScale: 0.001,
    latticeScale: 0.001,
    starPointsScale: 0.001,
    rotationSpeed: 0.9,
    equatorTilt: Math.PI / 8,
    eclipticTilt: -Math.PI / 6,
  },
};

export default function ArmillaryAstrolabe({ isLoaded = true, activeSection = 'hero', activeService }) {
  const currentSection = activeService || activeSection || 'hero';

  const groupRef = useRef();
  const outerMeridianRef = useRef();
  const equatorRingRef = useRef();
  const eclipticRingRef = useRef();
  const innerColure1Ref = useRef();
  const innerColure2Ref = useRef();
  const centerSphereRef = useRef();
  const pointerGroupRef = useRef();
  const wireframeShellRef = useRef();
  const satellitesGroupRef = useRef();
  const dataLatticeRef = useRef();
  const starPointsRef = useRef();

  // Dynamic Multi-Channel Materials
  const primaryMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c59b56'),
    roughness: 0.32,
    metalness: 0.88,
    emissive: new THREE.Color('#c59b56'),
    emissiveIntensity: 0.15,
  }), []);

  const secondaryMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dfb776'),
    roughness: 0.18,
    metalness: 0.92,
    emissive: new THREE.Color('#dfb776'),
    emissiveIntensity: 0.2,
  }), []);

  const tertiaryMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8c6b34'),
    roughness: 0.45,
    metalness: 0.80,
  }), []);

  const coreMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dfb776'),
    roughness: 0.15,
    metalness: 0.92,
    emissive: new THREE.Color('#dfb776'),
    emissiveIntensity: 0.25,
  }), []);

  const wireframeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#38bdf8'),
    wireframe: true,
    transparent: true,
    opacity: 0.75,
    emissive: new THREE.Color('#38bdf8'),
    emissiveIntensity: 0.6,
  }), []);

  const crystalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.08,
    metalness: 0.96,
    emissive: new THREE.Color('#38bdf8'),
    emissiveIntensity: 0.5,
  }), []);

  // Temporary color objects to prevent garbage collection in useFrame
  const targetPrimaryCol = useMemo(() => new THREE.Color(), []);
  const targetSecondaryCol = useMemo(() => new THREE.Color(), []);
  const targetTertiaryCol = useMemo(() => new THREE.Color(), []);
  const targetCoreCol = useMemo(() => new THREE.Color(), []);
  const targetEmissiveCol = useMemo(() => new THREE.Color(), []);

  // Internal lerp values for smooth geometric transitions
  const currentSpeed = useRef(1.0);
  const currentEquatorTilt = useRef(Math.PI / 8);
  const currentEclipticTilt = useRef(-Math.PI / 6);
  const scrollOffset = useRef(0);

  const { size } = useThree();

  const responsiveScale = useMemo(() => {
    const w = size.width;
    if (w < 640) return 0.52;
    if (w < 768) return 0.58;
    if (w < 1024) return 0.62;
    if (w < 1440) return 0.68;
    return 0.74;
  }, [size.width]);

  useFrame((state, delta) => {
    const config = SECTION_CONFIGS[currentSection] || SECTION_CONFIGS.hero;
    const scrollState = scrollDirector.getState();

    // 1. Lerp Materials Colors & Physical Properties
    targetPrimaryCol.set(config.primaryColor);
    targetSecondaryCol.set(config.secondaryColor);
    targetTertiaryCol.set(config.tertiaryColor);
    targetCoreCol.set(config.coreColor);
    targetEmissiveCol.set(config.emissiveColor);

    primaryMat.color.lerp(targetPrimaryCol, 0.05);
    primaryMat.emissive.lerp(targetEmissiveCol, 0.05);
    primaryMat.emissiveIntensity = THREE.MathUtils.lerp(primaryMat.emissiveIntensity, config.emissiveIntensity, 0.05);
    primaryMat.roughness = THREE.MathUtils.lerp(primaryMat.roughness, config.roughness, 0.05);
    primaryMat.metalness = THREE.MathUtils.lerp(primaryMat.metalness, config.metalness, 0.05);

    secondaryMat.color.lerp(targetSecondaryCol, 0.05);
    secondaryMat.emissive.lerp(targetSecondaryCol, 0.05);
    secondaryMat.emissiveIntensity = THREE.MathUtils.lerp(secondaryMat.emissiveIntensity, config.emissiveIntensity * 1.2, 0.05);

    tertiaryMat.color.lerp(targetTertiaryCol, 0.05);

    coreMat.color.lerp(targetCoreCol, 0.05);
    coreMat.emissive.lerp(targetCoreCol, 0.05);
    coreMat.emissiveIntensity = THREE.MathUtils.lerp(coreMat.emissiveIntensity, config.emissiveIntensity * 1.5, 0.05);

    wireframeMat.color.lerp(targetSecondaryCol, 0.05);
    wireframeMat.emissive.lerp(targetSecondaryCol, 0.05);

    crystalMat.emissive.lerp(targetSecondaryCol, 0.05);

    // 2. Lerp Speed & Axial Tilts
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, config.rotationSpeed, 0.04);
    currentEquatorTilt.current = THREE.MathUtils.lerp(currentEquatorTilt.current, config.equatorTilt, 0.04);
    currentEclipticTilt.current = THREE.MathUtils.lerp(currentEclipticTilt.current, config.eclipticTilt, 0.04);

    // Scroll-driven mechanical gear rotation offset
    scrollOffset.current = THREE.MathUtils.lerp(scrollOffset.current, scrollState.progress * Math.PI * 4, 0.08);

    const t = state.clock.getElapsedTime() * currentSpeed.current + scrollOffset.current;

    // 3. Morph & Rotate Ring 1: Outer Prime Meridian
    if (outerMeridianRef.current) {
      const s = THREE.MathUtils.lerp(outerMeridianRef.current.scale.x, config.meridianScale, 0.05);
      outerMeridianRef.current.scale.set(s, s, s);
      outerMeridianRef.current.rotation.y = t * 0.08 + scrollOffset.current * 0.4;
      outerMeridianRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }

    // 4. Morph & Rotate Ring 2: Celestial Equator
    if (equatorRingRef.current) {
      const s = THREE.MathUtils.lerp(equatorRingRef.current.scale.x, config.equatorScale, 0.05);
      equatorRingRef.current.scale.set(s, s, s);
      equatorRingRef.current.rotation.z = currentEquatorTilt.current + Math.sin(t * 0.15) * 0.05;
      equatorRingRef.current.rotation.y = -t * 0.14 - scrollOffset.current * 0.5;
    }

    // 5. Morph & Rotate Ring 3: Ecliptic Zodiac Band
    if (eclipticRingRef.current) {
      const s = THREE.MathUtils.lerp(eclipticRingRef.current.scale.x, config.eclipticScale, 0.05);
      eclipticRingRef.current.scale.set(s, s, s);
      eclipticRingRef.current.rotation.x = currentEclipticTilt.current + Math.cos(t * 0.12) * 0.05;
      eclipticRingRef.current.rotation.z = t * 0.12 + scrollOffset.current * 0.3;
    }

    // 6. Morph & Rotate Ring 4 & 5: Inner Solstitial Colures (Dual Counter-Rotating)
    if (innerColure1Ref.current) {
      const s = THREE.MathUtils.lerp(innerColure1Ref.current.scale.x, config.colureScale, 0.05);
      innerColure1Ref.current.scale.set(s, s, s);
      innerColure1Ref.current.rotation.x = t * 0.18 + scrollOffset.current * 0.35;
      innerColure1Ref.current.rotation.y = t * 0.22;
    }
    if (innerColure2Ref.current) {
      const s = THREE.MathUtils.lerp(innerColure2Ref.current.scale.x, config.colureScale * 0.88, 0.05);
      innerColure2Ref.current.scale.set(s, s, s);
      innerColure2Ref.current.rotation.y = -t * 0.25 - scrollOffset.current * 0.45;
      innerColure2Ref.current.rotation.z = -t * 0.16;
    }

    // 7. Morph Central Sphere
    if (centerSphereRef.current) {
      const s = THREE.MathUtils.lerp(centerSphereRef.current.scale.x, config.coreScale, 0.05);
      const pulse = 1 + Math.sin(t * 1.5) * 0.03;
      centerSphereRef.current.scale.set(s * pulse, s * pulse, s * pulse);
      centerSphereRef.current.rotation.y = t * 0.08;
    }

    // 8. Morph Holographic Wireframe Hex Cage (Web / Tech sections)
    if (wireframeShellRef.current) {
      const s = THREE.MathUtils.lerp(wireframeShellRef.current.scale.x, config.wireframeScale, 0.05);
      wireframeShellRef.current.scale.set(s, s, s);
      wireframeShellRef.current.rotation.x = -t * 0.2;
      wireframeShellRef.current.rotation.y = t * 0.3;
      wireframeMat.opacity = Math.min(0.85, s * 0.7);
    }

    // 9. Morph Orbiting Satellite Prisms (Mobile / Work sections)
    if (satellitesGroupRef.current) {
      const s = THREE.MathUtils.lerp(satellitesGroupRef.current.scale.x, config.satelliteScale, 0.05);
      satellitesGroupRef.current.scale.set(s, s, s);
      satellitesGroupRef.current.rotation.y = t * 0.35;
      satellitesGroupRef.current.rotation.z = Math.sin(t * 0.25) * 0.2;
    }

    // 10. Morph Geometric Data Core Lattice (CRM / Metrics sections)
    if (dataLatticeRef.current) {
      const s = THREE.MathUtils.lerp(dataLatticeRef.current.scale.x, config.latticeScale, 0.05);
      dataLatticeRef.current.scale.set(s, s, s);
      dataLatticeRef.current.rotation.y = -t * 0.4;
      dataLatticeRef.current.rotation.x = t * 0.15;
    }

    // 11. Morph Constellation Star Points (Work / Tech sections)
    if (starPointsRef.current) {
      const s = THREE.MathUtils.lerp(starPointsRef.current.scale.x, config.starPointsScale, 0.05);
      starPointsRef.current.scale.set(s, s, s);
      starPointsRef.current.rotation.y = t * 0.1;
      starPointsRef.current.rotation.z = -t * 0.05;
    }

    // 12. Cursor Parallax with Physical Spring Inertia
    if (pointerGroupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 14;
      const targetY = (state.pointer.y * Math.PI) / 18;
      pointerGroupRef.current.rotation.y = THREE.MathUtils.lerp(pointerGroupRef.current.rotation.y, targetX, 0.04);
      pointerGroupRef.current.rotation.x = THREE.MathUtils.lerp(pointerGroupRef.current.rotation.x, -targetY, 0.04);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={pointerGroupRef} position={[0, 0, 0]} scale={[responsiveScale, responsiveScale, responsiveScale]}>

        {/* Ring 1: Outer Prime Meridian */}
        <group ref={outerMeridianRef}>
          <mesh material={primaryMat}>
            <torusGeometry args={[2.5, 0.045, 16, 64]} />
          </mesh>
          {/* North & South Celestial Polar Nodes */}
          <mesh position={[0, 2.5, 0]} material={secondaryMat}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
          <mesh position={[0, -2.5, 0]} material={secondaryMat}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
        </group>

        {/* Ring 2: Celestial Equator Ring */}
        <group ref={equatorRingRef}>
          <mesh material={secondaryMat}>
            <torusGeometry args={[2.25, 0.038, 16, 64]} />
          </mesh>
          {/* Equinoctial Nodes */}
          <mesh position={[2.25, 0, 0]} material={crystalMat}>
            <octahedronGeometry args={[0.065, 0]} />
          </mesh>
          <mesh position={[-2.25, 0, 0]} material={crystalMat}>
            <octahedronGeometry args={[0.065, 0]} />
          </mesh>
        </group>

        {/* Ring 3: Ecliptic Zodiac Band (Heavy brass ring with diamond solstices) */}
        <group ref={eclipticRingRef}>
          <mesh material={tertiaryMat}>
            <torusGeometry args={[2.0, 0.042, 16, 64]} />
          </mesh>
          {/* Solstice Marker Nodes */}
          <mesh position={[2.0, 0, 0]} material={secondaryMat}>
            <octahedronGeometry args={[0.08, 0]} />
          </mesh>
          <mesh position={[-2.0, 0, 0]} material={secondaryMat}>
            <octahedronGeometry args={[0.08, 0]} />
          </mesh>
          <mesh position={[0, 2.0, 0]} material={crystalMat}>
            <octahedronGeometry args={[0.07, 0]} />
          </mesh>
          <mesh position={[0, -2.0, 0]} material={crystalMat}>
            <octahedronGeometry args={[0.07, 0]} />
          </mesh>
        </group>

        {/* Ring 4 & 5: Inner Solstitial Colures (Dual Counter-Rotating Rings) */}
        <group ref={innerColure1Ref}>
          <mesh material={primaryMat}>
            <torusGeometry args={[1.7, 0.028, 16, 48]} />
          </mesh>
        </group>
        <group ref={innerColure2Ref}>
          <mesh material={secondaryMat}>
            <torusGeometry args={[1.5, 0.024, 16, 48]} />
          </mesh>
        </group>

        {/* Dynamic Holographic Cyber Wireframe Shell (Web & Tech sections) */}
        <group ref={wireframeShellRef} scale={[0.001, 0.001, 0.001]}>
          <mesh material={wireframeMat}>
            <icosahedronGeometry args={[1.65, 1]} />
          </mesh>
          <mesh material={wireframeMat}>
            <dodecahedronGeometry args={[1.85, 0]} />
          </mesh>
        </group>

        {/* Dynamic Orbiting Satellite Prisms (Mobile & Work sections) */}
        <group ref={satellitesGroupRef} scale={[0.001, 0.001, 0.001]}>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx / 4) * Math.PI * 2;
            const r = 2.1;
            return (
              <group key={idx} position={[Math.cos(angle) * r, Math.sin(angle) * 0.4, Math.sin(angle) * r]}>
                <mesh material={secondaryMat}>
                  <octahedronGeometry args={[0.12, 0]} />
                </mesh>
                <mesh material={crystalMat}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Dynamic Data Core Lattice Cage (CRM & Metrics sections) */}
        <group ref={dataLatticeRef} scale={[0.001, 0.001, 0.001]}>
          <mesh material={primaryMat}>
            <octahedronGeometry args={[1.2, 0]} />
          </mesh>
          <mesh material={secondaryMat}>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
          </mesh>
        </group>

        {/* Dynamic Constellation Star Nodes Group */}
        <group ref={starPointsRef} scale={[0.001, 0.001, 0.001]}>
          {[...Array(12)].map((_, idx) => {
            const phi = Math.acos(-1 + (2 * idx) / 12);
            const theta = Math.sqrt(12 * Math.PI) * phi;
            const r = 2.4;
            return (
              <mesh
                key={idx}
                position={[
                  r * Math.sin(phi) * Math.cos(theta),
                  r * Math.sin(phi) * Math.sin(theta),
                  r * Math.cos(phi)
                ]}
                material={crystalMat}
              >
                <sphereGeometry args={[0.035, 8, 8]} />
              </mesh>
            );
          })}
        </group>

        {/* Central Polished Celestial Core Sphere */}
        <group ref={centerSphereRef}>
          {/* Solid Core Sphere */}
          <mesh material={coreMat}>
            <sphereGeometry args={[0.75, 32, 32]} />
          </mesh>

          {/* Meridian Wire Engraving on Core */}
          <mesh material={tertiaryMat}>
            <sphereGeometry args={[0.755, 16, 16]} />
          </mesh>
        </group>

        {/* Polar Axis Rod Passing Through Center */}
        <mesh position={[0, 0, 0]} material={primaryMat}>
          <cylinderGeometry args={[0.025, 0.025, 5.4, 16]} />
        </mesh>

      </group>
    </Float>
  );
}

