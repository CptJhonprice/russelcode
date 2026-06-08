"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Noise-displaced sphere ─────────────────────────────────────── */
function MorphSphere({ progress }: { progress: React.MutableRefObject<number> }) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const geomRef  = useRef<THREE.SphereGeometry | null>(null);
  const origPos  = useRef<Float32Array | null>(null);

  // Build a smooth sphere with enough vertices to morph nicely
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(2, 64, 64);
    geomRef.current = g;
    origPos.current = new Float32Array(g.attributes.position.array);
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !origPos.current) return;
    const t   = clock.getElapsedTime();
    const pos = geomRef.current!.attributes.position as THREE.BufferAttribute;
    const orig = origPos.current;
    const p   = progress.current; // 0 → 1 from scroll

    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3];
      const oy = orig[i * 3 + 1];
      const oz = orig[i * 3 + 2];

      // Simple sine-based displacement
      const freq = 1.4 + p * 0.8;
      const amp  = 0.18 + p * 0.12;
      const disp = Math.sin(ox * freq + t * 0.5) *
                   Math.cos(oy * freq + t * 0.4) *
                   Math.sin(oz * freq * 0.7 + t * 0.3) * amp;

      pos.setXYZ(i, ox + ox * disp, oy + oy * disp, oz + oz * disp);
    }
    pos.needsUpdate = true;
    geomRef.current!.computeVertexNormals();

    meshRef.current.rotation.y = t * 0.06;
    meshRef.current.rotation.x = Math.sin(t * 0.04) * 0.15;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[1.5, 0, -1]}>
      <meshBasicMaterial color="#1a3348" wireframe opacity={0.22} transparent />
    </mesh>
  );
}

/* ── Orbiting ring ──────────────────────────────────────────────── */
function Ring() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.07;
    ref.current.rotation.z = t * 0.04;
  });
  return (
    <mesh ref={ref} position={[1.5, 0, -1]}>
      <torusGeometry args={[2.8, 0.005, 2, 180]} />
      <meshBasicMaterial color="#3d6b8c" opacity={0.15} transparent />
    </mesh>
  );
}

/* ── Particle halo ──────────────────────────────────────────────── */
function Halo({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 3.2 + (Math.random() - 0.5) * 0.8;
      arr[i * 3]     = Math.cos(angle) * r + 1.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 2] = Math.sin(angle) * r - 1;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3d6b8c" size={0.018} sizeAttenuation transparent opacity={0.4} depthWrite={false} />
    </points>
  );
}

export default function PhilosophyGL({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
    >
      <ambientLight intensity={0.05} />
      <MorphSphere progress={progress} />
      <Ring />
      <Halo count={600} />
    </Canvas>
  );
}
