"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedGrid from "@/components/ui/AnimatedGrid";

export default function ContactScene() {
  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      aria-labelledby="contact-heading"
      style={{ background: "var(--bg)" }}
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatedGrid opacity={0.04} color="var(--color-accent)" cellSize={80} drift />
        {/* Atmospheric bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, var(--color-accent-glow) 0%, transparent 65%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 130% 130% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-subtle)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-10 py-32 md:py-44">
        <div className="w-full max-w-3xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            /* 250ms — within skill window (§7 duration-timing) */
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex justify-center mb-10"
          >
            <SectionLabel index="//06" title="CONTACT" />
          </motion.div>

          <motion.h2
            id="contact-heading"
            className="t-headline mb-6"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Build with
            <br />
            <em className="not-italic" style={{ color: "rgba(74,130,168,0.55)" }}>
              RussellCode.
            </em>
          </motion.h2>

          <motion.p
            className="t-body mx-auto mb-14"
            style={{ maxWidth: "42ch" }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
          >
            For software products, AI systems, and premium digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
          >
            {/*
             * CTA — min 44px touch target (ui-ux-pro-max §2 touch-target-size)
             * Hover: border color change — state-clarity (§4)
             * transition 200ms — within 150-300ms (§7)
             */}
            <a
              href="mailto:hello@russellcode.com"
              className="group inline-flex items-center gap-4 min-h-[52px] px-10 t-label"
              style={{
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-default)",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                transition: "border-color var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-border-default)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-border-default)";
              }}
            >
              START A PROJECT
              {/* Arrow — width transition via transform is OK here (small inline element) */}
              <span
                aria-hidden="true"
                className="block h-px"
                style={{
                  width: 16,
                  background: "var(--color-accent)",
                  transition: "width var(--duration-base) var(--ease-out)",
                }}
              />
            </a>
          </motion.div>

          {/* Decorative rule with monogram — canvas §2 minimal text */}
          <div
            className="flex items-center gap-5 mt-20"
            style={{ opacity: 0.18 }}
            aria-hidden="true"
          >
            <div className="flex-1 h-px" style={{ background: "var(--color-border-default)" }} />
            <span className="t-label" style={{ fontSize: "0.5rem", letterSpacing: "0.3em" }}>RC</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border-default)" }} />
          </div>
        </div>
      </div>

      {/* Footer — semantic contentinfo landmark */}
      <footer
        className="relative z-10 px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>
          RUSSELLCODE
        </span>
        <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>
          © {new Date().getFullYear()} — ALL RIGHTS RESERVED
        </span>
        <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>
          SOFTWARE BUILT WITH REASON.
        </span>
      </footer>
    </section>
  );
}
