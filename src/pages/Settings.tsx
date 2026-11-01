import { useState } from "react";
import { User, Palette, MonitorPlay, Captions, LayoutGrid, Clock } from "lucide-react";
import Footer from "../components/Footer";
import { clearHistory, getHistory, getWatchlist } from "../lib/store";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "player", label: "Player", icon: MonitorPlay },
  { id: "subtitles", label: "Subtitles", icon: Captions },
  { id: "cards", label: "Card Display", icon: LayoutGrid },
  { id: "history", label: "Watch History", icon: Clock },
];

export default function Settings() {
  const [tab, setTab] = useState("account");
  const [accent, setAccent] = useState("white");
  const history = getHistory();
  const list = getWatchlist();

  return (
    <div className="min-h-screen pt-28">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[220px_1fr]">
        <aside>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <User size={18} />
            </div>
            <div>
              <p className="font-medium">Guest</p>
              <p className="text-xs text-white/40">Local Account</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm ${
                    tab === t.id ? "bg-white/10" : "text-white/60 hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section>
          {tab === "account" && (
            <>
              <h2 className="font-display text-2xl font-semibold">Account Settings</h2>
              <p className="mt-1 text-sm text-white/45">Manage your profile and sync preferences.</p>
              <div className="mt-6 rounded-2xl border border-white/8 bg-[#141414] px-8 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/8">
                  <User />
                </div>
                <h3 className="text-lg font-medium">Sync Across Devices</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
                  Watch history, continue watching, and your list are saved locally in this browser.
                </p>
                <button className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-black">
                  Sign In to Continue
                </button>
              </div>
            </>
          )}

          {tab === "appearance" && (
            <>
              <h2 className="font-display text-2xl font-semibold">Appearance</h2>
              <p className="mt-1 text-sm text-white/45">Dark cinema theme is always on.</p>
              <div className="mt-6 flex gap-3">
                {["white", "violet"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setAccent(c)}
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      accent === c ? "border-white" : "border-white/10"
                    }`}
                  >
                    {c === "white" ? "Noir white" : "Violet player"}
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "player" && (
            <>
              <h2 className="font-display text-2xl font-semibold">Player</h2>
              <p className="mt-2 max-w-lg text-sm text-white/50">
                Movies play at `player.vidzee.wtf/embed/movie/{"{id}"}` and TV at
                `/embed/tv/{"{id}"}/{"{s}"}/{"{e}"}` with color 8c52ff.
              </p>
            </>
          )}

          {tab === "subtitles" && (
            <>
              <h2 className="font-display text-2xl font-semibold">Subtitles</h2>
              <p className="mt-2 text-sm text-white/50">Subtitle options are controlled inside the player.</p>
            </>
          )}

          {tab === "cards" && (
            <>
              <h2 className="font-display text-2xl font-semibold">Card Display</h2>
              <p className="mt-2 text-sm text-white/50">Posters use TMDB artwork with rating badges.</p>
            </>
          )}

          {tab === "history" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Watch History</h2>
                <button
                  onClick={() => {
                    clearHistory();
                    location.reload();
                  }}
                  className="text-sm text-white/50"
                >
                  Clear
                </button>
              </div>
              <ul className="mt-6 space-y-2">
                {history.map((h) => (
                  <li key={`${h.type}-${h.id}-${h.addedAt}`} className="rounded-xl bg-white/5 px-4 py-3 text-sm">
                    {h.title} <span className="text-white/40">· {h.type}</span>
                  </li>
                ))}
                {!history.length && <p className="text-sm text-white/40">Nothing watched yet.</p>}
              </ul>
              <h3 className="mt-8 mb-3 font-medium">My list ({list.length})</h3>
              <ul className="space-y-2">
                {list.map((h) => (
                  <li key={`${h.type}-${h.id}`} className="rounded-xl bg-white/5 px-4 py-3 text-sm">
                    {h.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
