"use client"

import { UserButton } from "@clerk/nextjs";
import { InterviewSetupPanel } from "@/components/UserProfile/InterviewSection";
import { Bell, Sun, Target, Video } from "lucide-react";
import { AppearancePanel } from "@/components/UserProfile/AppearanceSection";
import { NotificationsPanel } from "@/components/UserProfile/NotificationSection";
import { GoalsSchedulePanel } from "../UserProfile/GoalsAndScheduleSection";
import { TierBadge } from "@/components/ui/TierBadge";


export function SessionBar({ label = "" }: { label?: string }) { // TODO: logo-placement
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <TierBadge />
        <UserButton>
          <UserButton.UserProfilePage label="Notifications" url="notifications" labelIcon={<Bell className="h-4 w-4" />}>
            <NotificationsPanel onSave={async () => { }} />
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage label="Interview Setup" url="interview-setup" labelIcon={<Video className="h-4 w-4" />}>
            <InterviewSetupPanel onSave={async () => { }} />
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage label="Appearance" url="appearance" labelIcon={<Sun className="h-4 w-4" />}>
            <AppearancePanel onSave={async () => { }} />
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage label="Goals and Schedule" url="goals-schedule" labelIcon={<Target className="h-4 w-4" />}>
            <GoalsSchedulePanel onSave={async () => { }} />
          </UserButton.UserProfilePage>
        </UserButton>
      </div>
    </div>
  );
}