"use client";

import { useEffect, useRef } from "react";

/**
 * Animated film-grain noise rendered on a small offscreen canvas
 * and tiled over the entire viewport via CSS background-size.
 * Low GPU cost — only a 256×256 tile is redrawn every 4 frames.
 */
export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 256;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let animId: number;
    let frame = 0;

    const buf = ctx.createImageData(SIZE, SIZE);
    const data = buf.data;

    function tick() {
      // Redraw every 4 frames — imperceptibly fast but cheap
      if (frame % 4 === 0) {
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        ctx!.putImageData(buf, 0, 0);
      }
      frame++;
      animId = requestAnimationFrame(tick);
    }
    tick();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      style={{
        zIndex: 9999,
        opacity: 0.028,
        mixBlendMode: "overlay",
        // Tile the small canvas across the full viewport
        imageRendering: "auto",
        objectFit: "fill",
      }}
      aria-hidden="true"
    />
  );
}
