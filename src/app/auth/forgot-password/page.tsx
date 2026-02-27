import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your CryptoCallout password. We'll send you a link to create a new one.",
};

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot-password" />;
}
