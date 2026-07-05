import Image from "next/image";

export function ChecklistIllustration({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/illustrations/checklist.png"
      alt=""
      width={220}
      height={220}
      className={className}
      priority={false}
    />
  );
}