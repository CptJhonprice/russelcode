import type { Metadata } from "next";
import NesivarLanding from "@/components/nesivar/NesivarLanding";
import { CONTENT } from "@/lib/nesivar-content";

const SITE = "https://www.russellcode.com";
const c = CONTENT.tr;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.metaDescription,
  keywords: [
    "NesiVar?", "NesiVar", "ikinci el araç", "2. el araç", "oto ekspertiz", "OBD2", "OBD-II",
    "araç analiz", "arıza tespit", "kronik sorun", "hata kodu", "DTC", "ECU okuma",
    "motor analiz", "yapay zeka araç", "araç kontrol", "satın almadan önce",
  ],
  alternates: {
    canonical: `${SITE}/nesivar`,
    languages: {
      "tr-TR": `${SITE}/nesivar`,
      "en-US": `${SITE}/en/nesivar`,
      "x-default": `${SITE}/nesivar`,
    },
  },
  openGraph: {
    type: "website",
    locale: c.locale,
    url: `${SITE}/nesivar`,
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

export default function NesivarPageTR() {
  return <NesivarLanding lang="tr" />;
}
