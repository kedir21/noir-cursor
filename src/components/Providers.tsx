import { useEffect, useState } from "react";
import { img, tmdb, FEATURED_PROVIDERS, type MediaType, type TmdbItem } from "../api/tmdb";
import MediaRow from "./MediaRow";

export default function Providers({ media }: { media: MediaType }) {
  const [active, setActive] = useState(FEATURED_PROVIDERS[0].id);
  const [items, setItems] = useState<TmdbItem[]>([]);
  const [logos, setLogos] = useState<Record<number, string>>({});
  const name = FEATURED_PROVIDERS.find((p) => p.id === active)?.name || "Netflix";

  useEffect(() => {
    tmdb.providers(media).then((data) => {
      const map: Record<number, string> = {};
      data.results.forEach((p) => {
        map[p.provider_id] = img(p.logo_path, "w92");
      });
      setLogos(map);
    });
  }, [media]);

  useEffect(() => {
    tmdb.providerItems(media, active).then((d) => setItems(d.results));
  }, [media, active]);

  return (
    <div>
      <section className="px-5 md:px-10">
        <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
          <span className="inline-block h-3 w-px bg-white/70" />
          Where to watch
        </p>
        <h2 className="mb-5 font-display text-2xl font-semibold">Streaming providers</h2>
        <div className="row-scroll flex gap-3 pb-2">
          {FEATURED_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition ${
                active === p.id ? "border-white bg-white/10" : "border-white/8 bg-white/5"
              }`}
              title={p.name}
            >
              {logos[p.id] ? (
                <img src={logos[p.id]} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <span className="px-1 text-[10px]">{p.name}</span>
              )}
            </button>
          ))}
        </div>
      </section>
      <div className="mt-8">
        <MediaRow
          kicker={`Popular ${media === "tv" ? "shows" : "movies"} on ${name}`}
          title={media === "tv" ? "Popular Shows" : "Popular Movies"}
          items={items}
        />
      </div>
    </div>
  );
}
