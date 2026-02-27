import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prediction Detail",
  description:
    "View full details of a tracked crypto prediction including price chart, source, and related predictions.",
};

export default function PredictionDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
