// components/ui/Logo.tsx
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    theme?: "ink" | "cream";
    href?: string;
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({
    theme = "ink",
    href = "/",
    className = "",
    width = 40,
    height = 40,
}: LogoProps) {
    const textColor = theme === "cream" ? "text-cream" : "text-ink";
    const src = theme === "cream" ? "/bedside_logo_light.svg" : "/bedside_logo.svg";

    return (
        <Link
            href={href}
            className={`flex items-center gap-2 no-underline ${textColor} ${className}`}
        >
            <Image
                src={src}
                alt="Bedside"
                width={width}
                height={height}
                style={{ height: `${height}px`, width: "auto" }}
                priority
            />
            <span className="font-display text-[22px] tracking-tight">
                Bedside
            </span>
        </Link>
    );
}