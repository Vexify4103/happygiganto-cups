import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discord Account | HappyGiganto Community Cups",
  description: "Your Discord account for the HappyGiganto Community Cups.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
