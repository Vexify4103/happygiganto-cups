import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:3000"),
  title: "HappyGiganto Community Cups 2026",
  description: "League of Legends am 22.08.2026 und Valorant am 01.09.2026 – zwei Community-Turniere live bei HappyGiganto.",
  icons: {
    icon: "/happygiganto-logo.png",
    apple: "/happygiganto-logo.png",
  },
  openGraph: {
    title: "HappyGiganto Community Cups 2026",
    description: "Two games. One community. Join the League of Legends and Valorant tournaments.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "HappyGiganto Community Cups 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HappyGiganto Community Cups 2026",
    description: "Two games. One community. Join the League of Legends and Valorant tournaments.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de" data-theme="dark" suppressHydrationWarning><body>{children}</body></html>;
}
