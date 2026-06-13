// Server component. Renders the full NesiVar GEO landing page for one language.
// Pure SSR, semantic HTML, plus JSON-LD (MobileApplication + Organization +
// FAQPage + Breadcrumb) so AI engines and crawlers can read the content.
import Link from "next/link";
import { CONTENT, NESIVAR, type Lang } from "@/lib/nesivar-content";

const SITE = "https://www.russellcode.com";

// App screenshots. Drop the image files into /public/nesivar/ with these names.
const SHOTS: { file: string; alt: Record<Lang, string> }[] = [
  {
    file: "/nesivar/shot-1.png",
    alt: {
      tr: "Satın alma öncesi: bilinen sorunlar, satıcıya sorular ve kontrol rehberi.",
      en: "Before you buy: known issues, questions for the seller, and an inspection guide.",
    },
  },
  {
    file: "/nesivar/shot-3.png",
    alt: {
      tr: "OBD tarama, araç değerlendirme ve kronik sorun veritabanı.",
      en: "OBD scan, vehicle assessment and chronic-issue database.",
    },
  },
  {
    file: "/nesivar/shot-2.png",
    alt: {
      tr: "OBD ile anlık tarama ve canlı motor verileri.",
      en: "Live OBD scanning and real-time engine data.",
    },
  },
];

function pagePath(lang: Lang) {
  return lang === "tr" ? "/nesivar" : "/en/nesivar";
}

function jsonLd(lang: Lang) {
  const c = CONTENT[lang];
  const url = `${SITE}${pagePath(lang)}`;

  const app = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "NesiVar",
    alternateName: "NesiVar AI Analysis",
    operatingSystem: NESIVAR.operatingSystem,
    applicationCategory: "UtilitiesApplication",
    description: c.metaDescription,
    url,
    image: `${SITE}/nesivar/icon.png`,
    screenshot: SHOTS.map((s) => `${SITE}${s.file}`),
    downloadUrl: NESIVAR.appStoreUrl,
    installUrl: NESIVAR.appStoreUrl,
    inLanguage: lang,
    offers: {
      "@type": "Offer",
      price: NESIVAR.price,
      priceCurrency: NESIVAR.priceCurrency,
      category: "Free download with in-app purchases",
    },
    author: {
      "@type": "Organization",
      name: NESIVAR.developer,
      url: NESIVAR.developerUrl,
    },
    publisher: {
      "@type": "Organization",
      name: NESIVAR.developer,
      url: NESIVAR.developerUrl,
    },
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RussellCode",
    url: SITE,
    description:
      lang === "tr"
        ? "Yapay zekâ odaklı ürünler, mobil uygulamalar ve ölçeklenebilir yazılım sistemleri geliştiren yazılım stüdyosu."
        : "A software studio building AI-native products, mobile apps and scalable software systems.",
    makesOffer: {
      "@type": "Offer",
      itemOffered: { "@type": "MobileApplication", name: "NesiVar", url },
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "RussellCode", item: SITE },
      { "@type": "ListItem", position: 2, name: "NesiVar", item: url },
    ],
  };

  return [app, org, faq, breadcrumb];
}

