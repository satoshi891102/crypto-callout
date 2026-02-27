import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CryptoCallout — Track Crypto Prediction Accuracy",
    template: "%s | CryptoCallout",
  },
  description:
    "AI tracks every public crypto prediction from influencers and scores accuracy. See who actually knows what they're talking about.",
  keywords: [
    "crypto",
    "predictions",
    "influencers",
    "accuracy",
    "leaderboard",
    "accountability",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://cryptocallout.com"
  ),
  openGraph: {
    type: "website",
    siteName: "CryptoCallout",
    title: "CryptoCallout — Track Crypto Prediction Accuracy",
    description:
      "AI tracks every public crypto prediction from influencers and scores accuracy. See who actually knows what they're talking about.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoCallout — Track Crypto Prediction Accuracy",
    description:
      "AI tracks every public crypto prediction from influencers and scores accuracy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
