import type { Metadata } from "next";
import NesivarLanding from "@/components/nesivar/NesivarLanding";
import { CONTENT } from "@/lib/nesivar-content";

const SITE = "https://www.russellcode.com";
const c = CONTENT.en;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.metaDescription,
  keywords: [
    "NesiVar?", "NesiVar", "used car", "second hand car", "car inspection", "OBD2", "OBD-II",
    "vehicle analysis", "fault diagnosis", "chronic issues", "trouble codes", "DTC",
    "ECU reader", "engine analysis", "AI car app", "pre-purchase car check",
  ],
  alternates: {
    canonical: `${SITE}/en/nesivar`,
    languages: {
      "tr-TR": `${SITE}/nesivar`,
      "en-US": `${SITE}/en/nesivar`,
      "x-default": `${SITE}/nesivar`,
    },
  },
  openGraph: {
    type: "website",
    locale: c.locale,
    url: `${SITE}/en/nesivar`,
    siteName: "RussellCode",
    title: c.metaTitle,
    description: c.metaDescription,
    images: [{ url: `${SITE}/nesivar/icon.png`, width: 512, height: 512, alt: "NesiVar?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: c.metaTitle,
    description: c.metaDescription,
    images: [`${SITE}/nesivar/icon.png`],
  },
};

export default function NesivarPageEN() {
  return <NesivarLanding lang="en" />;
}
