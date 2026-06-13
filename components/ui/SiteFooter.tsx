export default function SiteFooter() {
  return (
    <footer
      className="relative z-10 px-5 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--color-border-subtle)" }}
    >
      <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>RUSSELLCODE</span>
      <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>© {new Date().getFullYear()} — ALL RIGHTS RESERVED</span>
      <span className="t-label" style={{ color: "var(--color-text-ghost)" }}>SOFTWARE BUILT WITH REASON.</span>
    </footer>
  );
}
