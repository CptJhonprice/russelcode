"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { initLenis, destroyLenis } from "@/lib/lenis";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import SoundToggle from "@/components/ui/SoundToggle";
import EnterScreen from "@/components/ui/EnterScreen";
import { AssetsContext } from "@/context/AssetsContext";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [ready, setReady]             = useState(false);

  useEffect(() => {
    if (ready) {
      initLenis();
      return () => destroyLenis();
    }
  }, [ready]);

  return (
    <AssetsContext.Provider value={{ notifySceneLoaded: () => setSceneLoaded(true) }}>
      {/* Cursor always on top — above EnterScreen z-[9999] */}
      <CustomCursor />

      {!ready && (
        <EnterScreen sceneLoaded={sceneLoaded} onComplete={() => setReady(true)} />
      )}

      {/* Children render immediately (hidden) so the 3D scene loads behind the gate */}
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <NoiseOverlay />
        <ProgressIndicator />
        <SoundToggle />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </AssetsContext.Provider>
  );
}
