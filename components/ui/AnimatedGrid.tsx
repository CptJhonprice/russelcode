"use client";

import { useEffect, useRef } from "react";

interface AnimatedGridProps {
  opacity?: number;
  color?: string;
  cellSize?: number;
  drift?: boolean;
}

/**
 * Thin technical grid rendered on canvas.
 * Supports slow horizontal drift for a sense of depth.
 * Cheap: no per-pixel ops, just line draw calls.
 */
export default function AnimatedGrid({
  opacity  = 0.055,
  color    = "#3d6b8c",
  cellSize = 64,
  drift    = true,
}: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let offsetX = 0;

    function resize() {
      canvas!.width  = canvas!.offsetWidth  * window.devicePixelRatio;
      canvas!.height = canvas!.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);
      ctx!.strokeStyle = color;
      ctx!.lineWidth   = 0.4;
      ctx!.globalAlpha = opacity;

      const ox = drift ? offsetX % cellSize : 0;

      // Vertical lines
      for (let x = ox - cellSize; x < w + cellSize; x += cellSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }

      // Horizontal lines — static, no drift
      for (let y = 0; y < h + cellSize; y += cellSize) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }

      // Intersection dots — tiny pixel accent
      ctx!.globalAlpha = opacity * 1.6;
      ctx!.fillStyle   = color;
      for (let x = ox - cellSize; x < w + cellSize; x += cellSize) {
        for (let y = 0; y < h + cellSize; y += cellSize) {
          ctx!.beginPath();
          ctx!.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      if (drift) offsetX += 0.06;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [opacity, color, cellSize, drift]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
