import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const REALISTIC_PERSON_MODEL_URL = 'https://threejs.org/examples/models/gltf/Xbot.gltf';
useGLTF.preload(REALISTIC_PERSON_MODEL_URL);

// Realistic 3D Human Person Model loaded via GLTF
function RealisticPersonModel({ opacity = 1.0 }) {
  const { scene } = useGLTF(REALISTIC_PERSON_MODEL_URL);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const normalizeScale = 1.8 / maxDim;
      c.scale.setScalar(normalizeScale);
    }
    c.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = new THREE.MeshStandardMaterial({
          color: child.name.toLowerCase().includes('joint') ? '#c59b56' : '#1e293b',
          roughness: 0.35,
          metalness: 0.6,
          transparent: true,
          opacity: 1.0,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  cloned.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.opacity = opacity;
    }
  });

  return <primitive object={cloned} position={[0, -0.2, 0.4]} rotation={[0, Math.PI, 0]} />;
}

// Fallback 3D man mesh
function FallbackManMesh({ opacity = 1.0 }) {
  return (
    <group position={[0, 0.2, 0.4]}>
      <mesh position={[0, 0.35, 0.4]} castShadow>
        <capsuleGeometry args={[0.32, 0.5, 16, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.92, 0.38]} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Procedural dynamic canvas texture for live scrolling IDE code on dual monitors
function useCodeTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 32, 256);

    const lines = [
      { text: 'import React, { useState } from "react";', color: '#c084fc' },
      { text: 'import { Canvas, useFrame } from "@react-three/fiber";', color: '#38bdf8' },
      { text: 'export function DevcoreCore() {', color: '#fbbf24' },
      { text: '  const [status, setStatus] = useState("building");', color: '#34d399' },
      { text: '  useFrame((state) => {', color: '#c084fc' },
      { text: '    state.camera.position.y = lerp(scroll);', color: '#f472b6' },
      { text: '  });', color: '#c084fc' },
      { text: '  return <Scene3D model="devcore" />;', color: '#fbbf24' },
      { text: '}', color: '#fbbf24' },
    ];

    ctx.font = '13px monospace';
    lines.forEach((line, i) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 44, 28 + i * 24);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

export default function DeveloperDesk3D({ activeService = 'hero', speed = 1.0 }) {
  const deskGroupRef = useRef();
  const manGroupRef = useRef();
  const screenRef1 = useRef();
  const screenRef2 = useRef();

  const codeTexture = useCodeTexture();

  // Lerp targets for DESK ENVIRONMENT (Disappears on scroll)
  const targetDeskOpacity = useRef(1.0);
  const currentDeskOpacity = useRef(1.0);

  // Lerp targets for 3D MAN (Steps out from chair and scrolls down to the end)
  const targetManPos = useRef(new THREE.Vector3(2.4, -0.3, 0.6));
  const targetManRotY = useRef(-0.25);
  const targetManScale = useRef(0.85);
  const targetManOpacity = useRef(1.0);
  const currentManOpacity = useRef(1.0);

  useFrame((state, delta) => {
    const isMobile = window.innerWidth < 768;
    const spd = 2.2 * delta * speed;

    // ── SCROLL BEHAVIOR: DESK DISAPPEARS, MAN STEPS OUT & SCROLLS DOWN TO END ──
    if (activeService === 'hero') {
      // Hero: Desk + Chair + Monitors visible. Man seated in chair at desk.
      targetDeskOpacity.current = 1.0;
      targetManPos.current.set(isMobile ? 0.0 : 2.5, isMobile ? -2.2 : -0.3, isMobile ? -0.5 : 0.6);
      targetManRotY.current = -0.25;
      targetManScale.current = isMobile ? 0.52 : 0.85;
      targetManOpacity.current = 1.0;
    } else if (activeService === 'services' || activeService === 'web') {
      // Scroll Down 1: Desk disappears! Man comes out from chair and scrolls down right side.
      targetDeskOpacity.current = 0.0;
      targetManPos.current.set(isMobile ? 0.0 : 2.6, isMobile ? -2.5 : -1.4, isMobile ? -0.5 : 0.8);
      targetManRotY.current = -0.15;
      targetManScale.current = isMobile ? 0.50 : 0.88;
      targetManOpacity.current = 1.0;
    } else if (activeService === 'app' || activeService === 'crm') {
      // Scroll Down 2: Man continues scrolling down cleanly on right side.
      targetDeskOpacity.current = 0.0;
      targetManPos.current.set(isMobile ? 0.0 : 2.5, isMobile ? -2.6 : -1.8, isMobile ? -0.5 : 0.7);
      targetManRotY.current = 0.20;
      targetManScale.current = isMobile ? 0.48 : 0.84;
      targetManOpacity.current = 1.0;
    } else if (activeService === 'work' || activeService === 'tech') {
      // Scroll Down 3: Man scrolls down towards end section.
      targetDeskOpacity.current = 0.0;
      targetManPos.current.set(isMobile ? 0.0 : 2.5, isMobile ? -2.5 : -2.2, isMobile ? -0.5 : 0.75);
      targetManRotY.current = -0.30;
      targetManScale.current = isMobile ? 0.50 : 0.82;
      targetManOpacity.current = 1.0;
    } else {
      // Footer / End of page: Man diminishes and dissolves completely!
      targetDeskOpacity.current = 0.0;
      targetManPos.current.set(0.0, -4.5, -2.0);
      targetManRotY.current = 0.0;
      targetManScale.current = 0.001;
      targetManOpacity.current = 0.0;
    }

    // Smooth Desk Opacity Fade Out
    currentDeskOpacity.current = THREE.MathUtils.lerp(
      currentDeskOpacity.current,
      targetDeskOpacity.current,
      spd * 2.5
    );

    if (deskGroupRef.current) {
      deskGroupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            m.transparent = true;
            m.opacity = currentDeskOpacity.current;
          });
        }
      });
    }

    // Smooth 3D Man Motion (Position, Scale, Rotation, Opacity)
    const mg = manGroupRef.current;
    if (mg) {
      mg.position.lerp(targetManPos.current, spd);
      mg.scale.setScalar(THREE.MathUtils.lerp(mg.scale.x, targetManScale.current, spd));

      const mouseX = (state.pointer.x * Math.PI) / 14;
      const mouseY = (state.pointer.y * Math.PI) / 18;

      mg.rotation.y = THREE.MathUtils.lerp(mg.rotation.y, targetManRotY.current + mouseX, 0.05);
      mg.rotation.x = THREE.MathUtils.lerp(mg.rotation.x, mouseY * 0.4, 0.05);

      // Subtle breathing float animation
      mg.position.y += Math.sin(state.clock.elapsedTime * 2.0) * 0.003;

      currentManOpacity.current = THREE.MathUtils.lerp(
        currentManOpacity.current,
        targetManOpacity.current,
        spd * 2.5
      );

      mg.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            m.transparent = true;
            m.opacity = currentManOpacity.current;
          });
        }
      });
    }

    // Monitor screen code pulse (while visible)
    if (screenRef1.current && screenRef2.current && currentDeskOpacity.current > 0.05) {
      screenRef1.current.material.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      screenRef2.current.material.emissiveIntensity = 0.7 + Math.cos(state.clock.elapsedTime * 2.5) * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.12}>
      <group>
        {/* ── 1. DESK ENVIRONMENT (VISIBLE ON HERO, FADES AWAY ON SCROLL) ──── */}
        <group ref={deskGroupRef} position={[2.4, -0.3, 0.8]} scale={0.85}>
          {/* Isometric Desk Top */}
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[4.2, 0.15, 2.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Desk Brass Edge */}
          <mesh position={[0, 0, 1.11]}>
            <boxGeometry args={[4.22, 0.17, 0.04]} />
            <meshStandardMaterial color="#c59b56" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Desk Legs */}
          {[
            [-1.9, -0.8, -0.9],
            [1.9, -0.8, -0.9],
            [-1.9, -0.8, 0.9],
            [1.9, -0.8, 0.9],
          ].map((p, i) => (
            <mesh key={i} position={p}>
              <cylinderGeometry args={[0.06, 0.05, 1.5, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.6} />
            </mesh>
          ))}

          {/* Carpet Mat */}
          <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.2, 3.4]} />
            <meshStandardMaterial color="#c59b56" roughness={0.8} opacity={0.35} transparent />
          </mesh>

          {/* Dual Curved Code Monitors */}
          <group position={[-0.8, 0.95, -0.3]} rotation={[0, 0.18, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 1.1, 0.08]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh ref={screenRef1} position={[0, 0, 0.045]}>
              <planeGeometry args={[1.72, 1.02]} />
              <meshStandardMaterial
                map={codeTexture}
                emissive="#38bdf8"
                emissiveIntensity={0.6}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, -0.7, -0.1]}>
              <cylinderGeometry args={[0.04, 0.08, 0.5]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          </group>

          <group position={[0.9, 0.95, -0.3]} rotation={[0, -0.22, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 1.1, 0.08]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh ref={screenRef2} position={[0, 0, 0.045]}>
              <planeGeometry args={[1.72, 1.02]} />
              <meshStandardMaterial
                map={codeTexture}
                emissive="#fbbf24"
                emissiveIntensity={0.65}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, -0.7, -0.1]}>
              <cylinderGeometry args={[0.04, 0.08, 0.5]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          </group>

          {/* Ergonomic Office Chair */}
          <group position={[0, -0.2, 0.9]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.9, 0.12, 0.9]} />
              <meshStandardMaterial color="#0b0e14" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.6, 0.4]} rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[0.85, 1.0, 0.1]} />
              <meshStandardMaterial color="#0b0e14" roughness={0.4} />
            </mesh>
          </group>

          {/* Desk Keyboard & Plant */}
          <mesh position={[0, 0.09, 0.35]} castShadow>
            <boxGeometry args={[0.9, 0.03, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>

          <group position={[1.7, 0.35, 0.4]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.14, 0.35, 16]} />
              <meshStandardMaterial color="#c59b56" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#10b981" roughness={0.4} />
            </mesh>
          </group>

          {/* Pinboard */}
          <group position={[0, 1.8, -0.9]}>
            <mesh>
              <boxGeometry args={[3.2, 1.4, 0.06]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            <mesh>
              <boxGeometry args={[3.3, 1.5, 0.04]} />
              <meshStandardMaterial color="#c59b56" metalness={0.8} />
            </mesh>
            <mesh position={[-0.9, 0.3, 0.04]}>
              <planeGeometry args={[0.4, 0.4]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0.8, -0.2, 0.04]}>
              <planeGeometry args={[0.45, 0.45]} />
              <meshStandardMaterial color="#fbbf24" />
            </mesh>
          </group>

          <pointLight position={[0, 2.0, 0.5]} intensity={3.5} color="#fed7aa" distance={6} />
        </group>

        {/* ── 2. REALISTIC 3D MAN (COMES OUT FROM CHAIR & SCROLLS DOWN TO END) ── */}
        <group ref={manGroupRef} position={[2.4, -0.3, 0.6]} scale={0.85}>
          <React.Suspense fallback={<FallbackManMesh opacity={currentManOpacity.current} />}>
            <RealisticPersonModel opacity={currentManOpacity.current} />
          </React.Suspense>
        </group>
      </group>
    </Float>
  );
}
