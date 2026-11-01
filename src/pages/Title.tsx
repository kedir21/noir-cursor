import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Play, Plus, Star } from "lucide-react";
import {
  certification,
  img,
  pickLogo,
  pickTrailer,
  tmdb,
  titleOf,
  yearOf,
  type MediaType,
  type TmdbItem,
} from "../api/tmdb";
import MediaRow from "../components/MediaRow";
import TrailerModal from "../components/TrailerModal";
import Footer from "../components/Footer";
import { inWatchlist, toggleWatchlist } from "../lib/store";

export default function Title() {
  const { id = "" } = useParams();
  const location = useLocation();
  const media = (location.pathname.startsWith("/tv/") ? "tv" : "movie") as MediaType;
  const [item, setItem] = useState<TmdbItem | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    tmdb.details(media, id).then((d) => {
      setItem(d);
      setSaved(inWatchlist(d.id, media));
    });
    window.scrollTo(0, 0);
  }, [media, id]);

  if (!item) {
    return <div className="flex h-screen items-center justify-center text-white/40">Loading…</div>;
  }

  const logo = pickLogo(item);
  const runtime = item.runtime || item.episode_run_time?.[0];
  const similar = item.recommendations?.results?.length
    ? item.recommendations.results
    : item.similar?.results || [];

  return (
    <div>
      <div className="relative min-h-[70vh]">
        <img
          src={img(item.backdrop_path, "original")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
        <div className="relative z-10 flex min-h-[70vh] flex-col justify-end px-6 pb-12 pt-28 md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <img
              src={img(item.poster_path, "w342")}
              alt={titleOf(item)}
              className="hidden w-44 rounded-xl poster-shadow md:block"
            />
            <div className="max-w-2xl">
              {logo ? (
                <img src={logo} alt={titleOf(item)} className="mb-4 max-h-24 object-contain" />
              ) : (
                <h1 className="mb-3 font-display text-5xl font-bold">{titleOf(item)}</h1>
              )}
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1">
                  <Star size={14} /> {item.vote_average?.toFixed(1)}
                </span>
                <span>{yearOf(item)}</span>
                {runtime ? <span>{runtime}m</span> : null}
                <span className="rounded border border-white/20 px-1.5 text-[10px] uppercase">
                  {certification(item) || (media === "tv" ? "SERIES" : "FILM")}
                </span>
                {item.genres?.map((g) => (
                  <span key={g.id} className="rounded-full bg-white/8 px-2 py-0.5 text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
              <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/70">{item.overview}</p>
              <div className="flex gap-2">
                <Link
                  to={`/watch/${media}/${item.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black"
                >
                  <Play size={16} fill="currentColor" /> Play
                </Link>
                <button
                  onClick={() => setTrailer(pickTrailer(item))}
                  className="rounded-full border border-white/20 px-4 py-2.5 text-sm"
                >
                  Trailer
                </button>
                <button
                  onClick={() => {
                    const next = toggleWatchlist({
                      id: item.id,
                      type: media,
                      title: titleOf(item),
                      poster: item.poster_path,
                      backdrop: item.backdrop_path,
                      year: yearOf(item),
                      rating: item.vote_average,
                      addedAt: Date.now(),
                    });
                    setSaved(next.some((i) => i.id === item.id && i.type === media));
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 ${
                    saved ? "bg-white text-black" : ""
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {item.credits?.cast?.length ? (
        <section className="px-5 py-10 md:px-12">
          <h2 className="mb-4 font-display text-2xl font-semibold">Cast</h2>
          <div className="row-scroll flex gap-4">
            {item.credits.cast.slice(0, 16).map((p) => (
              <div key={p.id} className="w-28 shrink-0">
                <div className="mb-2 aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
                  {p.profile_path && (
                    <img src={img(p.profile_path, "w185")} alt={p.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <p className="truncate text-sm">{p.name}</p>
                <p className="truncate text-xs text-white/40">{p.character}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="pb-8">
        <MediaRow title="More like this" items={similar} />
      </div>
      <Footer />
      <TrailerModal youtubeId={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
