import { Grid2X2, FileText, Video, GraduationCap, School } from "lucide-react";

import { TopBar } from "@/components/dashboard/Topbar";
import { GreetingHeader } from "@/components/dashboard/Greetingheader";
import { CountdownCard } from "@/components/dashboard/Countdowncard";
import { FormatCard } from "@/components/dashboard/Formatcard";
import { WeakestAreaCard } from "@/components/dashboard/Weakestareacard";
import { QuickActionRow } from "@/components/dashboard/Quickactionrow";
import { ReadinessSummary } from "@/components/dashboard/Readinesssummary";
import { ActivityRow } from "@/components/dashboard/Activityrow";
import { StreakCard } from "@/components/dashboard/Streakcard";

// mock data for now...need to actually link it up to backend/data stores
const tracks = [
    { id: "med-school", label: "Medical School", icon: <GraduationCap /> },
    { id: "college-admissions", label: "College Admissions", icon: <School /> },
  ];
   
  const formats = [
    {
      icon: Grid2X2,
      title: "MMI",
      subtitle: "Multiple Mini Interview",
      score: 84,
      metrics: [
        { label: "Ethical", value: 90 },
        { label: "Role Play", value: 71, tone: "amber" as const },
        { label: "Critical", value: 79 },
      ],
      progressLabel: "38 of 114 questions",
      continueHref: "/practice/mmi",
    },
    {
      icon: FileText,
      title: "CASPer",
      subtitle: "Situational Judgment",
      score: 85,
      metrics: [
        { label: "Empathy", value: 90 },
        { label: "Profess.", value: 74, tone: "amber" as const },
        { label: "Ethics", value: 87 },
      ],
      progressLabel: "14 of 96 sections",
      continueHref: "/practice/casper",
    },
    {
      icon: Video,
      title: "PREview",
      subtitle: "Video Assessment",
      score: 84,
      metrics: [
        { label: "Empathy", value: 92 },
        { label: "Profess.", value: 73, tone: "amber" as const },
        { label: "Comm.", value: 87 },
      ],
      progressLabel: "10 of 52 scenarios",
      continueHref: "/practice/preview",
    },
  ];
   
  const quickActions = [
    { icon: Grid2X2, title: "Full MMI circuit", subtitle: "6 stations · ~48 min", href: "/practice/mmi/full" },
    { icon: FileText, title: "CASPer full mock", subtitle: "12 sections · ~60 min", href: "/practice/casper/full" },
    { icon: Video, title: "PREview mock test", subtitle: "8 scenarios · ~24 min", href: "/practice/preview/full" },
  ];
   
  const recentActivity = [
    { status: "success" as const, title: "MMI Ethical Reasoning", meta: "Q3 · Scored 90/100 · 2h ago", score: 90 },
    { status: "success" as const, title: "CASPer Full Mock Test", meta: "12 sections · Scored 85/100 · Yesterday", score: 85 },
    { status: "warning" as const, title: "MMI Role Play", meta: "Q2 · Scored 71/100 · 2 days ago", score: 71 },
    { status: "success" as const, title: "PREview Communication", meta: "Scenario 2 · Scored 84/100 · 2 days ago", score: 84 },
  ];
   
  const streakDays = [
    { label: "4", completed: false },
    { label: "5", completed: false },
    { label: "6", completed: false },
    { label: "7", completed: false },
  ];
   
  export default function Dashboard() {
    return (
      <div>
        <TopBar tracks={tracks} activeTrackId="med-school" />
   
        <div>
          <GreetingHeader name="Jamie" streakDays={3} timeOfDay="morning" />
          <CountdownCard daysRemaining={47} prepTimeUsedPercent={62} />
        </div>
   
        <div>
          <section aria-label="Your formats">
            {formats.map((format) => (
              <FormatCard key={format.title} {...format} />
            ))}
          </section>
   
          <section aria-label="Recommended next">
            <WeakestAreaCard
              eyebrow="Weakest area"
              icon={<Grid2X2 />}
              title="MMI Role Play"
              description="Your lowest station — 71/100 across 4 attempts"
              ctaLabel="Start Role Play practice"
            />
            <div>
              {quickActions.map((action) => (
                <QuickActionRow key={action.title} {...action} />
              ))}
            </div>
          </section>
   
          <section aria-label="Overall readiness">
            <ReadinessSummary
              overallScore={84}
              breakdown={[
                { label: "MMI", value: 84 },
                { label: "CASPer", value: 85 },
                { label: "PREview", value: 84 },
              ]}
            />
            <div>
              {recentActivity.map((activity) => (
                <ActivityRow key={activity.title} {...activity} />
              ))}
            </div>
            <StreakCard streakDays={3} message="Practice again today to keep it going" days={streakDays} />
          </section>
        </div>
      </div>
    );
  }
   