import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  Clapperboard,
  Tv,
  Sparkles,
  Compass,
  Settings,
  Layers,
  LogIn,
} from "lucide-react";

const items = [
  { to: "#search", icon: Search, label: "Search", action: "search" },
  { to: "/", icon: Home, label: "Home" },
  { to: "/movies", icon: Clapperboard, label: "Movies" },
  { to: "/tv", icon: Tv, label: "TV Shows" },
  { to: "/anime", icon: Sparkles, label: "Anime" },
  { to: "/", icon: "logo", label: "NoirX", logo: true },
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/discover", icon: Layers, label: "Genres", action: "genres" },
  { to: "/settings", icon: LogIn, label: "Account" },
] as const;

export default function Navbar({ onSearch }: { onSearch: () => void }) {
  const loc = useLocation();
  const nav = useNavigate();
  if (loc.pathname.startsWith("/watch")) return null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <nav className="glass-nav pointer-events-auto flex items-center gap-0.5 rounded-full px-2 py-1.5">
        {items.map((item, i) => {
          if ("logo" in item && item.logo) {
            return (
              <NavLink
                key="logo"
                to="/"
                className="mx-1 flex h-9 w-9 items-center justify-center"
                aria-label="NoirX"
              >
                <img src="/logoicon.png" alt="NoirX" className="h-7 w-7 object-contain" />
              </NavLink>
            );
          }
          const Icon = item.icon as typeof Search;
          const active =
            item.to !== "#search" &&
            (item.to === "/"
              ? loc.pathname === "/"
              : loc.pathname.startsWith(item.to) && item.to !== "/discover");
          const discoverActive = item.to === "/discover" && loc.pathname.startsWith("/discover");
          const isActive = item.label === "Discover" ? discoverActive : active;

          return (
            <button
              key={`${item.label}-${i}`}
              aria-label={item.label}
              title={item.label}
              onClick={() => {
                if ("action" in item && item.action === "search") onSearch();
                else nav(item.to);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
            </button>
          );
        })}
      </nav>
    </header>
  );
}
