import { Link } from "react-router-dom";
import { img, titleOf, typeOf, yearOf, type TmdbItem } from "../api/tmdb";

export default function Top10({
  kicker = "Trending today",
  title,
  items,
}: {
  kicker?: string;
  title: string;
  items: TmdbItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="px-5 md:px-10">
      <p className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
        <span className="inline-block h-3 w-px bg-white/70" />
        {kicker}
      </p>
      <h2 className="mb-5 font-display text-2xl font-semibold">{title}</h2>
      <div className="row-scroll flex items-end gap-6 pb-4">
        {items.slice(0, 10).map((item, i) => {
          const type = typeOf(item);
          return (
            <Link
              key={item.id}
              to={`/${type}/${item.id}`}
              className="group relative flex shrink-0 items-end"
            >
              <span className="rank-num absolute -left-2 bottom-8 z-0">{i + 1}</span>
              <div className="relative z-10 ml-10 w-[148px] overflow-hidden rounded-xl poster-shadow md:ml-14 md:w-[168px]">
                <img
                  src={img(item.poster_path, "w342")}
                  alt={titleOf(item)}
                  className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {item.vote_average > 0 && (
                  <span className="absolute right-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] backdrop-blur">
                    {item.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 left-14 hidden w-[168px] pt-2 md:block">
                <p className="truncate text-xs font-medium">{titleOf(item)}</p>
                <p className="text-[11px] text-white/40">{yearOf(item)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
