import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/6 px-6 py-10 text-sm text-white/40 md:px-12">
      <div className="mb-6 flex flex-wrap gap-5">
        <Link to="/movies">Movies</Link>
        <Link to="/tv">TV Shows</Link>
        <Link to="/anime">Anime</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/settings">Settings</Link>
      </div>
      <p className="max-w-2xl text-xs leading-relaxed">
        NoirX does not host or store any media files. Titles, posters, and metadata come from TMDB.
        Playback is provided by a third-party embed.
      </p>
      <p className="mt-4 text-xs">© 2026 NoirX · Film data by TMDB</p>
    </footer>
  );
}