export default function NesivarLanding({ lang }: { lang: Lang }) {
  const c = CONTENT[lang];
  const blocks = jsonLd(lang);

  return (
    <main
      className="nv-scope"
      style={{
        cursor: "auto",
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100dvh",
      }}
    >
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}

      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "clamp(2.5rem, 6vw, 5rem) 1.25rem 5rem" }}>
        {/* ── Hero ───────────────────────────────────────────── */}
        <header>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nesivar/icon.png"
            alt="NesiVar uygulama simgesi"
            width={72}
            height={72}
            style={{ width: 72, height: 72, borderRadius: "1rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px var(--accent-glow)" }}
          />
          <p
            className="t-label"
            style={{ color: "var(--accent)", letterSpacing: "0.18em", marginBottom: "1rem" }}
          >
            {c.tagline}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              lineHeight: 1.05,
              margin: "0 0 1.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            {c.h1}
          </h1>
          <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "var(--fg-sub)", maxWidth: "60ch", lineHeight: 1.6 }}>
            {c.heroLead}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "2rem", alignItems: "center" }}>
            <a
              href={NESIVAR.appStoreUrl}
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.4rem",
                borderRadius: "0.7rem",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {c.ctaStore} →
            </a>
            <Link
              href="/"
              style={{ color: "var(--fg-sub)", textDecoration: "none", fontSize: "0.9rem" }}
            >
              {c.ctaStudio}
            </Link>
          </div>
        </header>

        {/* ── Screenshots ────────────────────────────────────── */}
        <section style={{ marginTop: "clamp(2.5rem, 5vw, 3.5rem)" }} aria-label={lang === "tr" ? "Ekran görüntüleri" : "Screenshots"}>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {SHOTS.map((s, i) => (
              <figure key={i} style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.file}
                  alt={s.alt[lang]}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "0.9rem",
                    border: "1px solid var(--border-mid)",
                    background: "var(--bg-raised)",
                    display: "block",
                  }}
                />
                <figcaption style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--fg-sub)", lineHeight: 1.45 }}>
                  {s.alt[lang]}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── What is it ─────────────────────────────────────── */}
        <Section title={c.whatTitle}>
          <p style={pStyle}>{c.whatBody}</p>
        </Section>

        {/* ── How it works ───────────────────────────────────── */}
        <Section title={c.howTitle}>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
            {c.steps.map((s, i) => (
              <li key={i} style={cardStyle}>
                <span style={stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong style={{ display: "block", marginBottom: "0.25rem" }}>{s.title}</strong>
                  <span style={{ color: "var(--fg-sub)" }}>{s.body}</span>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── Features ───────────────────────────────────────── */}
        <Section title={c.givesTitle}>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {c.features.map((f, i) => (
              <div key={i} style={cardStyle}>
                <strong style={{ display: "block", marginBottom: "0.35rem" }}>{f.title}</strong>
                <span style={{ color: "var(--fg-sub)" }}>{f.body}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── No adapter ─────────────────────────────────────── */}
        <Section title={c.noAdapterTitle}>
          <p style={pStyle}>{c.noAdapterBody}</p>
        </Section>

        {/* ── Who is it for ──────────────────────────────────── */}
        <Section title={c.whoTitle}>
          <ul style={listStyle}>
            {c.who.map((w, i) => (
              <li key={i} style={liStyle}>{w}</li>
            ))}
          </ul>
        </Section>

        {/* ── Why NesiVar ────────────────────────────────────── */}
        <Section title={c.whyTitle}>
          <ul style={listStyle}>
            {c.why.map((w, i) => (
              <li key={i} style={liStyle}>{w}</li>
            ))}
          </ul>
        </Section>

        {/* ── Requirements ───────────────────────────────────── */}
        <Section title={c.reqTitle}>
          <ul style={listStyle}>
            {c.requirements.map((r, i) => (
              <li key={i} style={liStyle}>{r}</li>
            ))}
          </ul>
        </Section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <Section title={c.faqTitle}>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {c.faq.map((f, i) => (
              <details key={i} style={{ ...cardStyle, display: "block" }}>
                <summary style={{ fontWeight: 600, cursor: "pointer", listStyle: "revert" }}>{f.q}</summary>
                <p style={{ ...pStyle, marginTop: "0.6rem", marginBottom: 0 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ── Disclaimer ─────────────────────────────────────── */}
        <Section title={c.disclaimerTitle}>
          <p style={{ ...pStyle, fontSize: "0.9rem", color: "var(--fg-sub)" }}>{c.disclaimerBody}</p>
        </Section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer style={{ marginTop: "3.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-mid)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.85rem", color: "var(--fg-sub)" }}>
          <span>{c.footerNote}</span>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>{c.backToStudio}</Link>
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
      <h2
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
          fontWeight: 600,
          margin: "0 0 1.1rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const pStyle: React.CSSProperties = {
  fontSize: "clamp(0.95rem, 1.3vw, 1.08rem)",
  lineHeight: 1.7,
  color: "var(--fg)",
  maxWidth: "68ch",
  margin: 0,
};

const cardStyle: React.CSSProperties = {
  background: "var(--bg-raised)",
  border: "1px solid var(--border-mid)",
  borderRadius: "0.8rem",
  padding: "1.1rem 1.25rem",
  display: "flex",
  gap: "0.9rem",
  alignItems: "flex-start",
  lineHeight: 1.55,
};

const stepNum: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.85rem",
  color: "var(--accent)",
  fontWeight: 700,
  flexShrink: 0,
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1.2rem",
  display: "grid",
  gap: "0.6rem",
  maxWidth: "68ch",
};

const liStyle: React.CSSProperties = {
  lineHeight: 1.6,
  color: "var(--fg)",
};
