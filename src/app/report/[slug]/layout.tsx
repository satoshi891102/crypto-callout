import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report Card",
  description:
    "Shareable report card showing an influencer's prediction accuracy, best and worst calls, and top coins.",
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
