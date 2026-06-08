"use client";

import dynamic from "next/dynamic";
import { useAssets } from "@/context/AssetsContext";

// react-spline must be client-only — no SSR
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

// Public scene — interactive Nexbot robot, dark background, cursor-tracking spotlight.
// Swap with your own from spline.design (Export → Viewer/Code URL).
const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function SplineHero() {
  const { notifySceneLoaded } = useAssets();

  return (
    <Spline
      scene={SCENE_URL}
      onLoad={() => notifySceneLoaded()}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
