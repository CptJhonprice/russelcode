"use client";

import dynamic from "next/dynamic";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductCard from "@/components/ui/ProductCard";
import { LampContainer } from "@/components/ui/LampContainer";
import { useLanguage } from "@/context/LanguageContext";

const AmbientField = dynamic(() => import("@/components/three/AmbientField"), { ssr: false });

// Brand names are not translated
const PRODUCT_NAMES = ["NesiVar", "Raftan", "WisePlates"];

// Internal landing pages for products that have one (per language)
const PRODUCT_HREFS: Record<string, { tr: string; en: string }> = {
  NesiVar: { tr: "/nesivar", en: "/en/nesivar" },
};

export default function ProductsScene() {
  const { t, lang } = useLanguage();
  const products = PRODUCT_NAMES.map((name, i) => ({
    name,
    ...t.products.items[i],
    href: PRODUCT_HREFS[name]?.[lang],
  }));
  return (
    <section
      id="products"
      className="relative w-full overflow-hidden pb-20 md:pb-28"
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
        <SectionLabel index="//04" title={t.nav.products} className="mb-5" />
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
          {t.products.headingPre}
          <em className="not-italic" style={{ color: "var(--color-text-muted)" }}>
            {t.products.headingEm}
          </em>
        </h2>
        <p className="t-body text-center mt-6" style={{ maxWidth: "44ch" }}>
          {t.products.sub}
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
          {products.map((p, i) => (
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
