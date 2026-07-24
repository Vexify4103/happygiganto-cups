import type { Metadata } from "next";
import { LegalDocument } from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Teilnahmebedingungen · HappyGiganto Community Cups",
  description: "Teilnahmebedingungen für die HappyGiganto League of Legends und Valorant Community Cups 2026.",
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
