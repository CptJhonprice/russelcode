"use client";

import dynamic from "next/dynamic";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductCard from "@/components/ui/ProductCard";

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
      className="relative w-full py-32 md:py-48 overflow-hidden"
      aria-labelledby="products-heading"
      style={{ background: "var(--color-surface-base)" }}
    >
      {/* Ambient Three.js field */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.28 }}
        aria-hidden="true"
      >
        <AmbientField count={350} />
      </div>

      {/* Top fade */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--color-surface-base), transparent)" }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-subtle)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 md:px-10 lg:px-20 max-w-[90rem] mx-auto">

        {/* Heading block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 md:mb-28">
          <div>
            <SectionLabel index="//04" title="PRODUCTS" className="mb-5" />
            {/* h2 — correct level after h1 in hero (ui-ux-pro-max §1 heading-hierarchy) */}
            <h2 id="products-heading" className="t-headline">
              Products we&apos;ve built
              <br />
              <em className="not-italic" style={{ color: "var(--color-text-muted)" }}>
                and shipped.
              </em>
            </h2>
          </div>
          <p className="t-body" style={{ maxWidth: "30ch", textAlign: "right" }}>
            Real products in the market,
            <br />
            built end-to-end by RussellCode.
          </p>
        </div>

        {/* Product grid — semantic list (ui-ux-pro-max §1) */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
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
