"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

const PhilosophyGL = dynamic(() => import("@/components/three/PhilosophyGL"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const STATES = [
  { text: "Logic before noise.",         sub: "Clarity is the foundation of every system we build." },
  { text: "Systems before screens.",     sub: "Architecture precedes interface. Structure precedes style." },
  { text: "Products before promises.",   sub: "We ship working software, not decks or prototypes." },
  { text: "Software built with reason.", sub: "Every line of code has a purpose. Every feature has a reason." },
];

export default function PhilosophyScene() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLSpanElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);
  const dotRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef   = useRef<HTMLDivElement>(null);

  // Shared progress ref — drives PhilosophyGL morph without re-renders
  const glProgress = useRef(0);
  const prevIdx    = useRef(-1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom top",
        pin: stickyRef.current,
        scrub: 1.5,
        onUpdate(self) {
          const p   = self.progress;
          glProgress.current = p;

          const raw = p * 4;
          const idx = Math.min(3, Math.floor(raw));

          // Text cross-fade on index change
          if (idx !== prevIdx.current) {
            prevIdx.current = idx;

            if (numRef.current) numRef.current.textContent = `0${idx + 1} / 04`;
            if (lineRef.current) lineRef.current.style.transform = `scaleY(${(idx + 0.5) / 4})`;

            // Dot styling
            dotRefs.current.forEach((dot, i) => {
              if (!dot) return;
              dot.style.height = i === idx ? "20px" : i < idx ? "5px" : "3px";
              dot.style.backgroundColor = i === idx ? "#3d6b8c" : i < idx ? "var(--border-strong)" : "var(--border-mid)";
              dot.style.boxShadow = i === idx ? "0 0 10px rgba(61,107,140,0.55)" : "none";
            });

            // Animate text
            gsap.to([textRef.current, subRef.current], {
              opacity: 0, y: -20, duration: 0.22, ease: "power2.in",
              onComplete() {
                if (textRef.current) textRef.current.textContent = STATES[idx].text;
                if (subRef.current)  subRef.current.textContent  = STATES[idx].sub;
                gsap.fromTo(
                  [textRef.current, subRef.current],
                  { opacity: 0, y: 26 },
                  { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }
                );
              },
            });
          }
        },
      });
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} style={{ height: "400vh" }}>
      <div
        ref={stickyRef}
        id="philosophy"
        className="relative w-full h-screen overflow-hidden flex items-center"
      >
        {/* Dark base */}
        <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

        {/* Three.js morphing sphere */}
        <div className="absolute inset-0 opacity-70">
          <PhilosophyGL progress={glProgress} />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 120% at 50% 50%, transparent 25%, rgba(var(--vignette-rgb),0.6) 70%, var(--bg) 100%)",
          }}
        />
        {/* Bottom glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 100%, rgba(61,107,140,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 pt-7">
          <SectionLabel index="//02" title="PHILOSOPHY" />
          <span ref={numRef} className="t-label tabular-nums" style={{ color: "var(--fg-ghost)" }}>
            01 / 04
          </span>
        </div>

        {/* Right progress rail */}
        <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <div className="relative w-px bg-[var(--border-mid)]" style={{ height: 100 }}>
            <div
              ref={lineRef}
              className="absolute inset-0 origin-top"
              style={{ background: "#3d6b8c", transform: "scaleY(0.125)", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
            />
          </div>
          {STATES.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="w-[2px] rounded-full transition-all duration-500"
              style={{ height: i === 0 ? 20 : 3, backgroundColor: i === 0 ? "#3d6b8c" : "var(--border-mid)" }}
            />
          ))}
        </div>

        {/* Main copy */}
        <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-[88rem] mx-auto w-full mt-12">
          <div className="max-w-3xl">
            <span ref={textRef} className="t-scene block mb-6">{STATES[0].text}</span>
            <p ref={subRef} className="t-body max-w-xs">{STATES[0].sub}</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
}
