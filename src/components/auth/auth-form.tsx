"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleButton } from "@/components/auth/google-button";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION, FADE_IN, APP_NAME } from "@/lib/constants";

/* ── Schemas ── */

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be 24 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

/* ── Types ── */

export type AuthMode = "signin" | "signup" | "forgot-password";

interface AuthFormProps {
  mode: AuthMode;
}

/* ── Animation variants ── */

const formVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_TRANSITION, staggerChildren: 0.05 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: SPRING_TRANSITION },
};

/* ── Component ── */

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "alpha@example.com", password: "Password1" },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const forgotForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const isLoading =
    signInForm.formState.isSubmitting ||
    signUpForm.formState.isSubmitting ||
    forgotForm.formState.isSubmitting;

  async function onSignIn(_data: SignInData) {
    await login();
    router.push("/");
  }

  async function onSignUp(_data: SignUpData) {
    await login();
    router.push("/");
  }

  async function onForgotPassword(_data: ForgotPasswordData) {
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  }

  const title = {
    signin: "Welcome back",
    signup: "Create your account",
    "forgot-password": "Reset your password",
  }[mode];

  const subtitle = {
    signin: "Sign in to track predictions and hold influencers accountable.",
    signup: "Join the community scoring crypto influencer accuracy.",
    "forgot-password": "Enter your email and we'll send a reset link.",
  }[mode];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_TRANSITION}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-primary-foreground"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>
          <motion.h1
            {...FADE_IN}
            className="mt-4 text-2xl font-bold tracking-tight text-foreground"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={FADE_IN.initial}
            animate={FADE_IN.animate}
            transition={{ ...SPRING_TRANSITION, delay: 0.05 }}
            className="mt-2 text-sm text-text-secondary"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/20">
          <AnimatePresence mode="wait">
            {/* ── Sign In ── */}
            {mode === "signin" && (
              <motion.form
                key="signin"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-4"
              >
                <GoogleButton />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-text-muted">or continue with email</span>
                  </div>
                </div>

                <motion.div variants={fieldVariants}>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 pl-10"
                      {...signInForm.register("email")}
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">Password</label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-primary hover:text-accent-brand-hover transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 pl-10 pr-10"
                      {...signInForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-destructive">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full gap-2 text-sm font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.p variants={fieldVariants} className="text-center text-sm text-text-secondary">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-primary hover:text-accent-brand-hover transition-colors"
                  >
                    Sign up
                  </Link>
                </motion.p>
              </motion.form>
            )}

            {/* ── Sign Up ── */}
            {mode === "signup" && (
              <motion.form
                key="signup"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={signUpForm.handleSubmit(onSignUp)}
                className="space-y-4"
              >
                <GoogleButton label="Sign up with Google" />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-text-muted">or continue with email</span>
                  </div>
                </div>

                <motion.div variants={fieldVariants}>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <Input
                      type="text"
                      placeholder="alpha_hunter"
                      className="h-11 pl-10"
                      {...signUpForm.register("username")}
                    />
                  </div>
                  {signUpForm.formState.errors.username && (
                    <p className="mt-1 text-xs text-destructive">
                      {signUpForm.formState.errors.username.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 pl-10"
                      {...signUpForm.register("email")}
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      className="h-11 pl-10 pr-10"
                      {...signUpForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-destructive">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                  <PasswordStrength password={signUpForm.watch("password")} />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="h-11 pl-10 pr-10"
                      {...signUpForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-destructive">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fieldVariants} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full gap-2 text-sm font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.p variants={fieldVariants} className="text-center text-sm text-text-secondary">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-primary hover:text-accent-brand-hover transition-colors"
                  >
                    Sign in
                  </Link>
                </motion.p>
              </motion.form>
            )}

            {/* ── Forgot Password ── */}
            {mode === "forgot-password" && (
              <motion.div
                key="forgot"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="forgot-form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={SPRING_TRANSITION}
                      onSubmit={forgotForm.handleSubmit(onForgotPassword)}
                      className="space-y-4"
                    >
                      <motion.div variants={fieldVariants}>
                        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 pl-10"
                            {...forgotForm.register("email")}
                          />
                        </div>
                        {forgotForm.formState.errors.email && (
                          <p className="mt-1 text-xs text-destructive">
                            {forgotForm.formState.errors.email.message}
                          </p>
                        )}
                      </motion.div>

                      <motion.div variants={fieldVariants} className="pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="h-11 w-full gap-2 text-sm font-semibold"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Send reset link
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <motion.p
                        variants={fieldVariants}
                        className="text-center text-sm text-text-secondary"
                      >
                        Remember your password?{" "}
                        <Link
                          href="/auth/signin"
                          className="font-medium text-primary hover:text-accent-brand-hover transition-colors"
                        >
                          Sign in
                        </Link>
                      </motion.p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="forgot-success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={SPRING_TRANSITION}
                      className="py-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-status-correct-bg"
                      >
                        <Mail className="h-6 w-6 text-status-correct" />
                      </motion.div>
                      <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
                      <p className="mt-2 text-sm text-text-secondary">
                        We sent a password reset link to{" "}
                        <span className="font-medium text-foreground">
                          {forgotForm.getValues("email")}
                        </span>
                      </p>
                      <div className="mt-6 space-y-3">
                        <Button
                          variant="outline"
                          className="h-11 w-full"
                          onClick={() => setSubmitted(false)}
                        >
                          Try a different email
                        </Button>
                        <Link href="/auth/signin" className="block">
                          <Button variant="ghost" className="h-11 w-full text-primary">
                            Back to sign in
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer legal text */}
        {mode !== "forgot-password" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-xs text-text-muted"
          >
            By continuing, you agree to CryptoCallout&apos;s{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-text-secondary transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-text-secondary transition-colors">
              Privacy Policy
            </span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

/* ── Password Strength Indicator ── */

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.met).length;

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={SPRING_TRANSITION}
      className="mt-2 space-y-2"
    >
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              level <= strength
                ? strength === 1
                  ? "bg-destructive"
                  : strength === 2
                    ? "bg-warning"
                    : "bg-status-correct"
                : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Check items */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map((check) => (
          <span
            key={check.label}
            className={cn(
              "text-xs transition-colors",
              check.met ? "text-status-correct" : "text-text-muted"
            )}
          >
            {check.met ? "\u2713" : "\u2022"} {check.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
