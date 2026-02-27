import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Influencers",
  description:
    "Browse and discover crypto influencers tracked by CryptoCallout. Filter by platform, accuracy tier, and more.",
};

export default function InfluencersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
