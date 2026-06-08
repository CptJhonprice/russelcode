"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Subtle deep-field constellation — lines + small nodes, no big bubbles
function Field() {
  const groupRef = useRef<THREE.Group>(null);

  const { positions, linePositions } = useMemo(() => {
    const count = 180;
    const pts: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      pts.push([
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6 - 2,
      ]);
    }

    const pos = new Float32Array(count * 3);
    pts.forEach(([x, y, z], i) => {
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    });

    const lineVerts: number[] = [];
    const MAX = 3.2;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        if (dx * dx + dy * dy + dz * dz < MAX * MAX) {
          lineVerts.push(...pts[i], ...pts[j]);
        }
      }
    }

    return { positions: pos, linePositions: new Float32Array(lineVerts) };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.03) * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.025) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#3d6b8c" size={0.022} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1a2e3e" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function ProcessGL({ activeStep }: { activeStep: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 58 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
    >
      <Field />
    </Canvas>
  );
}
