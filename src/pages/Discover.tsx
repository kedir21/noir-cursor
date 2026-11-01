import { useEffect, useState } from "react";
import GenrePills from "../components/GenrePills";
import MediaCard from "../components/MediaCard";
import Footer from "../components/Footer";
import { MOVIE_GENRES, TV_GENRES, tmdb, type MediaType, type TmdbItem } from "../api/tmdb";

export default function Discover() {
  const [media, setMedia] = useState<MediaType>("movie");
  const [genre, setGenre] = useState<number | null>(null);
  const [sort, setSort] = useState("popularity.desc");
  const [items, setItems] = useState<TmdbItem[]>([]);
  const genres = media === "movie" ? MOVIE_GENRES : TV_GENRES;

  useEffect(() => {
    tmdb
      .discover(media, {
        sort_by: sort,
        ...(genre ? { with_genres: genre } : {}),
      })
      .then((d) => setItems(d.results));
  }, [media, genre, sort]);

  return (
    <div className="pt-28">
      <div className="px-5 md:px-10">
        <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-white/40">Explore</p>
        <h1 className="font-display text-4xl font-semibold">Discover</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["movie", "tv"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMedia(m);
                setGenre(null);
              }}
              className={`rounded-full px-4 py-1.5 text-sm ${
                media === m ? "bg-white text-black" : "bg-white/8"
              }`}
            >
              {m === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-white/10 bg-[#141414] px-3 py-1.5 text-sm"
          >
            <option value="popularity.desc">Popular</option>
            <option value="vote_average.desc">Top rated</option>
            <option value="primary_release_date.desc">Newest</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        <GenrePills genres={genres} active={genre} onSelect={setGenre} />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:px-10">
        {items.map((item) => (
          <MediaCard key={item.id} item={{ ...item, media_type: media }} fluid />
        ))}
      </div>
      <Footer />
    </div>
  );
}
