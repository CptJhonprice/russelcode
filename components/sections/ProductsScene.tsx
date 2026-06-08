"use client";

import dynamic from "next/dynamic";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductCard from "@/components/ui/ProductCard";
import { LampContainer } from "@/components/ui/LampContainer";

const AmbientField = dynamic(() => import("@/components/three/AmbientField"), { ssr: false });

const PRODUCTS = [
  {
    name: "NesiVar",
    tagline: "AI-powered vehicle insight platform.",
    description:
      "Intelligent vehicle analysis powered by AI. Identify issues, track service history, and make informed decisions about any vehicle.",
    tag: "AI — MOBILE",
  },
  {
    name: "Raftan",
    tagline: "AI food and label analysis.",
    description:
      "Scan any food label and get instant AI-powered nutritional insights, allergen detection, and personalized health scoring.",
    tag: "AI — HEALTH",
  },
  {
    name: "WisePlates",
    tagline: "CRM and client management for dietitians.",
    description:
      "A full-stack practice management platform for nutrition professionals. Track clients, plans, progress, and billing in one place.",
    tag: "PLATFORM — B2B",
  },
];

export default function ProductsScene() {
  return (
    <section
      id="products"
      className="relative w-full overflow-hidden pb-32 md:pb-48"
      aria-labelledby="products-heading"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-subtle)" }}
        aria-hidden="true"
      />

      {/* Lamp reveal header */}
      <LampContainer className="min-h-[50vh] md:min-h-[60vh]">
        <SectionLabel index="//04" title="PRODUCTS" className="mb-5" />
        {/* h2 — correct level after h1 in hero (ui-ux-pro-max §1 heading-hierarchy) */}
        <h2
          id="products-heading"
          className="text-center font-light tracking-tight"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1.02,
            color: "var(--fg)",
          }}
        >
          Products we&apos;ve built{" "}
          <em className="not-italic" style={{ color: "var(--color-text-muted)" }}>
            and shipped.
          </em>
        </h2>
        <p className="t-body text-center mt-6" style={{ maxWidth: "44ch" }}>
          Real products in the market, built end-to-end by RussellCode.
        </p>
      </LampContainer>

      <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-[90rem] mx-auto -mt-[4vh]">
        {/* Ambient Three.js field — behind the cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.28 }}
          aria-hidden="true"
        >
          <AmbientField count={350} />
        </div>

        {/* Product grid — semantic list (ui-ux-pro-max §1) */}
        <ul
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          role="list"
        >
          {PRODUCTS.map((p, i) => (
            <li key={p.name} style={{ listStyle: "none" }}>
              <ProductCard {...p} index={i} />
            </li>
          ))}
        </ul>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-subtle)" }}
        aria-hidden="true"
      />
    </section>
  );
}
