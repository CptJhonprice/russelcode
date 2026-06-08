"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 22;

function buildGraph() {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4 - 1
      )
    );
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 3.2) edges.push([i, j]);
    }
  }
  return { nodes, edges };
}

/* ── Network rendered as a single LineSegments draw call ─────────── */
function Network({ activeStep }: { activeStep: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, edges } = useMemo(buildGraph, []);

  // Build one LineSegments geometry for all edges
  const lineObj = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    edges.forEach(([a, b]) => { pts.push(nodes[a], nodes[b]); });
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: "#1a2a36", opacity: 0.35, transparent: true });
    return new THREE.LineSegments(geo, mat);
  }, [nodes, edges]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.04) * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.06;
  });

  return (
    <group ref={groupRef}>
      {/* All edges — single draw call */}
      <primitive object={lineObj} />

      {/* Node spheres */}
      {nodes.map((pos, i) => {
        const isStep = i < 5;
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[isStep ? 0.12 : 0.045, 8, 8]} />
            <meshBasicMaterial
              color={isStep ? "#3d6b8c" : "#1a2a36"}
              opacity={isStep ? 0.9 : 0.5}
              transparent
            />
          </mesh>
        );
      })}

      {/* Pulse rings on the 5 process-step nodes */}
      {nodes.slice(0, 5).map((pos, i) => (
        <PulseRing key={i} position={pos} delay={i * 0.65} />
      ))}
    </group>
  );
}

function PulseRing({ position, delay }: { position: THREE.Vector3; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() + delay) % 3;
    ref.current.scale.setScalar(1 + t * 0.85);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.38 - t * 0.13);
  });
  return (
    <mesh ref={ref} position={position}>
      <ringGeometry args={[0.12, 0.17, 32]} />
      <meshBasicMaterial color="#3d6b8c" transparent opacity={0.38} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/* ── Floating data bars ─────────────────────────────────────────── */
function DataFloat() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.22) * 0.28;
  });
  return (
    <group ref={ref} position={[4, 1.5, -2]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * -0.4, 0]}>
          <boxGeometry args={[0.55 - i * 0.12, 0.035, 0.035]} />
          <meshBasicMaterial color="#1e3040" opacity={0.55} transparent />
        </mesh>
      ))}
    </group>
  );
}

export default function ProcessGL({ activeStep }: { activeStep: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 58 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
    >
      <ambientLight intensity={0.05} />
      <Network activeStep={activeStep} />
      <DataFloat />
    </Canvas>
  );
}
