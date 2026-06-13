"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/ThemeContext";

// --- Default card images (swap via the `cardImages` prop) ---
const defaultCardImages = [
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
];

type ScannerCardStreamProps = {
  initialSpeed?: number;
  direction?: -1 | 1;
  cardImages?: string[];
  repeat?: number;
  cardGap?: number;
  friction?: number;
};

export function ScannerCardStream({
  initialSpeed = 150,
  direction = -1,
  cardImages = defaultCardImages,
  repeat = 6,
  cardGap = 40,
  friction = 0.95,
}: ScannerCardStreamProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isScanning, setIsScanning] = useState(false);

  const cards = useMemo(() => {
    const total = cardImages.length * repeat;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      image: cardImages[i % cardImages.length],
    }));
  }, [cardImages, repeat]);

  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

  const state = useRef({
    position: 0,
    velocity: initialSpeed,
    direction,
    isDragging: false,
    lastX: 0,
    lastTime: performance.now(),
    cardLineWidth: 0,
    minVelocity: 30,
  });

  useEffect(() => {
    const cardLine = cardLineRef.current;
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;
    if (!cardLine || !particleCanvas || !scannerCanvas) return;

    const s = state.current;
    s.direction = direction;
    s.velocity = initialSpeed;
    s.cardLineWidth = cardLine.scrollWidth;
    s.position = cardLine.parentElement?.offsetWidth ?? window.innerWidth;
    s.lastTime = performance.now();

    let rafId = 0;
    const FIELD_H = 250;

    // ── Three.js floating particles ────────────────────────────────
    const scene = new THREE.Scene();
    let viewW = window.innerWidth;
    const camera = new THREE.OrthographicCamera(-viewW / 2, viewW / 2, FIELD_H / 2, -FIELD_H / 2, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(viewW, FIELD_H);
    renderer.setClearColor(0x000000, 0);

    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount);

    const texCanvas = document.createElement("canvas");
    texCanvas.width = 100;
    texCanvas.height = 100;
    const texCtx = texCanvas.getContext("2d")!;
    const half = 50;
    const grad = texCtx.createRadialGradient(half, half, 0, half, half, half);
    if (isLight) {
      grad.addColorStop(0.025, "#2f6c93");
      grad.addColorStop(0.1, "rgba(47,108,147,0.7)");
      grad.addColorStop(0.25, "rgba(47,108,147,0.25)");
      grad.addColorStop(1, "transparent");
    } else {
      grad.addColorStop(0.025, "#fff");
      grad.addColorStop(0.1, "hsl(207, 50%, 45%)");
      grad.addColorStop(0.25, "hsl(207, 60%, 12%)");
      grad.addColorStop(1, "transparent");
    }
    texCtx.fillStyle = grad;
    texCtx.beginPath();
    texCtx.arc(half, half, half, 0, Math.PI * 2);
    texCtx.fill();
    const texture = new THREE.CanvasTexture(texCanvas);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewW * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_H;
      positions[i * 3 + 2] = 0;
      velocities[i] = Math.random() * 60 + 30;
      alphas[i] = (Math.random() * 8 + 2) / 10;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: texture } },
      vertexShader:
        "attribute float alpha; varying float vAlpha; void main(){ vAlpha=alpha; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=14.0; gl_Position=projectionMatrix*mv; }",
      fragmentShader:
        "uniform sampler2D pointTexture; varying float vAlpha; void main(){ gl_FragColor=vec4(1.0,1.0,1.0,vAlpha)*texture2D(pointTexture, gl_PointCoord); }",
      transparent: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── 2D scanner spray ───────────────────────────────────────────
    const ctx = scannerCanvas.getContext("2d")!;
    const SCAN_H = 300;
    scannerCanvas.width = viewW;
    scannerCanvas.height = SCAN_H;
    const baseMax = 600;
    const scanMax = 2200;
    let currentMax = baseMax;
    type SP = { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; life: number; decay: number };
    const makeSP = (): SP => ({
      x: viewW / 2 + (Math.random() - 0.5) * 3,
      y: Math.random() * SCAN_H,
      vx: Math.random() * 0.8 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4,
      alpha: Math.random() * 0.4 + 0.6,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.005,
    });
    let spray: SP[] = Array.from({ length: baseMax }, makeSP);
    let scanningNow = false;

    // Detect whether a card is currently crossing the centre scanner line
    const detectScan = () => {
      const scannerX = window.innerWidth / 2;
      const w = 8;
      const left = scannerX - w / 2;
      const right = scannerX + w / 2;
      let any = false;
      cardLine.querySelectorAll<HTMLElement>(".card-wrapper").forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        if (rect.left < right && rect.right > left) any = true;
      });
      scanningNow = any;
      setIsScanning(any);
    };

    // ── Pointer / touch interaction ────────────────────────────────
    const getX = (e: MouseEvent | TouchEvent) =>
      "touches" in e ? e.touches[0]?.clientX ?? s.lastX : e.clientX;

    const onDown = (e: MouseEvent | TouchEvent) => {
      s.isDragging = true;
      s.lastX = getX(e);
      s.velocity = 0;
      cardLine.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!s.isDragging) return;
      const x = getX(e);
      const dx = x - s.lastX;
      s.position += dx;
      s.direction = dx < 0 ? -1 : 1;
      s.velocity = Math.min(Math.abs(dx) * 12, 2400);
      s.lastX = x;
    };
    const onUp = () => {
      if (!s.isDragging) return;
      s.isDragging = false;
      cardLine.style.cursor = "grab";
    };

    cardLine.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    cardLine.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    const onResize = () => {
      viewW = window.innerWidth;
      camera.left = -viewW / 2;
      camera.right = viewW / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(viewW, FIELD_H);
      scannerCanvas.width = viewW;
      s.cardLineWidth = cardLine.scrollWidth;
    };
    window.addEventListener("resize", onResize);

    // ── Main loop ──────────────────────────────────────────────────
    const animate = (now: number) => {
      const dt = Math.min((now - s.lastTime) / 1000, 0.05);
      s.lastTime = now;

      if (!s.isDragging) {
        if (s.velocity > s.minVelocity) s.velocity *= friction;
        else s.velocity = s.minVelocity;
        s.position += s.velocity * s.direction * dt;
      }

      const containerW = cardLine.parentElement?.offsetWidth ?? viewW;
      if (s.position < -s.cardLineWidth) s.position = containerW;
      else if (s.position > containerW) s.position = -s.cardLineWidth;
      cardLine.style.transform = `translateX(${s.position}px)`;

      detectScan();

      // particles
      const t = now * 0.001;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i] * 0.016;
        if (positions[i * 3] > viewW / 2 + 100) positions[i * 3] = -viewW / 2 - 100;
        positions[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.5;
        alphas[i] = Math.max(0.1, Math.min(1, alphas[i] + (Math.random() - 0.5) * 0.05));
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
      renderer.render(scene, camera);

      // scanner spray
      ctx.clearRect(0, 0, viewW, SCAN_H);
      const target = scanningNow ? scanMax : baseMax;
      currentMax += (target - currentMax) * 0.05;
      while (spray.length < currentMax) spray.push(makeSP());
      while (spray.length > currentMax) spray.pop();
      for (const p of spray) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0 || p.x > viewW) Object.assign(p, makeSP());
        ctx.globalAlpha = p.alpha * p.life;
        ctx.fillStyle = isLight ? "#2f6c93" : "white";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      cardLine.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      cardLine.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [cards, cardGap, direction, friction, initialSpeed, isLight]);

  return (
    <section
      aria-label="Project showcase stream"
      className="relative w-full overflow-hidden py-16 md:py-24"
      style={{ background: "var(--bg)" }}
    >
      {/* Top / bottom hairlines tie it into the page rhythm */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-border-subtle)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--color-border-subtle)" }} />

      {/* Stream stage */}
      <div className="relative w-full h-[170px] md:h-[250px] flex items-center">
        {/* Floating particles */}
        <canvas
          ref={particleCanvasRef}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none"
        />
        {/* Scanner spray */}
        <canvas
          ref={scannerCanvasRef}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-10 pointer-events-none"
        />
        {/* Scanner line */}
        <div
          className={`absolute top-1/2 left-1/2 h-[200px] md:h-[280px] w-0.5 rounded-full z-20 pointer-events-none animate-scan-pulse transition-opacity duration-300 ${
            isScanning ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(to bottom, transparent, #4a82a8, transparent)",
            boxShadow: "0 0 10px #4a82a8, 0 0 20px #4a82a8, 0 0 36px #2f6c93, 0 0 60px #1e3a52",
          }}
        />

        {/* Card line */}
        <div
          ref={cardLineRef}
          className="flex items-center whitespace-nowrap cursor-grab select-none will-change-transform"
          style={{ gap: `${cardGap}px` }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="card-wrapper relative w-[260px] h-[163px] md:w-[400px] md:h-[250px] shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt="Showcase card"
                draggable={false}
                className="w-full h-full object-cover rounded-[15px] brightness-110 contrast-110"
                style={{ boxShadow: isLight ? "0 12px 32px rgba(20,40,60,0.18)" : "0 15px 40px rgba(0,0,0,0.4)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ScannerCardStream;
