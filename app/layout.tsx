import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RussellCode — Software built with reason.",
  description:
    "RussellCode designs and builds AI-native products, mobile apps, and scalable software systems.",
  openGraph: {
    title: "RussellCode",
    description: "Software built with reason.",
    siteName: "RussellCode",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <body className="font-[var(--font-inter)] overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--fg)" }}>
        {children}
      </body>
    </html>
  );
}
