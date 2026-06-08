"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

const ProcessGL = dynamic(() => import("@/components/three/ProcessGL"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { label: "Idea",      copy: "We shape raw product ideas into clear technical direction." },
  { label: "Prototype", copy: "We build fast, focused prototypes to validate the core experience." },
  { label: "Product",   copy: "We turn validated flows into real mobile and web applications." },
  { label: "Launch",    copy: "We prepare the product for users, stores, analytics, and production." },
  { label: "Scale",     copy: "We improve architecture, automation, performance, and growth systems." },
];

export default function ProcessScene() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const copyRef   = useRef<HTMLParagraphElement>(null);
  const stepRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRef   = useRef<HTMLDivElement>(null);
  const fillRef   = useRef<HTMLDivElement>(null);
  const indexRef  = useRef<HTMLSpanElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);

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
          const p   = self.progress;
          const raw = p * 5;
          const idx = Math.min(4, Math.floor(raw));
          activeStep.current = idx;

          // Move node + fill
          const pct = (idx / 4) * 100;
          if (nodeRef.current) nodeRef.current.style.left = `${pct}%`;
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct / 100})`;

          // Step label styles
          stepRefs.current.forEach((el, i) => {
            if (!el) return;
            el.style.opacity = i === idx ? "1" : i < idx ? "0.25" : "0.12";
            const lbl = el.querySelector(".step-lbl") as HTMLElement | null;
            if (lbl) lbl.style.color = i === idx ? "#dedad4" : "#2a3540";
            const dot = el.querySelector(".step-dot") as HTMLElement | null;
            if (dot) {
              dot.style.backgroundColor = i === idx ? "#3d6b8c" : i < idx ? "#1e2e3a" : "#0f0f12";
              dot.style.boxShadow = i === idx ? "0 0 10px rgba(61,107,140,0.6)" : "none";
            }
          });

          if (idx !== prevStep.current) {
            prevStep.current = idx;
            if (indexRef.current) indexRef.current.textContent = `0${idx + 1}`;
            if (labelRef.current) labelRef.current.textContent = STEPS[idx].label.toUpperCase();

            if (copyRef.current) {
              gsap.to(copyRef.current, {
                opacity: 0, y: -16, duration: 0.2, ease: "power2.in",
                onComplete() {
                  copyRef.current!.textContent = STEPS[idx].copy;
                  gsap.fromTo(copyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
                },
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
        className="relative w-full h-screen overflow-hidden flex flex-col justify-center"
      >
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#07070a]" />

        {/* Three.js network graph */}
        <div className="absolute inset-0 opacity-75">
          <ProcessGL activeStep={activeStep} />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 130% 130% at 50% 50%, transparent 20%, rgba(7,7,10,0.62) 72%, #07070a 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(61,107,140,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 pt-7">
          <SectionLabel index="//03" title="PROCESS" />
          <div className="flex items-center gap-2">
            <span ref={indexRef} className="t-label tabular-nums font-medium" style={{ color: "#3d6b8c", fontSize: "0.7rem" }}>01</span>
            <div className="w-px h-3 bg-[#1a1a1e]" />
            <span ref={labelRef} className="t-label" style={{ color: "#1e2a32" }}>IDEA</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-[88rem] mx-auto w-full">
          {/* Timeline */}
          <div className="relative mb-16">
            {/* Track */}
            <div className="absolute top-[5px] left-0 right-0 h-px bg-[#0f0f12]" />
            {/* Fill */}
            <div
              ref={fillRef}
              className="absolute top-[5px] left-0 h-px origin-left"
              style={{ right: 0, background: "#3d6b8c", transform: "scaleX(0)" }}
            />

            {/* Step dots row */}
            <div className="relative flex justify-between">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="flex flex-col items-center gap-3 transition-all duration-350"
                  style={{ opacity: i === 0 ? 1 : 0.12 }}
                >
                  <div
                    className="step-dot w-[5px] h-[5px] rounded-full transition-all duration-500"
                    style={{ backgroundColor: i === 0 ? "#3d6b8c" : "#0f0f12" }}
                  />
                  <span className="step-lbl t-label transition-colors duration-300" style={{ color: i === 0 ? "#dedad4" : "#2a3540" }}>
                    {step.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrubbing node */}
          <div className="relative h-0 -mt-[66px] mb-16 pointer-events-none">
            <div
              ref={nodeRef}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: "0%", top: 5, transition: "left 0.07s linear" }}
            >
              <div className="w-[6px] h-[6px] rounded-full bg-[#3d6b8c]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-[#3d6b8c] opacity-10 blur-sm" />
            </div>
          </div>

          {/* Copy */}
          <p ref={copyRef} className="t-scene max-w-2xl" style={{ color: "#dedad4" }}>
            {STEPS[0].copy}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ background: "#0d0d10" }} />
      </div>
    </div>
  );
}
