"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="fixed top-24 right-4 z-[9990] flex items-center gap-1.5 select-none min-h-[44px] px-3"
      style={{ touchAction: "manipulation" }}
    >
      <button
        onClick={() => setLang("en")}
        aria-label="Switch to English"
        aria-pressed={lang === "en"}
        className="t-label active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ color: lang === "en" ? "var(--color-accent)" : "var(--color-border-strong)", transition: "color 200ms" }}
      >
        EN
      </button>
      <span style={{ color: "var(--color-border-strong)", fontSize: "0.5rem" }}>/</span>
      <button
        onClick={() => setLang("tr")}
        aria-label="Türkçe'ye geç"
        aria-pressed={lang === "tr"}
        className="t-label active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ color: lang === "tr" ? "var(--color-accent)" : "var(--color-border-strong)", transition: "color 200ms" }}
      >
        TR
      </button>
    </div>
  );
}
