import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  buildPlayerUrl,
  img,
  PLAYER_PROVIDERS,
  tmdb,
  titleOf,
  yearOf,
  type MediaType,
  type PlayerProviderId,
  type TmdbEpisode,
  type TmdbItem,
} from "../api/tmdb";
import { getPlayerProvider, saveContinue, saveHistory, setPlayerProvider } from "../lib/store";

export default function Watch() {
  const { type = "movie", id = "" } = useParams();
  const media = (type === "tv" ? "tv" : "movie") as MediaType;
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const season = Number(params.get("s") || 1);
  const episode = Number(params.get("e") || 1);
  const [item, setItem] = useState<TmdbItem | null>(null);
  const [episodes, setEpisodes] = useState<TmdbEpisode[]>([]);
  const [openSeasons, setOpenSeasons] = useState(true);
  const [playerProvider, setPlayerProviderState] = useState<PlayerProviderId>(getPlayerProvider);

  const src = useMemo(
    () => buildPlayerUrl(playerProvider, media, id, season, episode, item ?? undefined),
    [playerProvider, media, id, season, episode, item]
  );

  useEffect(() => {
    tmdb.details(media, id).then((d) => {
      setItem(d);
      saveHistory({
        id: d.id,
        type: media,
        title: titleOf(d),
        poster: d.poster_path,
        backdrop: d.backdrop_path,
        year: yearOf(d),
        rating: d.vote_average,
        season,
        episode,
        addedAt: Date.now(),
      });
      saveContinue({
        id: d.id,
        type: media,
        title: titleOf(d),
        poster: d.poster_path,
        backdrop: d.backdrop_path,
        year: yearOf(d),
        rating: d.vote_average,
        season,
        episode,
        progress: 18,
        addedAt: Date.now(),
      });
    });
  }, [media, id, season, episode]);

  useEffect(() => {
    if (media !== "tv") return;
    tmdb.season(id, season).then((d) => setEpisodes(d.episodes || []));
  }, [media, id, season]);

  const seasons = (item?.seasons || []).filter((s) => s.season_number > 0);

  const handlePlayerProviderChange = (value: string) => {
    const next = value as PlayerProviderId;
    setPlayerProviderState(next);
    setPlayerProvider(next);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className={`grid ${media === "tv" ? "lg:grid-cols-[1fr_340px]" : "grid-cols-1"} min-h-screen`}>
        <div className="relative flex min-h-[56vh] flex-col bg-black">
          <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3">
            <button
              onClick={() => nav(-1)}
              className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-sm backdrop-blur"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <label className="flex items-center gap-2 rounded-full bg-black/55 px-2.5 py-1.5 text-xs text-white/80 backdrop-blur">
              <span>Provider</span>
              <select
                value={playerProvider}
                onChange={(event) => handlePlayerProviderChange(event.target.value)}
                className="rounded-full border border-white/10 bg-black/70 px-2 py-1 text-xs text-white outline-none"
                aria-label="Select video provider"
              >
                {PLAYER_PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <iframe
            key={src}
            src={src}
            className="h-[56vh] w-full border-0 lg:h-screen"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Player"
          />
        </div>

        {media === "tv" && item && (
          <aside className="border-l border-white/8 bg-[#0d0d0d] p-5">
            <Link to={`/tv/${item.id}`} className="mb-3 block">
              <h1 className="font-display text-xl font-semibold">{titleOf(item)}</h1>
              <p className="text-sm text-white/45">
                {yearOf(item)} · Season {season} · Episode {episode}
              </p>
            </Link>
            <button
              onClick={() => setOpenSeasons((v) => !v)}
              className="mb-3 flex w-full items-center justify-between rounded-xl bg-white/6 px-3 py-2 text-sm"
            >
              Season {season}
              <ChevronDown size={16} />
            </button>
            {openSeasons && (
              <div className="mb-4 flex flex-wrap gap-2">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setParams({ s: String(s.season_number), e: "1" })}
                    className={`rounded-full px-3 py-1 text-xs ${
                      s.season_number === season ? "bg-white text-black" : "bg-white/8"
                    }`}
                  >
                    S{s.season_number}
                  </button>
                ))}
              </div>
            )}
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setParams({ s: String(season), e: String(ep.episode_number) })}
                  className={`flex w-full gap-3 rounded-xl p-2 text-left ${
                    ep.episode_number === episode ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <img
                    src={img(ep.still_path, "w300")}
                    alt=""
                    className="h-16 w-28 rounded-lg object-cover bg-white/5"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="line-clamp-2 text-xs text-white/40">{ep.overview}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
