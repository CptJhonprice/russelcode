import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function initLenis(): Lenis {
  // Guard against double-init (route changes, dev HMR): tear down any prior loop first
  destroyLenis();

  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });

  // Keep GSAP ScrollTrigger in sync with Lenis scroll position
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis via GSAP ticker so both share the same RAF loop.
  // Keep a reference so we can remove it on destroy — otherwise the ticker keeps
  // firing after Lenis is gone and calls .raf() on null (crash on navigation).
  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  lenis?.destroy();
  lenis = null;
}
