"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Particle cloud ─────────────────────────────────────────────── */
function ParticleCloud({ count = 3500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere, denser toward center
      const r = Math.pow(Math.random(), 0.5) * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2; // shift slightly back
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Slow drift rotation
    ref.current.rotation.y = t * 0.018;
    ref.current.rotation.x = Math.sin(t * 0.009) * 0.12;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4a7fa5"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

/* ── Wireframe icosahedron ──────────────────────────────────────── */
function WireIco() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.08;
    meshRef.current.rotation.y = t * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[2.5, 0, -1]}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial color="#3d6b8c" wireframe opacity={0.18} transparent />
    </mesh>
  );
}

/* ── Secondary smaller sphere ───────────────────────────────────── */
function SmallOrb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = Math.sin(t * 0.22) * 3.5;
    ref.current.position.y = Math.cos(t * 0.15) * 1.8;
    ref.current.rotation.z = t * 0.25;
  });

  return (
    <mesh ref={ref} position={[-3, 1, -3]}>
      <octahedronGeometry args={[0.55, 0]} />
      <meshBasicMaterial color="#2a4a60" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

/* ── Camera scroll response ─────────────────────────────────────── */
function CameraRig({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    // Gently pull camera back as user scrolls
    const target = scrollY.current * 0.003;
    camera.position.z += (5 + target - camera.position.z) * 0.04;
    camera.position.y += (-scrollY.current * 0.0005 - camera.position.y) * 0.04;
  });

  return null;
}

/* ── Main exported component ────────────────────────────────────── */
export default function HeroGL({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
    >
      {/* Very faint ambient so wireframes are just barely lit */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 4, 6]} intensity={0.4} color="#3d6b8c" />

      <CameraRig scrollY={scrollY} />
      <ParticleCloud count={3000} />
      <WireIco />
      <SmallOrb />
    </Canvas>
  );
}
