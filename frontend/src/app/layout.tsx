import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axon gene AI v2 — Variant Interpretation Dashboard",
  description: "Real-time multi-agent genomic classification with enterprise guardrails.",
  keywords: ["genomics", "variant interpretation", "ClinVar", "ACMG", "bioinformatics", "AI", "multi-agent"],
  authors: [{ name: "Axon Gene AI" }],
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
