"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

const ProcessGL = dynamic(() => import("@/components/three/ProcessGL"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    label: "Idea",
    sub: "Discovery & Direction",
    copy: "We shape raw product ideas into clear technical direction.",
    detail: "Market research, scope definition, tech stack decisions.",
  },
  {
    label: "Prototype",
    sub: "Validate Fast",
    copy: "We build fast, focused prototypes to validate the core experience.",
    detail: "Interactive wireframes, UX flows, rapid iteration cycles.",
  },
  {
    label: "Product",
    sub: "Build & Craft",
    copy: "We turn validated flows into real mobile and web applications.",
    detail: "Full-stack development, design system, CI/CD pipeline.",
  },
  {
    label: "Launch",
    sub: "Ship to Users",
    copy: "We prepare the product for users, stores, analytics, and production.",
    detail: "App store publishing, monitoring, onboarding, growth hooks.",
  },
  {
    label: "Scale",
    sub: "Grow & Evolve",
    copy: "We improve architecture, automation, performance, and growth systems.",
    detail: "Infra scaling, A/B testing, feature velocity, data pipelines.",
  },
];

export default function ProcessScene() {
  const outerRef   = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const copyRef    = useRef<HTMLParagraphElement>(null);
  const detailRef  = useRef<HTMLSpanElement>(null);
  const ghostRef   = useRef<HTMLSpanElement>(null);
  const stepNumRef = useRef<HTMLSpanElement>(null);
  const stepLblRef = useRef<HTMLSpanElement>(null);
  const stepSubRef = useRef<HTMLSpanElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const stepRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const activeStep = useRef(0);
  const prevStep   = useRef(-1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom top",
        pin: stickyRef.current,
        scrub: 1.2,
        onUpdate(self) {
          const idx = Math.min(4, Math.floor(self.progress * 5));
          activeStep.current = idx;

          // Timeline fill
          if (fillRef.current)
            fillRef.current.style.transform = `scaleX(${idx / 4})`;

          // Step tab states
          stepRefs.current.forEach((el, i) => {
            if (!el) return;
            const line = el.querySelector(".step-line") as HTMLElement | null;
            const lbl  = el.querySelector(".step-lbl")  as HTMLElement | null;
            if (i === idx) {
              el.style.opacity = "1";
              if (line) { line.style.background = "#4a82a8"; line.style.opacity = "1"; }
              if (lbl)    lbl.style.color = "var(--fg)";
            } else if (i < idx) {
              el.style.opacity = "0.3";
              if (line) { line.style.background = "var(--border-strong)"; line.style.opacity = "0.5"; }
              if (lbl)    lbl.style.color = "var(--fg-sub)";
            } else {
              el.style.opacity = "0.15";
              if (line) { line.style.background = "var(--border-mid)"; line.style.opacity = "0.4"; }
              if (lbl)    lbl.style.color = "var(--fg-muted)";
            }
          });

          if (idx !== prevStep.current) {
            prevStep.current = idx;
            const step = STEPS[idx];

            // Ghost number
            gsap.to(ghostRef.current, {
              opacity: 0, y: 30, duration: 0.22, ease: "power2.in",
              onComplete() {
                if (ghostRef.current) ghostRef.current.textContent = `0${idx + 1}`;
                gsap.fromTo(ghostRef.current,
                  { opacity: 0, y: -20 },
                  { opacity: 1,  y: 0, duration: 0.6, ease: "power3.out" }
                );
              },
            });

            // Step indicator
            if (stepNumRef.current) stepNumRef.current.textContent = `0${idx + 1}`;
            gsap.fromTo(stepNumRef.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });

            if (stepLblRef.current) {
              gsap.to(stepLblRef.current, { opacity: 0, x: -6, duration: 0.18, ease: "power2.in",
                onComplete() {
                  stepLblRef.current!.textContent = step.label.toUpperCase();
                  gsap.fromTo(stepLblRef.current, { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
                }
              });
            }

            if (stepSubRef.current) {
              gsap.to(stepSubRef.current, { opacity: 0, duration: 0.15,
                onComplete() {
                  stepSubRef.current!.textContent = step.sub;
                  gsap.to(stepSubRef.current, { opacity: 1, duration: 0.35, delay: 0.1 });
                }
              });
            }

            // Copy
            if (copyRef.current) {
              gsap.to(copyRef.current, {
                opacity: 0, y: -20, duration: 0.22, ease: "power2.in",
                onComplete() {
                  copyRef.current!.textContent = step.copy;
                  gsap.fromTo(copyRef.current,
                    { opacity: 0, y: 28 },
                    { opacity: 1, y: 0,  duration: 0.6, ease: "power3.out" }
                  );
                },
              });
            }

            // Detail
            if (detailRef.current) {
              gsap.to(detailRef.current, { opacity: 0, duration: 0.2,
                onComplete() {
                  detailRef.current!.textContent = step.detail;
                  gsap.to(detailRef.current, { opacity: 1, duration: 0.4, delay: 0.2 });
                }
              });
            }
          }
        },
      });
    }, outerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} style={{ height: "500vh" }}>
      <div
        ref={stickyRef}
        id="process"
        className="relative w-full h-screen overflow-hidden flex flex-col"
      >
        {/* Background */}
        <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

        {/* Three.js constellation */}
        <div className="absolute inset-0" style={{ opacity: 0.6 }}>
          <ProcessGL activeStep={activeStep} />
        </div>

        {/* Radial vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, rgba(var(--vignette-rgb),0.7) 75%, var(--bg) 100%)"
        }} />

        {/* Accent bottom glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 30% at 50% 110%, rgba(74,130,168,0.07) 0%, transparent 60%)"
        }} />

        {/* ── Top bar ── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 pt-7">
          <SectionLabel index="//03" title="PROCESS" />
          <div className="flex items-center gap-2.5">
            <span ref={stepNumRef} style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", color: "#4a82a8" }}>01</span>
            <span style={{ width: 1, height: 12, background: "var(--border-strong)", display: "inline-block" }} />
            <span ref={stepLblRef} style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.26em", color: "#2a4a62" }}>IDEA</span>
          </div>
        </div>

        {/* ── Ghost number — large typographic anchor (desktop only) ── */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 pointer-events-none items-center pr-[6vw] select-none">
          <span
            ref={ghostRef}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4.5rem, 25vw, 28rem)",
              fontWeight: 400,
              lineHeight: 1,
              color: "var(--fg)",
              opacity: 1,
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            01
          </span>
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-20 max-w-[88rem] mx-auto w-full pb-20">

          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div style={{ width: 28, height: 1, background: "#4a82a8" }} />
            <span ref={stepSubRef} style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.3em", color: "#4a82a8" }}>
              {STEPS[0].sub.toUpperCase()}
            </span>
          </div>

          {/* Copy — the headline */}
          <p
            ref={copyRef}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.8rem, 3.8vw, 4.2rem)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
              color: "var(--fg)",
              maxWidth: "16em",
            }}
          >
            {STEPS[0].copy}
          </p>

          {/* Detail line — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-3 mt-8">
            <div style={{ width: 16, height: 1, background: "#1e3a52", flexShrink: 0 }} />
            <span
              ref={detailRef}
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.18em", color: "#2a5a7c" }}
            >
              {STEPS[0].detail}
            </span>
          </div>
        </div>

        {/* ── Bottom timeline ── */}
        <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-[88rem] mx-auto w-full pb-10">
          {/* Track */}
          <div className="relative mb-4" style={{ height: 1, background: "var(--border-mid)" }}>
            <div
              ref={fillRef}
              className="absolute inset-y-0 left-0 right-0 origin-left"
              style={{ background: "linear-gradient(to right, #1e3a52, #4a82a8)", transform: "scaleX(0)" }}
            />
          </div>

          {/* Step labels */}
          <div className="flex justify-between">
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepRefs.current[i] = el; }}
                className="flex flex-col items-center gap-2"
                style={{ opacity: i === 0 ? 1 : 0.15, transition: "opacity 0.4s ease" }}
              >
                <div
                  className="step-line w-px"
                  style={{ height: 14, background: i === 0 ? "#4a82a8" : "var(--border-mid)", transition: "background 0.4s ease" }}
                />
                <span
                  className="step-lbl"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(0.34rem, 0.9vw, 0.5rem)",
                    letterSpacing: "0.12em",
                    color: i === 0 ? "var(--fg)" : "var(--fg-muted)",
                    transition: "color 0.4s ease",
                  }}
                >
                  {step.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
}
