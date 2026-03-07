// These types correspond to Rust types in packages/player/src-tauri/src/ytdlp.rs
export type YtdlpSearchResult = {
  id: string;
  title: string;
  duration: number | null;
  thumbnail: string | null;
};

export type YtdlpStreamInfo = {
  stream_url: string;
  duration: number | null;
  title: string | null;
  container: string | null;
  codec: string | null;
};

export type YtdlpPlaylistEntry = {
  id: string;
  title: string;
  duration: number | null;
  thumbnail: string | null;
};

export type YtdlpPlaylistInfo = {
  id: string;
  title: string;
  entries: YtdlpPlaylistEntry[];
};

export type YtdlpHost = {
  search: (query: string, maxResults?: number) => Promise<YtdlpSearchResult[]>;
  getStream: (videoId: string) => Promise<YtdlpStreamInfo>;
  getPlaylist: (url: string) => Promise<YtdlpPlaylistInfo>;
};
