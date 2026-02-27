"use client";

import { motion } from "framer-motion";
import { Send, Shield, Clock, CheckCircle2 } from "lucide-react";
import { SPRING_TRANSITION } from "@/lib/constants";
import { SectionHeader } from "@/components/shared/section-header";
import { PageTransition } from "@/components/shared/page-transition";
import { SubmitForm } from "@/components/submit/submit-form";
import { MOCK_COMMUNITY_SUBMISSIONS } from "@/data/mock-predictions";

const guidelines = [
  {
    icon: Shield,
    title: "Verified Sources Only",
    text: "Link to the original post, tweet, or video where the prediction was made.",
  },
  {
    icon: Clock,
    title: "Recent Predictions",
    text: "Submit predictions made within the last 30 days for timely tracking.",
  },
  {
    icon: CheckCircle2,
    title: "Manual Review",
    text: "All submissions are reviewed by our team before appearing on the tracker.",
  },
];

export default function SubmitPage() {
  const pendingCount = MOCK_COMMUNITY_SUBMISSIONS.filter(
    (s) => s.status === "pending_review"
  ).length;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          title="Submit a Prediction"
          description="Spotted an influencer making a crypto call? Submit it and help keep them accountable."
          badge={`${pendingCount} pending review`}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING_TRANSITION}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    New Submission
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Fill in the details below to submit a prediction.
                  </p>
                </div>
              </div>
              <SubmitForm />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Submission Guidelines
              </h3>
              <ul className="space-y-4">
                {guidelines.map((g, i) => {
                  const Icon = g.icon;
                  return (
                    <motion.li
                      key={g.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...SPRING_TRANSITION, delay: 0.15 + i * 0.06 }}
                      className="flex gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-elevated">
                        <Icon className="h-4 w-4 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {g.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{g.text}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Recent Submissions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Recent Community Submissions
              </h3>
              <ul className="space-y-3">
                {MOCK_COMMUNITY_SUBMISSIONS.slice(0, 4).map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-start gap-3 rounded-lg bg-elevated px-3 py-2.5"
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-foreground">
                          {sub.influencerHandle}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {sub.coinSymbol}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {sub.sourceText}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        sub.status === "approved"
                          ? "bg-status-correct-bg text-status-correct"
                          : sub.status === "rejected"
                            ? "bg-status-incorrect-bg text-status-incorrect"
                            : "bg-status-pending-bg text-status-pending"
                      }`}
                    >
                      {sub.status === "pending_review"
                        ? "Pending"
                        : sub.status === "approved"
                          ? "Approved"
                          : "Rejected"}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
