interface SectionLabelProps {
  index: string;
  title: string;
  className?: string;
}

/**
 * Technical section label: //01 | INTRO
 * Uses semantic color tokens from @theme.
 * aria-hidden — decorative; sections carry their own aria-label.
 */
export default function SectionLabel({ index, title, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="t-label" style={{ color: "var(--color-accent)" }}>
        {index}
      </span>
      <span
        className="t-label"
        style={{
          color: "var(--color-border-strong)",
          borderLeft: "1px solid var(--color-border-default)",
          paddingLeft: "0.75rem",
        }}
      >
        {title}
      </span>
    </div>
  );
}
