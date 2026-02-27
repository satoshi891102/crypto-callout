"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, User, Save, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_TRANSITION } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DEFAULT_NOTIFICATION_PREFS,
  type NotificationPreferences,
  type UserProfile,
} from "@/data/mock-users";

/* ── Toggle Switch ── */

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        enabled ? "bg-accent-brand" : "bg-secondary"
      )}
    >
      <motion.span
        layout
        transition={SPRING_TRANSITION}
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ── Notification Row ── */

function NotificationRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

/* ── Main Component ── */

interface SettingsTabProps {
  user: UserProfile;
  className?: string;
}

export function SettingsTab({ user, className }: SettingsTabProps) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [showSaved, setShowSaved] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFS
  );

  function toggleNotification(key: keyof NotificationPreferences) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={SPRING_TRANSITION}
      className={cn("space-y-8", className)}
    >
      {/* ── Profile Section ── */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <User size={16} />
          Profile
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="username" className="text-xs font-medium text-text-secondary">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary">Role</label>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium capitalize text-text-secondary">
              <Lock size={11} className="mr-1.5" />
              {user.role}
            </span>
            <span className="text-[11px] text-text-muted">Role is managed by administrators</span>
          </div>
        </div>
      </div>

      {/* ── Notification Preferences ── */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Bell size={16} />
          Notifications
        </div>
        <p className="text-xs text-text-muted">Choose what updates you receive.</p>

        <div className="divide-y divide-border pt-2">
          <NotificationRow
            label="New Predictions"
            description="Get notified when watched influencers make new calls."
            enabled={notifications.newPredictions}
            onToggle={() => toggleNotification("newPredictions")}
          />
          <NotificationRow
            label="Resolutions"
            description="Get notified when tracked predictions are resolved."
            enabled={notifications.resolutions}
            onToggle={() => toggleNotification("resolutions")}
          />
          <NotificationRow
            label="Streak Alerts"
            description="Get notified about hot streaks and cold streaks."
            enabled={notifications.streakAlerts}
            onToggle={() => toggleNotification("streakAlerts")}
          />
          <NotificationRow
            label="Weekly Digest"
            description="Summary of top predictions and leaderboard changes."
            enabled={notifications.weeklyDigest}
            onToggle={() => toggleNotification("weeklyDigest")}
          />
        </div>
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>
          <Save size={14} />
          Save Changes
        </Button>

        <AnimatedSaveConfirmation show={showSaved} />
      </div>
    </motion.div>
  );
}

/* ── Save confirmation ── */

function AnimatedSaveConfirmation({ show }: { show: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
      transition={SPRING_TRANSITION}
      className="text-sm font-medium text-status-correct"
    >
      Settings saved!
    </motion.span>
  );
}
