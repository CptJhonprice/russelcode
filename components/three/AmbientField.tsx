"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Field({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3d6b8c" size={0.016} sizeAttenuation transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}

export default function AmbientField({ count = 800 }: { count?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 65 }}
      dpr={[1, 1]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0, background: "transparent", pointerEvents: "none" }}
    >
      <Field count={count} />
    </Canvas>
  );
}
