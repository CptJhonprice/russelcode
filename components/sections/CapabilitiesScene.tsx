"use client";

import { motion, type Variants } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const CAPABILITIES = [
  { name: "Mobile Apps",            note: "iOS & Android" },
  { name: "AI Systems",             note: "LLM pipelines, agents" },
  { name: "Backend Infrastructure", note: "APIs, databases, cloud" },
  { name: "Product Strategy",       note: "Roadmap, prioritisation" },
  { name: "Automation",             note: "Workflows, jobs, triggers" },
  { name: "API Integrations",       note: "Third-party connectivity" },
  { name: "Store Deployment",       note: "App Store, Play Store" },
  { name: "Scalable Architecture",  note: "Performance, reliability" },
];

/*
 * duration: 250ms within 150-300ms window (ui-ux-pro-max §7 duration-timing)
 * ease-out for entering elements (§7 easing)
 * stagger 50ms per item (§7 stagger-sequence)
 */
const rowVariant: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, delay: i * 0.05, ease: "easeOut" },
  }),
};

export default function CapabilitiesScene() {
  return (
    <section
      id="capabilities"
      className="relative w-full py-20 md:py-28 overflow-hidden"
      aria-labelledby="capabilities-heading"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-subtle)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-[90rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-32">

          {/* Left — heading */}
          <div className="lg:sticky lg:top-32 self-start">
            <SectionLabel index="//05" title="CAPABILITIES" className="mb-6" />
            <h2
              id="capabilities-heading"
              className="t-headline mb-8"
            >
              What we
              <br />
              <em className="not-italic" style={{ color: "rgba(74,130,168,0.55)" }}>
                build.
              </em>
            </h2>
            <p className="t-body" style={{ maxWidth: "30ch" }}>
              Full-spectrum software execution — from product conception to
              production infrastructure and growth systems.
            </p>

            {/* Canvas geometric accent */}
            <div className="mt-14 hidden lg:block" aria-hidden="true">
              <div className="w-8 h-8 relative">
                <div
                  className="absolute top-0 left-0 w-full h-px"
                  style={{ background: "var(--color-border-default)" }}
                />
                <div
                  className="absolute top-0 left-0 w-px h-full"
                  style={{ background: "var(--color-border-default)" }}
                />
              </div>
            </div>
          </div>

          {/* Right — capability rows, semantic list */}
          <ul className="flex flex-col" role="list">
            {CAPABILITIES.map((cap, i) => (
              <motion.li
                key={cap.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={rowVariant}
                className="group flex items-center justify-between py-5 border-b cursor-default"
                style={{
                  borderColor: "var(--color-border-subtle)",
                  listStyle: "none",
                }}
              >
                <div className="flex items-center gap-5">
                  <span
                    className="t-mono"
                    style={{ minWidth: 28, color: "var(--color-border-strong)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-light tracking-tight transition-colors"
                    style={{
                      fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                      color: "var(--color-text-primary)",
                      lineHeight: 1.3,
                      transitionDuration: "var(--duration-base)",
                    }}
                  >
                    {cap.name}
                  </span>
                </div>
                <span
                  className="t-label text-right transition-colors"
                  style={{
                    color: "var(--color-border-default)",
                    transitionDuration: "var(--duration-base)",
                  }}
                >
                  {cap.note}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-subtle)" }}
        aria-hidden="true"
      />
    </section>
  );
}
