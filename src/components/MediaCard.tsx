import { Link } from "react-router-dom";
import { img, titleOf, typeOf, yearOf, type TmdbItem } from "../api/tmdb";

export default function MediaCard({
  item,
  kind,
  fluid,
}: {
  item: TmdbItem;
  kind?: "poster" | "backdrop";
  fluid?: boolean;
}) {
  const type = typeOf(item);
  const landscape = kind === "backdrop";
  const src = landscape
    ? img(item.backdrop_path || item.poster_path, "w780")
    : img(item.poster_path, "w342");

  return (
    <Link
      to={`/${type}/${item.id}`}
      className={`group relative overflow-hidden rounded-xl bg-white/5 ${
        fluid
          ? "block w-full"
          : "shrink-0 " + (landscape ? "w-[230px]" : "w-[148px] md:w-[168px]")
      } ${landscape ? "aspect-video" : "aspect-[2/3]"}`}
    >
      {src ? (
        <img
          src={src}
          alt={titleOf(item)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center text-xs text-white/40">
          {titleOf(item)}
        </div>
      )}
      {item.vote_average > 0 && (
        <span className="absolute right-2 top-2 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur">
          {item.vote_average.toFixed(1)}
        </span>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-8 opacity-0 transition group-hover:opacity-100">
        <p className="truncate text-[12px] font-medium">{titleOf(item)}</p>
        <p className="text-[10px] text-white/55">{yearOf(item)}</p>
      </div>
    </Link>
  );
}
