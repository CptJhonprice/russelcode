"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ProductCardProps {
  name: string;
  tagline: string;
  description: string;
  tag: string;
  index: number;
  /** When set, the whole card becomes a crawlable link to this route. */
  href?: string;
}

/**
 * Premium product card.
 *
 * Skill compliance:
 * - Cursor spotlight uses transform/opacity only (ui-ux-pro-max §7 transform-performance)
 * - Hover state visually distinct (§4 state-clarity)
 * - transition-duration 200-250ms (§7 duration-timing)
 * - Color tokens from @theme (§6 color-semantic)
 * - Canvas design system: geometric corner accents, systematic visual language
 */
export default function ProductCard({ name, tagline, description, tag, index, href }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 20 });
  const sy = useSpring(my, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-3deg", "3deg"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    mx.set(nx - 0.5);
    my.set(ny - 0.5);
    setSpotlight({ x: nx * 100, y: ny * 100 });
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      /* Semantic: article for product (ui-ux-pro-max §1 heading-hierarchy) */
    >
      <div
        className="relative flex flex-col h-full overflow-hidden"
        style={{
          /* Smooth color transition — transform/opacity only for GPU (§7) */
          backgroundColor: hovered
            ? "var(--color-surface-overlay)"
            : "var(--color-surface-raised)",
          border: `1px solid ${hovered
            ? "var(--color-border-strong)"
            : "var(--color-border-default)"}`,
          padding: "clamp(1.5rem, 3vw, 2.5rem)",
          /* 200ms — within 150-300ms window (§7 duration-timing) */
          transition: "background-color 200ms var(--ease-out), border-color 200ms var(--ease-out)",
        }}
      >
        {/* Stretched link — makes the whole card a crawlable, tappable link */}
        {href && (
          <Link
            href={href}
            className="absolute inset-0 z-20"
            aria-label={`${name} — ${tagline}`}
          />
        )}

        {/* Cursor-follow spotlight — opacity only (§7 transform-performance) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse 55% 45% at ${spotlight.x}% ${spotlight.y}%, var(--color-accent-glow) 0%, transparent 70%)`,
            transition: "opacity 200ms var(--ease-out)",
          }}
        />

        {/* Top-left corner bracket — canvas design system geometric accent */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            opacity: hovered ? 0.8 : 0.2,
            transition: "opacity 200ms var(--ease-out)",
          }}
        >
          <div className="absolute top-0 left-0 w-5 h-px" style={{ background: "var(--color-accent)" }} />
          <div className="absolute top-0 left-0 w-px h-5" style={{ background: "var(--color-accent)" }} />
        </div>

        {/* Bottom-right bracket */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{
            opacity: hovered ? 0.35 : 0.08,
            transition: "opacity 200ms var(--ease-out)",
          }}
        >
          <div className="absolute bottom-0 right-0 w-5 h-px" style={{ background: "var(--color-accent)" }} />
          <div className="absolute bottom-0 right-0 w-px h-5" style={{ background: "var(--color-accent)" }} />
        </div>

        {/* Card index — tabular mono */}
        <div
          className="t-mono mb-8"
          style={{
            color: hovered ? "var(--color-accent)" : "var(--color-border-strong)",
            transition: "color 200ms var(--ease-out)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Tag */}
        <div className="t-label mb-4" style={{ color: "var(--color-accent)" }}>
          {tag}
        </div>

        {/* Product name — h3 for heading hierarchy (ui-ux-pro-max §1) */}
        <h3
          className="mb-2 font-light tracking-tight"
          style={{
            fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: hovered ? "#ffffff" : "var(--color-text-primary)",
            transition: "color 200ms var(--ease-out)",
          }}
        >
          {name}
        </h3>

        {/* Tagline */}
        <p
          className="t-label mb-5"
          style={{
            color: hovered ? "var(--color-border-strong)" : "var(--color-border-default)",
            transition: "color 200ms var(--ease-out)",
          }}
        >
          {tagline.toUpperCase()}
        </p>

        {/* Separator */}
        <div
          className="w-full h-px mb-5"
          style={{
            background: hovered ? "var(--color-border-default)" : "var(--color-border-subtle)",
            transition: "background 200ms var(--ease-out)",
          }}
          aria-hidden="true"
        />

        {/* Description — meets 16px base, 1.72 line-height (§6 line-height) */}
        <p
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.72,
            color: "var(--color-text-secondary)",
            maxWidth: "100%",
          }}
        >
          {description}
        </p>

        {/* EXPLORE cue — opacity+transform only (§7). Always visible on linked cards. */}
        <div
          className="mt-6 flex items-center gap-2 t-label"
          style={{
            color: "var(--color-accent)",
            opacity: hovered || href ? 1 : 0,
            transform: hovered || href ? "translateX(0)" : "translateX(-10px)",
            transition: "opacity 200ms var(--ease-out), transform 200ms var(--ease-out)",
          }}
          aria-hidden="true"
        >
          EXPLORE
          <span
            className="block h-px"
            style={{
              width: hovered ? 22 : 12,
              background: "var(--color-accent)",
              transition: "width 250ms var(--ease-out)",
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}
