"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import Ticker from "@/components/ui/Ticker";
import AnimatedGrid from "@/components/ui/AnimatedGrid";

const HeroGL = dynamic(() => import("@/components/three/HeroGL"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const scrollY    = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          headRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.3 }
        );
        gsap.fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.75 }
        );
        gsap.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, delay: 1.3 }
        );

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          onUpdate(self) {
            const p = self.progress;
            gsap.set([headRef.current, subRef.current], {
              opacity: Math.max(0, 1 - p * 2.2),
              y: -p * 80,
            });
            gsap.set(bgRef.current, { scale: 1 + p * 0.055 });
            gsap.set(scrollRef.current, { opacity: Math.max(0, 1 - p * 6) });
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden flex flex-col"
      aria-labelledby="hero-heading"
    >
      {/* Dark base */}
      <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

      {/* Grid */}
      <div className="absolute inset-0" style={{ opacity: 0.4 }}>
        <AnimatedGrid opacity={0.045} color="#4a82a8" cellSize={82} drift={false} />
      </div>

      {/* Three.js */}
      <div ref={bgRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <HeroGL scrollY={scrollY} />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 140% 140% at 50% 50%, transparent 15%, rgba(7,7,9,0.65) 70%, var(--bg) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 35% at 50% 100%, rgba(74,130,168,0.12) 0%, transparent 65%)" }} />

      {/* ── Top bar ── */}
      <div className="relative z-20 flex items-center justify-between px-6 md:px-10 pt-6 pb-4">
        <span className="t-label" style={{ color: "var(--fg)", letterSpacing: "0.28em", fontSize: "0.58rem" }}>
          RUSSELLCODE
        </span>
        <SectionLabel index="//01" title="INTRO" />
        <div style={{ width: 140 }} aria-hidden="true" />
      </div>

      {/* ── Main content — bottom-anchored editorial layout ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-24 md:pb-32 max-w-[90rem] mx-auto w-full">

        {/* Large display heading — Gloock serif from skill */}
        <div ref={headRef} style={{ opacity: 0 }}>
          <h1
            id="hero-heading"
            className="t-display mb-8"
          >
            Software
            <br />
            <span style={{ color: "var(--fg-muted)" }}>built with</span>
            <br />
            reason.
          </h1>

          {/* Horizontal rule + subtext side by side */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
            <div className="flex items-center gap-4">
              <div style={{ width: 32, height: 1, background: "var(--accent)", flexShrink: 0 }} aria-hidden="true" />
              <span className="t-label" style={{ color: "var(--accent)" }}>SOFTWARE STUDIO — EST. 2024</span>
            </div>
            <p ref={subRef} className="t-body" style={{ maxWidth: "40ch", opacity: 0 }}>
              RussellCode designs and builds AI&#8209;native products,
              mobile apps, and scalable software systems.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 right-10 z-10 flex items-center gap-3"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <div className="w-px overflow-hidden" style={{ height: 48, background: "var(--border-mid)" }}>
          <div className="w-full h-full" style={{ background: "var(--accent)", animation: "scrollPulse 2.2s ease-in-out infinite" }} />
        </div>
        <span className="t-label" style={{ writingMode: "vertical-rl", letterSpacing: "0.16em" }}>SCROLL</span>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ background: "var(--border-mid)" }} aria-hidden="true" />
    </section>
  );
}
