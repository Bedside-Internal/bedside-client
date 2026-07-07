"use client"

import { UserButton } from "@clerk/nextjs";
import { InterviewSetupPanel } from "@/components/UserProfile/InterviewSection";
import { Sun, Video } from "lucide-react";
import { AppearancePanel } from "@/components/UserProfile/AppearanceSection";


export function SessionBar({ label = "" }: { label?: string }) { // TODO: logo-placement
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <UserButton>
        <UserButton.UserProfilePage label="Interview Setup" url="interview-setup" labelIcon={<Video className="h-4 w-4" />}>
          <InterviewSetupPanel onSave={async (data) => { }} />
        </UserButton.UserProfilePage>
        <UserButton.UserProfilePage label="Appearance" url="appearance" labelIcon={<Sun className="h-4 w-4" />}>
          <AppearancePanel onSave={async (data) => { }} />
        </UserButton.UserProfilePage>
      </UserButton>

    </div>
  );
}