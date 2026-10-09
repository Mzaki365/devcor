import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GalaxyParticles({ count = 2800, color = '#e2c992', activeService = 'hero' }) {
  const pointsRef = useRef();
  const shockwaveRef = useRef(0);

  const [positions, originalPositions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const baseColor1 = new THREE.Color(color);
    const baseColor2 = new THREE.Color('#cbd5e1'); // Platinum
    const baseColor3 = new THREE.Color('#d4a373'); // Warm Bronze
    const baseColor4 = new THREE.Color('#ffffff'); // Starlight

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 14.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      const mixedColor = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.4) mixedColor.copy(baseColor1);
      else if (rand < 0.7) mixedColor.copy(baseColor2);
      else if (rand < 0.85) mixedColor.copy(baseColor3);
      else mixedColor.copy(baseColor4);

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return [pos, orig, col];
  }, [count, color]);

  useEffect(() => {
    shockwaveRef.current = 0.8;
  }, [activeService]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array;

    if (shockwaveRef.current > 0.01) {
      shockwaveRef.current = THREE.MathUtils.lerp(shockwaveRef.current, 0, 0.04);
    }

    const mouseX = state.pointer.x * 5;
    const mouseY = state.pointer.y * 5;

    for (let i = 0; i < count; i += 4) {
      const idx = i * 3;
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];
      const oz = originalPositions[idx + 2];

      const dx = ox - mouseX;
      const dy = oy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let repelX = 0;
      let repelY = 0;
      if (dist < 3.2 && dist > 0.01) {
        const force = (3.2 - dist) * 0.35;
        repelX = (dx / dist) * force;
        repelY = (dy / dist) * force;
      }

      const shockFactor = shockwaveRef.current * Math.sin(time * 6 + i * 0.1) * 0.25;

      array[idx] = ox + repelX + shockFactor;
      array[idx + 1] = oy + repelY + shockFactor;
      array[idx + 2] = oz + shockFactor;
    }

    posAttr.needsUpdate = true;

    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.015) * 0.03;

    const targetX = (state.pointer.x * Math.PI) / 16;
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, targetX, 0.04);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
