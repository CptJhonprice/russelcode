"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer
      className="relative z-10 px-5 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--color-border-subtle)" }}
    >
      <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>RUSSELLCODE</span>
      <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>© {new Date().getFullYear()} — {t.footer.rights}</span>
      <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>{t.footer.tagline}</span>
    </footer>
  );
}
