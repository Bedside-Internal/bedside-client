"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

interface DemoVideoProps {
    youtubeId: string; // YT video ID 
}

export default function DemoVideo({ youtubeId }: DemoVideoProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const embedSrc = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    const thumbnailSrc = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

    return (
        <section className="bg-cream px-[5vw] py-[100px]">
            <div className="mx-auto max-w-[1160px] text-center">
                <RevealOnScroll className="mb-10">
                    <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
                            See it in action
                        </span>
                    </div>
                    <h2 className="mx-auto font-display text-[clamp(38px,5vw,64px)] leading-none tracking-tighter text-ink">
                        Watch a full mock interview.
                    </h2>
                </RevealOnScroll>

                <RevealOnScroll delay="d1">
                    <div className="relative mx-auto max-w-[1000px] overflow-hidden rounded-[10px] border-[2.5px] border-ink bg-ink shadow-hard">
                        <div className="relative aspect-video w-full">
                            {isPlaying ? (
                                <iframe
                                    src={embedSrc}
                                    title="Bedside mock interview demo"
                                    className="absolute inset-0 h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsPlaying(true)}
                                    aria-label="Play the mock interview demo"
                                    className="group absolute inset-0 flex items-center justify-center"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={thumbnailSrc}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-ink/25 transition group-hover:bg-ink/40" />
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-mint text-white shadow-hard-sm transition-transform duration-150 group-hover:scale-105">
                                        <Play className="ml-1 h-7 w-7" fill="currentColor" strokeWidth={0} />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </RevealOnScroll>
            </div>
        </section>
    );
}