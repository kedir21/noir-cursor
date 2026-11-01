import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TmdbItem } from "../api/tmdb";
import MediaCard from "./MediaCard";

export default function MediaRow({
  kicker,
  title,
  items,
  kind = "poster",
}: {
  kicker?: string;
  title: string;
  items: TmdbItem[];
  kind?: "poster" | "backdrop";
}) {
  const ref = useRef<HTMLDivElement>(null);
  if (!items?.length) return null;

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 640, behavior: "smooth" });
  };

  return (
    <section className="relative px-5 md:px-10">
      {kicker && (
        <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
          <span className="inline-block h-3 w-px bg-white/70" />
          {kicker}
        </p>
      )}
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="group/row relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <div ref={ref} className="row-scroll flex gap-3 pb-2">
          {items.map((item) => (
            <MediaCard key={`${item.id}-${item.media_type || title}`} item={item} kind={kind} />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
