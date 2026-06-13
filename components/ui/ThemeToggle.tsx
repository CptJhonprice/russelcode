"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      className="fixed top-14 right-4 z-[9990] flex items-center gap-3 select-none
                 min-h-[44px] min-w-[44px] px-3
                 active:opacity-70
                 focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ touchAction: "manipulation" }}
    >
      <span
        className="t-label hidden sm:block transition-colors"
        style={{ color: "var(--color-border-strong)", transitionDuration: "200ms" }}
      >
        {isDark ? "DARK" : "LIGHT"}
      </span>

      <span aria-hidden="true" className="flex items-center justify-center" style={{ width: 14, height: 14 }}>
        {isDark ? (
          /* Moon */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11.5 8.6A4.6 4.6 0 0 1 5.4 2.5 4.6 4.6 0 1 0 11.5 8.6Z"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          /* Sun */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="2.6" stroke="var(--color-accent)" strokeWidth="1" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="7"
                y1="0.8"
                x2="7"
                y2="2.2"
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeLinecap="round"
                transform={`rotate(${deg} 7 7)`}
              />
            ))}
          </svg>
        )}
      </span>
    </button>
  );
}
