const ITEMS = [
  "AI-Native Products",
  "Mobile Applications",
  "Backend Systems",
  "Product Strategy",
  "Scalable Architecture",
  "Automation & APIs",
  "Software Built with Reason",
];

interface TickerProps {
  className?: string;
}

export default function Ticker({ className = "" }: TickerProps) {
  // Duplicate for seamless loop
  const all = [...ITEMS, ...ITEMS];

  return (
    <div
      className={`overflow-hidden w-full border-y ${className}`}
      style={{ borderColor: "var(--border-mid)" }}
      aria-hidden="true"
    >
      <div className="marquee-track py-3">
        {all.map((item, i) => (
          <span
            key={i}
            className="t-label flex-shrink-0 flex items-center gap-6 px-6"
            style={{ color: "var(--fg)" }}
          >
            {item}
            <span
              className="inline-block w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: "var(--accent)" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
