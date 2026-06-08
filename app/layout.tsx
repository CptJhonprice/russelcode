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
    <html lang="en" className={inter.variable}>
      <body className="bg-[#090909] text-[#e8e6e1] font-[var(--font-inter)] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
