import Image from "next/image";

export function NurseIllustration({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/illustrations/nurseclipboard.png"
      alt=""
      width={220}
      height={200}
      className={className}
      priority={false}
    />
  );
}