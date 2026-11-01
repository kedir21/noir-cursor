export default function GenrePills({
  genres,
  active,
  onSelect,
}: {
  genres: { id: number; name: string }[];
  active?: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div className="row-scroll flex gap-2 px-5 md:px-10">
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(active === g.id ? null : g.id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
            active === g.id ? "bg-white text-black" : "bg-white/8 text-white/75 hover:bg-white/12"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
