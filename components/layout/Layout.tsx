"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { initLenis, destroyLenis } from "@/lib/lenis";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import SoundToggle from "@/components/ui/SoundToggle";

// Cursor must be client-only — no SSR
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <NoiseOverlay />
      <CustomCursor />
      <ProgressIndicator />
      <SoundToggle />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
