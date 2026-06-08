"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Constellation: nodes + connecting lines, mouse-reactive
function Constellation({ count = 260 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef  = useRef<THREE.LineSegments>(null);
  const mouse  = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const { positions, linePositions } = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      pts.push([
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 1,
      ]);
    }

    const pos = new Float32Array(count * 3);
    pts.forEach(([x, y, z], i) => {
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    });

    const lineVerts: number[] = [];
    const MAX_DIST = 2.6;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        if (dx * dx + dy * dy + dz * dz < MAX_DIST * MAX_DIST) {
          lineVerts.push(...pts[i], ...pts[j]);
        }
      }
    }

    return { positions: pos, linePositions: new Float32Array(lineVerts) };
  }, [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    target.current.x += (mouse.current.x - target.current.x) * 0.035;
    target.current.y += (mouse.current.y - target.current.y) * 0.035;

    const t = clock.getElapsedTime();
    const rx = target.current.y * 0.18 + Math.sin(t * 0.09) * 0.05;
    const ry = t * 0.018 + target.current.x * 0.28;

    if (pointsRef.current) {
      pointsRef.current.rotation.x = rx;
      pointsRef.current.rotation.y = ry;
    }
    if (linesRef.current) {
      linesRef.current.rotation.x = rx;
      linesRef.current.rotation.y = ry;
    }
  });

  return (
    <>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#7ab4d8"
          size={0.038}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#2a5a7c" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
    </>
  );
}

// Dim far-background star field
function Stars({ count = 1800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 28;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(Math.random() * 2 - 1);
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#b0c8d8" size={0.014} sizeAttenuation transparent opacity={0.38} depthWrite={false} />
    </points>
  );
}

export default function EnterGL() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 68 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, background: "transparent", pointerEvents: "none" }}
    >
      <Stars />
      <Constellation />
    </Canvas>
  );
}
