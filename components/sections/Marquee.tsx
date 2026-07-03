import { marqueeItems } from "@/lib/data";

function Track() {
  return (
    <div className="inline-flex items-center">
      {marqueeItems.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="px-[30px] text-[13px] font-bold uppercase tracking-wider text-white">
            {item}
          </span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"
              fill="#3BBA9C"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap border-t-2 border-ink bg-ink py-[15px]">
      <div className="inline-flex animate-marquee will-change-transform">
        <Track />
        <Track />
      </div>
    </div>
  );
}
