import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function QuantumReactor({ progress, isExiting }) {
  const crystalRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const pointsRef = useRef();

  // Generate 600 stardust particles with radial distances for explosive warp on exit
  const [particles, originalPositions] = useMemo(() => {
    const pos = new Float32Array(600 * 3);
    const orig = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const radius = 1.8 + Math.random() * 2.8;
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
    }
    return [pos, orig];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = 1.0 + (progress / 100) * 2.5;

    // Crystal rotation & scale pulse
    if (crystalRef.current) {
      crystalRef.current.rotation.x = t * 0.5 * speed;
      crystalRef.current.rotation.y = t * 0.7 * speed;
      
      const pulse = 1 + Math.sin(t * 4) * 0.08 + (progress / 100) * 0.2;
      if (isExiting) {
        crystalRef.current.scale.lerp(new THREE.Vector3(4.5, 4.5, 4.5), 0.12);
      } else {
        crystalRef.current.scale.set(pulse, pulse, pulse);
      }
    }

    // Triple Gyroscope Gimbal Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 4 + t * 0.6 * speed;
      ring1Ref.current.rotation.y = t * 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3 - t * 0.5 * speed;
      ring2Ref.current.rotation.z = t * 0.6;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.8 * speed;
      ring3Ref.current.rotation.z = Math.PI / 6 + t * 0.3;
    }

    // Particle Cloud Explosion / Warp on Exit
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const array = posAttr.array;

      if (isExiting) {
        for (let i = 0; i < 600; i++) {
          const idx = i * 3;
          array[idx] *= 1.06;
          array[idx + 1] *= 1.06;
          array[idx + 2] *= 1.06;
        }
        posAttr.needsUpdate = true;
      }

      pointsRef.current.rotation.y = t * 0.15;
      const mouseX = (state.pointer.x * Math.PI) / 8;
      const mouseY = (state.pointer.y * Math.PI) / 8;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, mouseY, 0.05);
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, mouseX, 0.05);
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
      <group position={[0, 0, 0]}>
        {/* Central Faceted Quantum Core */}
        <mesh ref={crystalRef}>
          <icosahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
            wireframe={progress < 30}
          />
        </mesh>

        {/* Outer Halo Wireframe */}
        <mesh>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.35} />
        </mesh>

        {/* Gyroscope Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.55, 0.02, 16, 48]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
        </mesh>

        {/* Gyroscope Ring 2 */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.85, 0.015, 16, 48]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
        </mesh>

        {/* Gyroscope Ring 3 */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[2.15, 0.012, 16, 48]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>

        {/* Outer Particle Dust */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            color="#00f0ff"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Dynamic Inner Lights */}
        <ambientLight intensity={0.5} />
        <pointLight color="#00f0ff" intensity={4} distance={6} />
        <pointLight color="#a855f7" intensity={3} distance={7} position={[0, 2, 2]} />
      </group>
    </Float>
  );
}

export default function LoadingScene3D({ progress, isExiting }) {
  return (
    <div className="w-56 h-56 sm:w-72 sm:h-72 relative mb-2 select-none pointer-events-auto">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5.2], fov: 45 }}
      >
        <QuantumReactor progress={progress} isExiting={isExiting} />
      </Canvas>
    </div>
  );
}
