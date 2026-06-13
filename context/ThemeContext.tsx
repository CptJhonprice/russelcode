"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "rc-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start from the SSR default ("dark") so the first client render matches the
  // server markup, then apply the saved theme right after mount.
  const [theme, setThemeState] = useState<Theme>("dark");

  const apply = (t: Theme) => {
    setThemeState(t);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {
        /* ignore (private mode / blocked storage) */
      }
    }
  };

  // Read the saved theme once mounted and apply it to <html>.
  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") initial = saved;
    } catch {
      /* ignore */
    }
    apply(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: apply, toggle: () => apply(theme === "dark" ? "light" : "dark") }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
