import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CyberWireframeGrid({ themeColor = '#e2c992', buildProgress = 1.0 }) {
  const linesRef = useRef();
  const pointsRef = useRef();

  // Generate architectural triangulation grid geometry
  const { linePositions, pointPositions } = useMemo(() => {
    const size = 30;
    const divisions = 18;
    const step = size / divisions;
    const half = size / 2;

    const lineCoords = [];
    const pointCoords = [];

    const grid = [];
    for (let i = 0; i <= divisions; i++) {
      grid[i] = [];
      for (let j = 0; j <= divisions; j++) {
        const x = -half + i * step;
        const z = -half + j * step;
        const distFromCenter = Math.sqrt(x * x + z * z);
        const y = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.25 - 0.2;
        grid[i][j] = { x, y, z, distFromCenter };
        pointCoords.push(x, y, z);
      }
    }

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const p1 = grid[i][j];
        const p2 = grid[i + 1][j];
        const p3 = grid[i][j + 1];
        const p4 = grid[i + 1][j + 1];

        lineCoords.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        lineCoords.push(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z);
        if ((i + j) % 2 === 0) {
          lineCoords.push(p1.x, p1.y, p1.z, p4.x, p4.y, p4.z);
        } else {
          lineCoords.push(p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
        }
      }
    }

    return {
      linePositions: new Float32Array(lineCoords),
      pointPositions: new Float32Array(pointCoords),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const currentScale = Math.min(1.0, Math.max(0.01, buildProgress * 1.05));
    const targetOpacity = Math.min(0.25, buildProgress * 0.3);

    if (linesRef.current) {
      linesRef.current.scale.set(currentScale, 1, currentScale);
      linesRef.current.position.y = -2.6 + Math.sin(t * 0.6) * 0.03;
      linesRef.current.material.opacity = targetOpacity;
    }

    if (pointsRef.current) {
      pointsRef.current.scale.set(currentScale, 1, currentScale);
      pointsRef.current.position.y = -2.6 + Math.sin(t * 0.6) * 0.03;
      pointsRef.current.material.opacity = targetOpacity * 1.6;
    }
  });

  return (
    <group position={[0, -2.6, 0]}>
      {/* 1. Architectural Blueprint Grid Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={themeColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 2. Vertex Node Dots */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointPositions.length / 3}
            array={pointPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. Subtle Warm Studio Floor Reflection Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.2, 5.0 * Math.min(1.0, buildProgress), 48]} />
        <meshBasicMaterial
          color={themeColor}
          transparent
          opacity={0.08 * buildProgress}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
