import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Your CryptoCallout profile. Manage your watchlist, view your submissions, and update your settings.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
