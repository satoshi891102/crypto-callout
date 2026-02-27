import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Prediction",
  description:
    "Submit a crypto influencer prediction to be tracked and scored by CryptoCallout. Help hold influencers accountable.",
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
