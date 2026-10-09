import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function VolumetricGodRays({ color = '#00f0ff', count = 5 }) {
  const raysGroupRef = useRef();

  useFrame((state, delta) => {
    if (!raysGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    raysGroupRef.current.rotation.z = t * 0.15;
    raysGroupRef.current.rotation.y = Math.sin(t * 0.1) * 0.2;
  });

  const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

  return (
    <group ref={raysGroupRef} position={[0, 0, 0]}>
      {angles.slice(0, count).map((angle, idx) => (
        <group key={idx} rotation={[0, 0, angle]}>
          <mesh position={[0, 3.2, 0]}>
            <cylinderGeometry args={[0.08, 0.8, 6.5, 16, 1, true]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
