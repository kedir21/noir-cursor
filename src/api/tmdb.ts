export const TMDB_KEY = "5e6a638a16f35974c254b7e6da34619d";
export const TMDB = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";

export const PLAYER_PROVIDER_IDS = ["vidy", "vidzee", "viduki"] as const;
export type PlayerProviderId = (typeof PLAYER_PROVIDER_IDS)[number];
export const DEFAULT_PLAYER: PlayerProviderId = "vidy";

export function buildPlayerUrl(
  provider: PlayerProviderId,
  media: MediaType,
  id: number | string,
  season = 1,
  episode = 1,
  item?: Pick<TmdbItem, "imdb_id">
) {
  const color = "8c52ff";
  const imdbId = item?.imdb_id || id;

  switch (provider) {
    case "vidy":
      return media === "tv"
        ? `https://www.vidy.st/tv/${id}/${season}/${episode}`
        : `https://www.vidy.st/movie/${id}`;
    case "viduki":
      return media === "tv"
        ? `https://viduki.net/1/tv/${imdbId}/${season}/${episode}?color=${color}`
        : `https://viduki.net/1/movie/${imdbId}?color=${color}`;
    case "vidzee":
    default:
      return media === "tv"
        ? `https://player.vidzee.wtf/embed/tv/${id}/${season}/${episode}?color=${color}`
        : `https://player.vidzee.wtf/embed/movie/${id}?color=${color}`;
  }
}

export const PLAYER_PROVIDERS = [
  { id: "vidy", name: "Vidy" },
  { id: "vidzee", name: "Vidzee" },
  { id: "viduki", name: "Viduki" },
] as const satisfies ReadonlyArray<{ id: PlayerProviderId; name: string }>;

export const PLAYER = {
  movie: (id: number | string) => buildPlayerUrl(DEFAULT_PLAYER, "movie", id),
  tv: (id: number | string, s = 1, e = 1) => buildPlayerUrl(DEFAULT_PLAYER, "tv", id, s, e),
};

export type MediaType = "movie" | "tv";

export type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  imdb_id?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: MediaType | "person";
  popularity?: number;
  original_language?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  images?: {
    logos: {
      file_path: string;
      iso_639_1: string | null;
      width?: number;
    }[];
  };
  videos?: { results: TmdbVideo[] };
  credits?: {
    cast: TmdbPerson[];
    crew: TmdbPerson[];
  };
  similar?: { results: TmdbItem[] };
  recommendations?: { results: TmdbItem[] };
  seasons?: TmdbSeason[];
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  release_dates?: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
};

export type TmdbVideo = {
  key: string;
  site: string;
  type: string;
  name: string;
  official?: boolean;
};

export type TmdbPerson = {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
};

export type TmdbSeason = {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date?: string;
};

export type TmdbEpisode = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date?: string;
  runtime?: number;
  vote_average: number;
};

export type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB}${path}`);
  url.searchParams.set("api_key", TMDB_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export const img = (path: string | null | undefined, size = "original") =>
  path ? `${IMG}/${size}${path}` : "";

export const titleOf = (item: TmdbItem) => item.title || item.name || "Untitled";
export const yearOf = (item: TmdbItem) =>
  (item.release_date || item.first_air_date || "").slice(0, 4);
export const typeOf = (item: TmdbItem): MediaType =>
  item.media_type === "tv" || (!item.title && !!item.name) ? "tv" : "movie";

export function pickLogo(item: TmdbItem) {
  const logos = item.images?.logos || [];
  const en = logos.find((l) => l.iso_639_1 === "en") || logos[0];
  return en ? img(en.file_path, "w500") : null;
}

export function pickTrailer(item: TmdbItem) {
  const vids = item.videos?.results || [];
  const t =
    vids.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
    vids.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    vids.find((v) => v.site === "YouTube" && v.type === "Teaser");
  return t?.key || null;
}

export function certification(item: TmdbItem) {
  const movie = item.release_dates?.results?.find((r) => r.iso_3166_1 === "US");
  const cert = movie?.release_dates?.find((r) => r.certification)?.certification;
  if (cert) return cert;
  const tv = item.content_ratings?.results?.find((r) => r.iso_3166_1 === "US");
  return tv?.rating || "";
}

export const tmdb = {
  trending: (media: "movie" | "tv" | "all", window = "day") =>
    get<{ results: TmdbItem[] }>(`/trending/${media}/${window}`),
  popular: (media: MediaType) => get<{ results: TmdbItem[] }>(`/${media}/popular`),
  topRated: (media: MediaType) => get<{ results: TmdbItem[] }>(`/${media}/top_rated`),
  nowPlaying: () => get<{ results: TmdbItem[] }>("/movie/now_playing"),
  upcoming: () => get<{ results: TmdbItem[] }>("/movie/upcoming"),
  airingToday: () => get<{ results: TmdbItem[] }>("/tv/airing_today"),
  onTheAir: () => get<{ results: TmdbItem[] }>("/tv/on_the_air"),
  discover: (media: MediaType, params: Record<string, string | number> = {}) =>
    get<{ results: TmdbItem[] }>(`/discover/${media}`, params),
  details: (media: MediaType, id: string | number) =>
    get<TmdbItem>(`/${media}/${id}`, {
      append_to_response: "images,videos,credits,similar,recommendations,content_ratings,release_dates",
    }),
  season: (id: string | number, season: number) =>
    get<{ episodes: TmdbEpisode[]; name: string; season_number: number }>(
      `/tv/${id}/season/${season}`
    ),
  search: (query: string) =>
    get<{ results: TmdbItem[] }>("/search/multi", { query }),
  genres: (media: MediaType) =>
    get<{ genres: { id: number; name: string }[] }>(`/genre/${media}/list`),
  providers: (media: MediaType) =>
    get<{ results: Provider[] }>(`/watch/providers/${media}`, { watch_region: "US" }),
  providerItems: (media: MediaType, providerId: number) =>
    get<{ results: TmdbItem[] }>(`/discover/${media}`, {
      with_watch_providers: providerId,
      watch_region: "US",
      sort_by: "popularity.desc",
    }),
};

export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 80, name: "Crime" },
  { id: 14, name: "Fantasy" },
  { id: 10749, name: "Romance" },
  { id: 9648, name: "Mystery" },
  { id: 99, name: "Documentary" },
  { id: 12, name: "Adventure" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 80, name: "Crime" },
  { id: 9648, name: "Mystery" },
  { id: 16, name: "Animation" },
  { id: 10764, name: "Reality" },
  { id: 99, name: "Documentary" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
];

export const FEATURED_PROVIDERS = [
  { id: 8, name: "Netflix" },
  { id: 9, name: "Prime Video" },
  { id: 350, name: "Apple TV+" },
  { id: 337, name: "Disney+" },
  { id: 1899, name: "Max" },
  { id: 15, name: "Hulu" },
  { id: 531, name: "Paramount+" },
  { id: 386, name: "Peacock" },
  { id: 283, name: "Crunchyroll" },
  { id: 43, name: "Starz" },
  { id: 526, name: "AMC+" },
  { id: 11, name: "MUBI" },
  { id: 99, name: "Shudder" },
  { id: 520, name: "Discovery+" },
  { id: 73, name: "Tubi" },
  { id: 300, name: "Pluto TV" },
];
