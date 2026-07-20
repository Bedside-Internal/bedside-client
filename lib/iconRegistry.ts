import {
  Stethoscope,
  GraduationCap,
  Users,
  ClipboardList,
  Grid2x2,
  Monitor,
  Video,
  HelpCircle,
  type LucideIcon,
  CheckCircle2,
  MessageSquare,
  GitFork,
  Share2,
  User,
  Heart,
  TrendingUp
} from "lucide-react";

/**
 * lib/iconRegistry.ts
 *
 * Feature docs in Mongo store an `icon` string key (e.g. "stethoscope"),
 * not a component — React components can't be serialized into the
 * database. This registry is the single place that maps those keys to
 * actual Lucide icon components.
 *
 * Adding a new icon to an onboarding track/format means: (1) add the
 * Lucide import here, (2) add its key here, (3) use that key in the
 * feature doc. The set of available icons stays finite and code-defined;
 * which icon a given feature uses is what's data-driven.
 */
export const iconRegistry: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  "graduation-cap": GraduationCap,
  users: Users,
  "clipboard-list": ClipboardList,
  "grid-2x2": Grid2x2,
  monitor: Monitor,
  video: Video,
  "help-circle": HelpCircle,
  "check-circle-2": CheckCircle2,
  "message-square": MessageSquare,
  "git-fork": GitFork,
  "share-2": Share2,
  "user": User,
  heart: Heart, 
  "trending-up": TrendingUp
};

/**
 * Resolves an icon key to a component, falling back to a generic icon
 * rather than crashing the page if a feature doc references a key that
 * hasn't been added to the registry yet (e.g. someone created a new
 * feature in Mongo before shipping the matching frontend icon import).
 */
export function resolveIcon(key: string): LucideIcon {
  return iconRegistry[key] ?? HelpCircle;
}