import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How CryptoCallout tracks, scores, and ranks crypto influencer predictions. Transparent scoring, resolution rules, and tier system.",
};

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
