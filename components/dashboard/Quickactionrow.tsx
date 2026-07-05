import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface QuickActionRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
}

export function QuickActionRow({ icon: Icon, title, subtitle, href }: QuickActionRowProps) {
  return (
    <Link href={href}>
      <div>
        <Icon />
      </div>
      <div>
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <ChevronRight />
    </Link>
  );
}