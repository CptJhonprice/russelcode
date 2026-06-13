"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";

const SplineHero = dynamic(() => import("@/components/three/SplineHero"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

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
      {/* Theme base — flips white in light theme so the robot sits on white */}
      <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

      {/* Atmospheric blue glow behind robot */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 60% at 62% 55%, rgba(74,130,168,0.13) 0%, transparent 65%)" }} />

      {/* Interactive Spline 3D scene */}
      <div ref={bgRef} className="absolute inset-0">
        <SplineHero />
      </div>

      {/* Vignette — lighter edges so scene breathes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 150% 150% at 50% 50%, transparent 35%, rgba(var(--vignette-rgb),0.32) 72%, var(--bg) 100%)" }} />

      {/* ── Top bar ── */}
      <div className="relative z-20 flex items-center justify-between px-6 md:px-10 pt-6 pb-4 pointer-events-none">
        <span className="t-label" style={{ color: "var(--fg)", letterSpacing: "0.28em", fontSize: "0.58rem" }}>
          RUSSELLCODE
        </span>
        <SectionLabel index="//01" title={t.nav.intro} />
        <div style={{ width: 140 }} aria-hidden="true" />
      </div>

      {/* ── Main content — bottom-anchored editorial layout ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-5 md:px-10 lg:px-16 pb-20 md:pb-32 max-w-[90rem] mx-auto w-full pointer-events-none">
        <div ref={headRef} style={{ opacity: 0 }}>
          <h1 id="hero-heading" className="t-display mb-8">
            {t.hero.title[0]}
            <br />
            <span style={{ color: "rgba(74,130,168,0.38)" }}>{t.hero.title[1]}</span>
            <br />
            {t.hero.title[2]}
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
            <div className="flex items-center gap-4">
              <div style={{ width: 32, height: 1, background: "var(--accent)", flexShrink: 0 }} aria-hidden="true" />
              <span className="t-label" style={{ color: "var(--accent)" }}>{t.hero.studio}</span>
            </div>
            <p ref={subRef} className="t-body" style={{ maxWidth: "40ch", opacity: 0 }}>
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 right-10 z-10 flex items-center gap-3 pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <div className="w-px overflow-hidden" style={{ height: 48, background: "var(--border-mid)" }}>
          <div className="w-full h-full" style={{ background: "var(--accent)", animation: "scrollPulse 2.2s ease-in-out infinite" }} />
        </div>
        <span className="t-label" style={{ writingMode: "vertical-rl", letterSpacing: "0.16em" }}>{t.hero.scroll}</span>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-10 pointer-events-none" style={{ background: "var(--border-mid)" }} aria-hidden="true" />
    </section>
  );
}
