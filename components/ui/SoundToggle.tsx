"use client";

import { useState } from "react";
import { startAmbient, stopAmbient } from "@/lib/ambient-sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);

  function toggle() {
    const next = !on;
    setOn(next);
    if (next) startAmbient();
    else stopAmbient();
  }

  return (
    /*
     * touch-target: min 44×44px (ui-ux-pro-max §2 touch-target-size)
     * aria-label: descriptive for screen readers (§1 aria-labels)
     * press-feedback: opacity change on active (§2 press-feedback)
     */
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={on}
      className="fixed top-4 right-4 z-[9990] flex items-center gap-3 select-none
                 min-h-[44px] min-w-[44px] px-3
                 active:opacity-70
                 focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ touchAction: "manipulation" }}
    >
      {/* Label — hidden on smallest screens, shown md+ */}
      <span
        className="t-label hidden sm:block transition-colors"
        style={{
          color: on ? "var(--color-text-secondary)" : "var(--color-border-strong)",
          transitionDuration: "var(--duration-base)",
        }}
      >
        {on ? "SOUND ON" : "SOUND OFF"}
      </span>

      {/* Equaliser bars — use transform/opacity only (§7 transform-performance) */}
      <span
        className="flex items-end gap-[2.5px]"
        style={{ height: 14 }}
        aria-hidden="true"
      >
        {[3, 7, 11, 8, 4].map((maxH, i) => (
          <span
            key={i}
            className="block rounded-[1px]"
            style={{
              width: 2,
              height: on ? maxH : 2,
              backgroundColor: on ? "var(--color-accent)" : "var(--color-border-strong)",
              /* Duration 150-300ms (ui-ux-pro-max §7 duration-timing) */
              transitionProperty: "height, background-color",
              transitionDuration: on ? `${180 + i * 40}ms` : "150ms",
              transitionTimingFunction: "var(--ease-out)",
              animation: on
                ? `barPulse${i} ${1.1 + i * 0.2}s ease-in-out infinite alternate`
                : "none",
            }}
          />
        ))}
      </span>

      <style>{`
        @keyframes barPulse0 { from{height:2px}  to{height:7px}  }
        @keyframes barPulse1 { from{height:4px}  to{height:11px} }
        @keyframes barPulse2 { from{height:7px}  to{height:13px} }
        @keyframes barPulse3 { from{height:4px}  to{height:9px}  }
        @keyframes barPulse4 { from{height:2px}  to{height:5px}  }
      `}</style>
    </button>
  );
}
