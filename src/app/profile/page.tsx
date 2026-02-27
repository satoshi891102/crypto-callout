"use client";

import { motion } from "framer-motion";
import { Star, FileText, Settings } from "lucide-react";
import { SPRING_TRANSITION } from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/page-transition";
import { UserHeader } from "@/components/profile/user-header";
import { WatchlistTab } from "@/components/profile/watchlist-tab";
import { SubmissionsTab } from "@/components/profile/submissions-tab";
import { SettingsTab } from "@/components/profile/settings-tab";
import { MOCK_CURRENT_USER } from "@/data/mock-users";

export default function ProfilePage() {
  const user = MOCK_CURRENT_USER;

  return (
    <PageTransition>
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <UserHeader user={user} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
      >
        <Tabs defaultValue="watchlist" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="watchlist" className="gap-1.5">
              <Star size={14} />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-1.5">
              <FileText size={14} />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5">
              <Settings size={14} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist">
            <WatchlistTab user={user} />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTab user={user} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab user={user} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
    </PageTransition>
  );
}
