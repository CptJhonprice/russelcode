"use client";

import { useRef, useState } from "react";
import AnimatedGrid from "./AnimatedGrid";

interface VideoSceneProps {
  src?: string;
  overlayOpacity?: number;
  accentBloom?: boolean;
  className?: string;
}

/**
 * Full-bleed cinematic background layer.
 * Falls back to animated grid + atmospheric bloom when video is absent or fails.
 */
export default function VideoScene({
  src,
  overlayOpacity = 0.72,
  accentBloom    = true,
  className      = "",
}: VideoSceneProps) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || hasError;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>

      {/* ── Fallback: atmospheric dark canvas ───────────────────── */}
      {showFallback && (
        <div className="absolute inset-0" style={{ background: "#07070a" }}>
          {/* Grid */}
          <AnimatedGrid opacity={0.065} color="#3d6b8c" cellSize={72} drift />

          {/* Deep radial bloom — lower-center anchor */}
          {accentBloom && (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 55% at 50% 75%, rgba(20,38,58,0.55) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 40% 30% at 50% 100%, rgba(61,107,140,0.12) 0%, transparent 60%)",
                }}
              />
            </>
          )}

          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </div>
      )}

      {/* ── Video ───────────────────────────────────────────────── */}
      {src && !hasError && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline preload="metadata"
          onError={() => setHasError(true)}
        >
          <source src={src} type="video/webm" />
        </video>
      )}

      {/* ── Dark overlay for text contrast ──────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: `rgba(7,7,10,${overlayOpacity})` }}
      />
    </div>
  );
}
