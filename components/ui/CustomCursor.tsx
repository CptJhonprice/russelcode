"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows exactly
      gsap.set(dot, { x: mouseX, y: mouseY });
      // Ring follows with spring lag
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.55, ease: "power3.out" });
    }

    function onEnterLink() {
      gsap.to(ring, { scale: 2.4, opacity: 0.6, duration: 0.25, ease: "power2.out" });
      gsap.to(dot,  { scale: 0,   opacity: 0,   duration: 0.2 });
    }

    function onLeaveLink() {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, opacity: 1, duration: 0.2 });
    }

    window.addEventListener("mousemove", onMove);

    // Scale up on interactive elements
    const targets = document.querySelectorAll("a, button, [role='button'], [data-cursor-expand]");
    targets.forEach(el => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      targets.forEach(el => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <div className="cursor-dot-inner" />
      </div>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <div className="cursor-ring-inner" />
      </div>
    </>
  );
}
