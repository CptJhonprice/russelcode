"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Dict, type Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
  t: translations.en,
});

const STORAGE_KEY = "rc-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // SSR-safe default ("tr", matching <html lang>); saved choice applied after mount.
  const [lang, setLangState] = useState<Lang>("tr");

  const apply = (l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", l);
      try {
        localStorage.setItem(STORAGE_KEY, l);
      } catch {
        /* ignore */
      }
    }
  };

  useEffect(() => {
    let initial: Lang = "tr";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "tr") initial = saved;
    } catch {
      /* ignore */
    }
    apply(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang: apply, toggle: () => apply(lang === "en" ? "tr" : "en"), t: translations[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
