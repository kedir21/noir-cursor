import { Link } from "react-router-dom";
import { img } from "../api/tmdb";
import { getContinue, type SavedItem } from "../lib/store";
import { useEffect, useState } from "react";

export default function ContinueRow() {
  const [items, setItems] = useState<SavedItem[]>([]);
  useEffect(() => setItems(getContinue()), []);
  if (!items.length) return null;

  return (
    <section className="px-5 md:px-10">
      <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
        <span className="inline-block h-3 w-px bg-white/70" />
        Pick up where you left off
      </p>
      <h2 className="mb-1 font-display text-2xl font-semibold">Continue Watching</h2>
      <p className="mb-4 text-xs text-white/40">{items.length} in progress</p>
      <div className="row-scroll flex gap-4">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={
              item.type === "tv"
                ? `/watch/tv/${item.id}?s=${item.season || 1}&e=${item.episode || 1}`
                : `/watch/movie/${item.id}`
            }
            className="w-[260px] shrink-0"
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={img(item.backdrop || item.poster, "w780")}
                alt={item.title}
                className="aspect-video w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] uppercase">
                {item.type}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
                <div className="h-full bg-white" style={{ width: `${item.progress || 12}%` }} />
              </div>
            </div>
            <p className="mt-2 truncate text-sm">{item.title}</p>
            <p className="text-xs text-white/40">
              {item.type === "tv" ? `S${item.season || 1} E${item.episode || 1}` : "Movie"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
