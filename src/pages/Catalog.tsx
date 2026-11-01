import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Top10 from "../components/Top10";
import MediaRow from "../components/MediaRow";
import Providers from "../components/Providers";
import ContinueRow from "../components/ContinueRow";
import GenrePills from "../components/GenrePills";
import Footer from "../components/Footer";
import {
  MOVIE_GENRES,
  TV_GENRES,
  tmdb,
  type MediaType,
  type TmdbItem,
} from "../api/tmdb";

export default function Catalog({
  media,
  variant = "standard",
}: {
  media: MediaType;
  variant?: "standard" | "anime";
}) {
  const genres = media === "movie" ? MOVIE_GENRES : TV_GENRES;
  const [hero, setHero] = useState<TmdbItem[]>([]);
  const [top, setTop] = useState<TmdbItem[]>([]);
  const [topRated, setTopRated] = useState<TmdbItem[]>([]);
  const [now, setNow] = useState<TmdbItem[]>([]);
  const [soon, setSoon] = useState<TmdbItem[]>([]);
  const [genreRows, setGenreRows] = useState<{ name: string; items: TmdbItem[] }[]>([]);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [genreItems, setGenreItems] = useState<TmdbItem[]>([]);

  const animeParams =
    variant === "anime"
      ? media === "movie"
        ? { with_genres: 16, with_original_language: "ja" }
        : { with_genres: 16, with_original_language: "ja" }
      : {};

  useEffect(() => {
    const load = async () => {
      if (variant === "anime") {
        const [movies, shows] = await Promise.all([
          tmdb.discover("movie", { ...animeParams, sort_by: "popularity.desc" }),
          tmdb.discover("tv", { ...animeParams, sort_by: "popularity.desc" }),
        ]);
        const mixed = [...shows.results, ...movies.results];
        setHero(shows.results);
        setTop(shows.results);
        setNow(movies.results);
        setTopRated(mixed);
        const rows = await Promise.all(
          [16, 10759, 18, 35].map(async (id) => {
            const data = await tmdb.discover("tv", {
              with_genres: `16,${id}`,
              with_original_language: "ja",
              sort_by: "popularity.desc",
            });
            const name =
              id === 16 ? "Animation" : TV_GENRES.find((g) => g.id === id)?.name || "Anime";
            return { name, items: data.results };
          })
        );
        setGenreRows(rows);
        return;
      }

      const trend = await tmdb.trending(media);
      setHero(trend.results);
      setTop(trend.results);
      const rated = await tmdb.topRated(media);
      setTopRated(rated.results);
      if (media === "movie") {
        setNow((await tmdb.nowPlaying()).results);
        setSoon((await tmdb.upcoming()).results);
      } else {
        setNow((await tmdb.onTheAir()).results);
        setSoon((await tmdb.airingToday()).results);
      }
      const rows = await Promise.all(
        genres.slice(0, 6).map(async (g) => {
          const data = await tmdb.discover(media, { with_genres: g.id, sort_by: "popularity.desc" });
          return { name: g.name, items: data.results };
        })
      );
      setGenreRows(rows);
    };
    load();
  }, [media, variant]);

  useEffect(() => {
    if (!activeGenre) return;
    tmdb
      .discover(media, {
        with_genres: variant === "anime" ? `16,${activeGenre}` : activeGenre,
        ...(variant === "anime" ? { with_original_language: "ja" } : {}),
        sort_by: "popularity.desc",
      })
      .then((d) => setGenreItems(d.results));
  }, [activeGenre, media, variant]);

  return (
    <div>
      <Hero items={hero} />
      <div className="relative z-10 -mt-10 flex flex-col gap-10 pb-8">
        {variant !== "anime" && (
          <GenrePills genres={genres} active={activeGenre} onSelect={setActiveGenre} />
        )}
        <ContinueRow />
        {activeGenre ? (
          <MediaRow
            title={genres.find((g) => g.id === activeGenre)?.name || "Genre"}
            items={genreItems}
          />
        ) : (
          <>
            <Top10 title="Top 10 today" items={top} />
            {variant !== "anime" && <Providers media={media} />}
            <MediaRow title="Top Rated" items={topRated} />
            <MediaRow
              title={media === "movie" ? "Now Playing" : variant === "anime" ? "Popular Anime" : "On The Air"}
              items={now}
            />
            {variant !== "anime" && (
              <MediaRow title={media === "movie" ? "Coming Soon" : "Airing Today"} items={soon} />
            )}
            {genreRows.map((row) => (
              <MediaRow key={row.name} title={row.name} items={row.items} />
            ))}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
