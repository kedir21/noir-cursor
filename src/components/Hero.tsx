import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Info, CirclePlay } from "lucide-react";
import {
  certification,
  img,
  pickLogo,
  pickTrailer,
  tmdb,
  titleOf,
  typeOf,
  yearOf,
  type TmdbItem,
} from "../api/tmdb";
import { inWatchlist, toggleWatchlist } from "../lib/store";
import TrailerModal from "./TrailerModal";

export default function Hero({ items }: { items: TmdbItem[] }) {
  const [index, setIndex] = useState(0);
  const [details, setDetails] = useState<TmdbItem | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const list = items.filter((i) => i.backdrop_path).slice(0, 6);
  const current = list[index];

  useEffect(() => {
    if (!list.length) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), 8000);
    return () => clearInterval(t);
  }, [list.length]);

  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    const type = typeOf(current);
    tmdb.details(type, current.id).then((d) => {
      if (!cancelled) {
        setDetails(d);
        setSaved(inWatchlist(d.id, type));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id]);

  if (!current) return <div className="h-[88vh]" />;

  const item = details || current;
  const type = typeOf(item);
  const logo = pickLogo(item);
  const runtime = item.runtime || item.episode_run_time?.[0];
  const genres = item.genres?.slice(0, 3) || [];
  const cert = certification(item) || (type === "tv" ? "SERIES" : "FILM");

  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      <img
        key={item.id}
        src={img(item.backdrop_path, "original")}
        alt={titleOf(item)}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="hero-fade absolute inset-0" />
      <div className="hero-bottom absolute inset-x-0 bottom-0 h-56" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-12 md:pb-16">
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.35em] text-white/40 [writing-mode:vertical-rl] rotate-180">
            0{index + 1}
          </span>
          <div className="max-w-xl">
            {logo ? (
              <img
                src={logo}
                alt={titleOf(item)}
                className="mb-5 max-h-28 w-auto max-w-md object-contain drop-shadow-2xl"
              />
            ) : (
              <h1 className="mb-4 font-script text-7xl leading-none">{titleOf(item)}</h1>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-1.5 py-0.5 text-xs">
                ★ {item.vote_average?.toFixed(1)}
              </span>
              <span>{yearOf(item)}</span>
              {runtime ? <span>{runtime}m</span> : null}
              <span className="rounded-md border border-white/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                {cert}
              </span>
              {genres.map((g) => (
                <span key={g.id} className="rounded-full bg-white/8 px-2 py-0.5 text-xs">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/70 line-clamp-3">
              {item.overview}
            </p>
            <div className="flex items-center gap-2">
              <Link
                to={`/watch/${type}/${item.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black"
              >
                <Play size={16} fill="currentColor" /> Play
              </Link>
              <button
                onClick={() => setTrailer(pickTrailer(item))}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2.5 text-sm backdrop-blur"
              >
                <CirclePlay size={16} /> Trailer
              </button>
              <button
                onClick={() => {
                  const next = toggleWatchlist({
                    id: item.id,
                    type,
                    title: titleOf(item),
                    poster: item.poster_path,
                    backdrop: item.backdrop_path,
                    year: yearOf(item),
                    rating: item.vote_average,
                    addedAt: Date.now(),
                  });
                  setSaved(next.some((i) => i.id === item.id && i.type === type));
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 ${
                  saved ? "bg-white text-black" : "bg-black/30"
                }`}
                aria-label="Add to list"
              >
                <Plus size={16} />
              </button>
              <Link
                to={`/${type}/${item.id}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30"
                aria-label="More information"
              >
                <Info size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-1.5 pl-8">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-[3px] rounded-full transition-all ${
                i === index ? "w-10 bg-white" : "w-6 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
      <TrailerModal youtubeId={trailer} onClose={() => setTrailer(null)} />
    </section>
  );
}
