"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

const NeuralNoise = dynamic(() => import("@/components/three/NeuralNoise"), { ssr: false });

interface EnterScreenProps {
  sceneLoaded: boolean;
  onComplete: () => void;
}

// ── Scramble text hook ───────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ∆∑∏Ω·∞#@";

function useScramble(original: string, delay = 700) {
  const [text, setText] = useState(() => original.replace(/\S/g, "·"));

  useEffect(() => {
    let frame = 0;
    const totalFrames = original.length * 4;
    let id: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      id = setInterval(() => {
        setText(
          original
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < Math.floor(frame / 4)) return ch;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        frame++;
        if (frame > totalFrames) {
          setText(original);
          clearInterval(id);
        }
      }, 38);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(id); };
  }, [original, delay]);

  return text;
}

export default function EnterScreen({ sceneLoaded, onComplete }: EnterScreenProps) {
  const { t } = useLanguage();
  const [progress, setProgress]   = useState(0);
  const [entering, setEntering]   = useState(false);
  const [showUI, setShowUI]       = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);
  const numRef       = useRef<HTMLSpanElement>(null);
  const enterReq     = useRef(false);
  const fired        = useRef(false);

  const title = useScramble("RUSSELLCODE", 600);

  // UI reveal after mount
  useEffect(() => {
    const t = setTimeout(() => setShowUI(true), 200);
    return () => clearTimeout(t);
  }, []);

  // ── Exit ───────────────────────────────────────────────────────────
  const exit = () => {
    if (fired.current) return;
    fired.current = true;
    setProgress(100);
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.1,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete,
    });
  };

  useEffect(() => { if (sceneLoaded && enterReq.current) exit(); }, [sceneLoaded]);

  // ── Progress creep ─────────────────────────────────────────────────
  useEffect(() => {
    if (!entering) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: 90,
      duration: 2.5,
      ease: "power1.out",
      onUpdate: () => setProgress(Math.round(obj.v)),
    });
    return () => { tween.kill(); };
  }, [entering]);

  useEffect(() => { if (entering && sceneLoaded) setProgress(100); }, [entering, sceneLoaded]);

  useEffect(() => {
    if (barRef.current)
      gsap.to(barRef.current, { scaleX: progress / 100, duration: 0.35, ease: "power2.out" });
    if (numRef.current) numRef.current.textContent = String(progress);
  }, [progress]);

  const handleEnter = () => {
    enterReq.current = true;
    if (sceneLoaded) { exit(); return; }
    setEntering(true);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "#ffffff" }}
    >
      {/* WebGL neural-link field — blue lines on white */}
      <NeuralNoise color={[0.29, 0.51, 0.66]} />

      {/* Corner accents */}
      <div
        className="absolute top-5 left-5 md:top-7 md:left-8 flex items-center gap-3"
        style={{
          opacity: showUI ? 1 : 0,
          transform: showUI ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.28em", color: "#1a3a52" }}>
          RC
        </span>
        <span style={{ width: 24, height: 1, background: "#7da3bf", display: "block" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", letterSpacing: "0.2em", color: "#3a6483" }}>
          STUDIO
        </span>
      </div>

      <div
        className="absolute top-5 right-5 md:top-7 md:right-8"
        style={{
          opacity: showUI ? 1 : 0,
          transition: "opacity 0.7s ease 0.2s",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", letterSpacing: "0.22em", color: "#3a6483" }}>
          2026
        </span>
      </div>

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Main title */}
        <div
          style={{
            opacity: showUI ? 1 : 0,
            transform: showUI ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 9vw, 9rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "#0d1f33",
              textAlign: "center",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Separator + subtitle */}
        <div
          className="flex flex-col items-center gap-4"
          style={{
            opacity: showUI ? 1 : 0,
            transform: showUI ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.65s, transform 0.8s ease 0.65s",
          }}
        >
          {/* Animated separator */}
          <div className="flex items-center gap-4">
            <span style={{ width: "clamp(40px, 6vw, 80px)", height: 1, background: "linear-gradient(to right, transparent, #4a82a8)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", color: "#4a82a8" }}>◆</span>
            <span style={{ width: "clamp(40px, 6vw, 80px)", height: 1, background: "linear-gradient(to left, transparent, #4a82a8)" }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.32em", color: "#3a6483" }}>
            {t.enter.studio}
          </span>
        </div>

        {/* Enter button or loading */}
        <div
          className="mt-8"
          style={{
            opacity: showUI ? 1 : 0,
            transform: showUI ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.8s ease 0.9s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s",
          }}
        >
          {!entering ? (
            <button
              onClick={handleEnter}
              className="group relative flex items-center justify-center"
              style={{ width: 140, height: 140, cursor: "none", background: "transparent", border: "none" }}
              aria-label="Enter site"
            >
              {/* Outer spinning ring */}
              <svg
                viewBox="0 0 140 140"
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: "enter-spin 12s linear infinite",
                }}
              >
                <circle
                  cx="70" cy="70" r="65"
                  fill="none"
                  stroke="#1e3a52"
                  strokeWidth="1"
                  strokeDasharray="408"
                  strokeDashoffset="0"
                />
                <circle
                  cx="70" cy="70" r="65"
                  fill="none"
                  stroke="#4a82a8"
                  strokeWidth="1"
                  strokeDasharray="82 326"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  style={{ opacity: 0.7 }}
                />
              </svg>

              {/* Inner hover ring */}
              <svg
                viewBox="0 0 140 140"
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: "enter-spin 7s linear infinite reverse",
                  opacity: 0.4,
                }}
              >
                <circle
                  cx="70" cy="70" r="56"
                  fill="none"
                  stroke="#2a5a7c"
                  strokeWidth="0.5"
                  strokeDasharray="18 18"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center dot + glow */}
              <div
                style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4a82a8",
                  boxShadow: "0 0 12px 4px rgba(74,130,168,0.4)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Label */}
              <span
                style={{
                  position: "relative",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.3em",
                  color: "#0d1f33",
                  marginTop: 20,
                }}
              >
                {t.enter.enterSite}
              </span>
            </button>
          ) : (
            /* Loading state */
            <div className="flex flex-col items-center gap-5">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "#3d6b8c" }}>
                {t.enter.preparing}
              </span>
              <div style={{ position: "relative", width: 220, height: 1, background: "#0e1a24" }}>
                <div
                  ref={barRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, #1e3a52, #4a82a8)",
                    transformOrigin: "left",
                    transform: "scaleX(0)",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  ref={numRef}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.1em", color: "#4a82a8" }}
                >
                  0
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "#1e3040" }}>/ 100</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-7 left-1/2"
        style={{
          transform: showUI ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(8px)",
          opacity: showUI ? 1 : 0,
          transition: "opacity 0.8s ease 1.1s, transform 0.8s ease 1.1s",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.28em", color: "#3a6483" }}>
          {t.enter.tagline}
        </span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes enter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
