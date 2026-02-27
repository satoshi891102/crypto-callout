import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a CryptoCallout account to submit predictions, track influencers, and join the community.",
};

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
