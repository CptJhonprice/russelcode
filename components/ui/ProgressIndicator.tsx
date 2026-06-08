"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Right-side vertical scroll progress rail.
 * Shows current section label alongside the scrubbing line.
 */
const SECTIONS = [
  { id: "hero",         label: "//01", name: "INTRO" },
  { id: "philosophy",   label: "//02", name: "PHILOSOPHY" },
  { id: "process",      label: "//03", name: "PROCESS" },
  { id: "products",     label: "//04", name: "PRODUCTS" },
  { id: "capabilities", label: "//05", name: "CAPABILITIES" },
  { id: "contact",      label: "//06", name: "CONTACT" },
];

export default function ProgressIndicator() {
  const trackRef  = useRef<HTMLDivElement>(null);
  const fillRef   = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;

      if (fillRef.current)  fillRef.current.style.transform  = `scaleY(${progress})`;
      if (dotRef.current)   dotRef.current.style.top         = `${progress * 100}%`;

      // Show after scrolling 60px
      setVisible(scrollTop > 60);

      // Active section: find which section occupies most of the viewport
      const mid = scrollTop + window.innerHeight * 0.4;
      const totalH = document.documentElement.scrollHeight;
      const idx = Math.min(
        SECTIONS.length - 1,
        Math.floor((mid / totalH) * SECTIONS.length)
      );
      setActiveSection(idx);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[9990] flex flex-col items-center gap-3 transition-opacity duration-700 hidden md:flex"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Active label */}
      <span
        className="t-label text-[#3d6b8c] mb-1 writing-mode-vertical"
        style={{ writingMode: "vertical-rl", letterSpacing: "0.18em" }}
      >
        {SECTIONS[activeSection]?.label}
      </span>

      {/* Vertical rail */}
      <div
        ref={trackRef}
        className="relative w-px bg-[#1a1a1e]"
        style={{ height: 120 }}
      >
        {/* Progress fill */}
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top bg-[#3d6b8c]"
          style={{ transform: "scaleY(0)" }}
        />
        {/* Glowing dot */}
        <div
          ref={dotRef}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "0%" }}
        >
          <div className="w-[3px] h-[3px] rounded-full bg-[#3d6b8c]" />
          <div
            className="absolute inset-0 rounded-full bg-[#3d6b8c] opacity-40"
            style={{ transform: "scale(3)", filter: "blur(2px)" }}
          />
        </div>
      </div>

      {/* Section dots */}
      <div className="flex flex-col items-center gap-[6px] mt-2">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width:  i === activeSection ? 3 : 2,
              height: i === activeSection ? 3 : 2,
              backgroundColor: i === activeSection ? "#3d6b8c" : "#2c2c34",
              boxShadow: i === activeSection ? "0 0 6px rgba(61,107,140,0.6)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
