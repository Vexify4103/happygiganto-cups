import type { Metadata } from "next";
import { LegalDocument } from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Datenschutz · HappyGiganto Community Cups",
  description: "Datenschutzerklärung für Website, Discord-Anmeldung und Turnierbewerbung der HappyGiganto Community Cups 2026.",
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
