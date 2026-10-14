import type { Metadata } from "next";
import DesktopOnlyMessage from "@/components/layout/DesktopOnlyMessage";

export const metadata: Metadata = {
  title: "Best on desktop for Bedside",
};

export default function DesktopOnlyPage() {
  return <DesktopOnlyMessage />;
}