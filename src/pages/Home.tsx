import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Top10 from "../components/Top10";
import MediaRow from "../components/MediaRow";
import Providers from "../components/Providers";
import ContinueRow from "../components/ContinueRow";
import Footer from "../components/Footer";
import { MOVIE_GENRES, tmdb, type TmdbItem } from "../api/tmdb";

export default function Home() {
  const [hero, setHero] = useState<TmdbItem[]>([]);
  const [topMovies, setTopMovies] = useState<TmdbItem[]>([]);
  const [topShows, setTopShows] = useState<TmdbItem[]>([]);
  const [popular, setPopular] = useState<TmdbItem[]>([]);
  const [newReleases, setNewReleases] = useState<TmdbItem[]>([]);
  const [topRated, setTopRated] = useState<TmdbItem[]>([]);
  const [genreRows, setGenreRows] = useState<{ name: string; items: TmdbItem[] }[]>([]);

  useEffect(() => {
    tmdb.trending("movie").then((d) => {
      setHero(d.results);
      setTopMovies(d.results);
    });
    tmdb.trending("tv").then((d) => setTopShows(d.results));
    tmdb.popular("movie").then((d) => setPopular(d.results));
    tmdb.nowPlaying().then((d) => setNewReleases(d.results));
    tmdb.topRated("movie").then((d) => setTopRated(d.results));
    Promise.all(
      [27, 53, 80, 99].map(async (id) => {
        const g = MOVIE_GENRES.find((x) => x.id === id)!;
        const data = await tmdb.discover("movie", { with_genres: id, sort_by: "popularity.desc" });
        return { name: g.name, items: data.results };
      })
    ).then(setGenreRows);
  }, []);

  return (
    <div>
      <Hero items={hero} />
      <div className="relative z-10 -mt-8 flex flex-col gap-12 pb-8">
        <ContinueRow />
        <Top10 title="Top 10 movies" items={topMovies} />
        <Top10 title="Top 10 shows" items={topShows} />
        <Providers media="movie" />
        <MediaRow title="Popular Movies" items={popular} />
        <MediaRow title="New Releases" items={newReleases} />
        <MediaRow title="Top Rated" items={topRated} />
        <section className="px-5 md:px-10">
          <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
            <span className="inline-block h-3 w-px bg-white/70" />
            Explore
          </p>
          <h2 className="font-display text-2xl font-semibold">Browse by genre</h2>
        </section>
        {genreRows.map((row) => (
          <MediaRow key={row.name} title={row.name} items={row.items} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
