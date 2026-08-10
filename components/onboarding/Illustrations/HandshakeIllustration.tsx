import Image from "next/image";

export function HandshakeIllustration({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/illustrations/twopeoplehandshake.png"
      alt=""
      width={220}
      height={200}
      className={className}
      priority={false}
    />
  );
}