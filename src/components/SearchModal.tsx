import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { img, tmdb, titleOf, typeOf, yearOf, type TmdbItem } from "../api/tmdb";

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "anime">("all");
  const [results, setResults] = useState<TmdbItem[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const data = await tmdb.search(q.trim());
      setResults(
        data.results.filter((r) => r.media_type === "movie" || r.media_type === "tv")
      );
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const filtered = useMemo(() => {
    if (tab === "anime") {
      return results.filter(
        (r) => r.original_language === "ja" || r.genre_ids?.includes(16)
      );
    }
    return results;
  }, [results, tab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 pt-24 backdrop-blur-md">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#161616]/95 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
          <Search size={16} className="text-white/40" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies, TV shows…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
          />
          <button
            onClick={onClose}
            className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] tracking-widest text-white/50"
          >
            ESC
          </button>
        </div>
        <div className="flex gap-2 px-4 py-3">
          {(["all", "anime"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 text-xs ${
                tab === t ? "bg-white text-black" : "bg-white/8 text-white/70"
              }`}
            >
              {t === "all" ? "Movies & TV" : "Anime"}
            </button>
          ))}
        </div>
        <div className="max-h-[420px] overflow-y-auto px-2 pb-3">
          {!q && (
            <div className="flex flex-col items-center py-16 text-white/40">
              <Search size={28} className="mb-3" />
              <p className="text-sm">Start typing to search</p>
            </div>
          )}
          {q && filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-white/40">No results</p>
          )}
          {filtered.map((item) => (
            <button
              key={`${typeOf(item)}-${item.id}`}
              onClick={() => {
                onClose();
                nav(`/${typeOf(item)}/${item.id}`);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/6"
            >
              <img
                src={img(item.poster_path, "w92")}
                alt=""
                className="h-14 w-10 rounded-md object-cover bg-white/5"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{titleOf(item)}</p>
                <p className="text-xs text-white/40">
                  {typeOf(item) === "tv" ? "Series" : "Film"} · {yearOf(item)}
                </p>
              </div>
              <span className="ml-auto text-xs text-white/35">
                {item.vote_average ? item.vote_average.toFixed(1) : ""}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-3 border-t border-white/8 px-4 py-2 text-[10px] uppercase tracking-wider text-white/30">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
      <button className="absolute inset-0 -z-10" onClick={onClose} aria-label="Close" />
      <X className="hidden" />
    </div>
  );
}
