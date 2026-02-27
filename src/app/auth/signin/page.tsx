import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to CryptoCallout to track crypto prediction accuracy and hold influencers accountable.",
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
