import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:3000",
  ),
  title: "HappyGiganto has moved",
  description:
    "HappyGiganto streams, community tournaments and clips now live at happygiganto.de.",
  alternates: { canonical: "https://happygiganto.de" },
  robots: { index: false, follow: true },
  icons: {
    icon: "/happygiganto-logo.png",
    apple: "/happygiganto-logo.png",
  },
  openGraph: {
    title: "HappyGiganto has moved",
    description: "Visit the new HappyGiganto home at happygiganto.de.",
    type: "website",
    images: [
      {
        url: "/og.png?v=2026-09-dates",
        width: 1200,
        height: 630,
        alt: "HappyGiganto Community Cups 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HappyGiganto has moved",
    description: "Visit the new HappyGiganto home at happygiganto.de.",
    images: ["/og.png?v=2026-09-dates"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
