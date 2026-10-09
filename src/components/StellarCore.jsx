import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { LiquidCrystalShader } from '../shaders/liquidCrystalShader';
import VolumetricGodRays from './VolumetricGodRays';

export default function StellarCore({ 
  themeColor = '#e2c992', 
  secondaryColor = '#94a3b8', 
  wireframe = false,
  speed = 1.0,
  activeService = 'hero',
  buildProgress = 1.0
}) {
  const outerMeshRef = useRef();
  const wireframeAssembleRef = useRef();
  const innerCoreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const satellitesGroupRef = useRef();
  const morphGroupRef = useRef();
  const shaderRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScrollSpeed: { value: 0 },
    uColor1: { value: new THREE.Color(themeColor) },
    uColor2: { value: new THREE.Color(secondaryColor) },
    uDistortIntensity: { value: 0.14 },
    uFresnelPower: { value: 2.8 },
    uFresnelIntensity: { value: 1.8 },
    uRoughness: { value: 0.08 },
  }), [themeColor, secondaryColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    const progress = Math.min(1.0, Math.max(0.001, buildProgress));

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = t;
      shaderRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
      shaderRef.current.uniforms.uColor1.value.set(themeColor);
      shaderRef.current.uniforms.uColor2.value.set(secondaryColor);
    }

    const baseScale = Math.min(1.0, progress * 1.04);

    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.x = t * 0.18;
      outerMeshRef.current.rotation.y = t * 0.25;
      const pulseFactor = 1 + Math.sin(t * 1.2) * 0.03;
      const finalScale = baseScale * pulseFactor;
      outerMeshRef.current.scale.set(finalScale, finalScale, finalScale);
    }

    if (wireframeAssembleRef.current) {
      wireframeAssembleRef.current.rotation.x = -t * 0.22;
      wireframeAssembleRef.current.rotation.y = t * 0.35;
      const wireScale = (0.2 + progress * 0.85) * (1 + Math.sin(t * 1.5) * 0.02);
      wireframeAssembleRef.current.scale.set(wireScale, wireScale, wireScale);
      
      if (wireframeAssembleRef.current.material) {
        wireframeAssembleRef.current.material.opacity = progress < 0.95 ? 0.65 : 0.15;
      }
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.4;
      const innerPulse = (0.85 + Math.sin(t * 2.0) * 0.05) * baseScale;
      innerCoreRef.current.scale.set(innerPulse, innerPulse, innerPulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.1;
      ring1Ref.current.rotation.y = t * (0.25 + (1 - progress) * 1.5);
      ring1Ref.current.rotation.z = t * 0.15;
      const ring1Scale = Math.max(0.001, (progress - 0.2) / 0.8);
      ring1Ref.current.scale.set(ring1Scale, ring1Scale, ring1Scale);
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 4 - Math.sin(t * 0.5) * 0.1;
      ring2Ref.current.rotation.y = -t * (0.2 + (1 - progress) * 1.5);
      ring2Ref.current.rotation.z = -t * 0.18;
      const ring2Scale = Math.max(0.001, (progress - 0.4) / 0.6);
      ring2Ref.current.scale.set(ring2Scale, ring2Scale, ring2Scale);
    }

    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y = t * 0.3;
      satellitesGroupRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
      const satScale = Math.max(0.001, (progress - 0.5) / 0.5);
      satellitesGroupRef.current.scale.set(satScale, satScale, satScale);
    }

    if (morphGroupRef.current && progress >= 0.95) {
      const targetScaleWeb = activeService === 'web' ? 1.15 : 0.001;
      const targetScaleApp = activeService === 'app' ? 1.15 : 0.001;
      const targetScaleCrm = activeService === 'crm' ? 1.15 : 0.001;
      const targetScaleHero = activeService === 'hero' ? 1.0 : 0.001;

      morphGroupRef.current.children.forEach((child) => {
        if (child.name === 'geo-hero') {
          child.scale.lerp(new THREE.Vector3(targetScaleHero, targetScaleHero, targetScaleHero), 0.08);
        } else if (child.name === 'geo-web') {
          child.scale.lerp(new THREE.Vector3(targetScaleWeb, targetScaleWeb, targetScaleWeb), 0.08);
        } else if (child.name === 'geo-app') {
          child.scale.lerp(new THREE.Vector3(targetScaleApp, targetScaleApp, targetScaleApp), 0.08);
        } else if (child.name === 'geo-crm') {
          child.scale.lerp(new THREE.Vector3(targetScaleCrm, targetScaleCrm, targetScaleCrm), 0.08);
        }
      });
    }
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.4} floatIntensity={0.5}>
      <group position={[0, 0, 0]}>
        
        {/* Subtle Warm Studio God Rays */}
        <VolumetricGodRays color={themeColor} count={Math.round(4 * buildProgress)} />

        {/* Blueprint Wireframe Cage */}
        <mesh ref={wireframeAssembleRef}>
          <icosahedronGeometry args={[1.8, 2]} />
          <meshStandardMaterial
            color={themeColor}
            emissive={themeColor}
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Multi-Geometry Studio Core */}
        <group ref={morphGroupRef}>
          {/* 1. Hero: Kinetic Icosahedron with Liquid Platinum & Champagne Shader */}
          <mesh ref={outerMeshRef} name="geo-hero">
            <icosahedronGeometry args={[1.6, 3]} />
            <shaderMaterial
              ref={shaderRef}
              vertexShader={LiquidCrystalShader.vertexShader}
              fragmentShader={LiquidCrystalShader.fragmentShader}
              uniforms={uniforms}
              transparent
              wireframe={wireframe}
            />
          </mesh>

          {/* 2. Web: Brushed Titanium Geodesic Sphere */}
          <mesh name="geo-web" scale={[0.001, 0.001, 0.001]}>
            <sphereGeometry args={[1.65, 24, 24]} />
            <meshPhysicalMaterial
              color="#e2c992"
              emissive="#e2c992"
              emissiveIntensity={0.25}
              wireframe
              roughness={0.15}
              metalness={0.85}
            />
          </mesh>

          {/* 3. App: Frosted Crystal Monolith Prism */}
          <mesh name="geo-app" scale={[0.001, 0.001, 0.001]}>
            <octahedronGeometry args={[1.7, 1]} />
            <meshPhysicalMaterial
              color="#f8fafc"
              emissive="#cbd5e1"
              emissiveIntensity={0.2}
              roughness={0.08}
              transmission={0.92}
              thickness={1.8}
              ior={1.52}
            />
          </mesh>

          {/* 4. Enterprise: Brushed Titanium Data Matrix */}
          <mesh name="geo-crm" scale={[0.001, 0.001, 0.001]}>
            <boxGeometry args={[1.9, 1.9, 1.9]} />
            <meshPhysicalMaterial
              color="#d4a373"
              emissive="#d4a373"
              emissiveIntensity={0.2}
              wireframe={wireframe}
              roughness={0.25}
              metalness={0.7}
              transmission={0.6}
            />
          </mesh>
        </group>

        {/* Outer Halo Lattice */}
        <mesh>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshBasicMaterial
            color={themeColor}
            wireframe
            transparent
            opacity={0.2 * buildProgress}
          />
        </mesh>

        {/* Inner Pulsating Amber Crystal */}
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.85, 2]} />
          <MeshDistortMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.6}
            speed={2}
            distort={0.3}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>

        {/* Concentric Gimbal Ring 1 (Champagne Gold) */}
        <group ref={ring1Ref}>
          <mesh>
            <torusGeometry args={[2.4, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#e2c992"
              emissive="#e2c992"
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[2.4, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Concentric Gimbal Ring 2 (Liquid Platinum) */}
        <group ref={ring2Ref}>
          <mesh>
            <torusGeometry args={[2.8, 0.015, 16, 64]} />
            <meshStandardMaterial
              color="#cbd5e1"
              emissive="#cbd5e1"
              emissiveIntensity={0.5}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-2.8, 0, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#e2c992" />
          </mesh>
        </group>

        {/* Sculptural Orbiting Nodes */}
        <group ref={satellitesGroupRef}>
          <mesh position={[2.1, 1.1, 0]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color="#e2c992" emissive="#e2c992" emissiveIntensity={0.6} metalness={0.9} />
          </mesh>
          <mesh position={[-2.1, -0.9, 1.1]}>
            <dodecahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color="#cbd5e1" emissive="#cbd5e1" emissiveIntensity={0.6} metalness={0.9} />
          </mesh>
          <mesh position={[0, -2.2, -0.9]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#d4a373" emissive="#d4a373" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
        </group>

      </group>
    </Float>
  );
}
