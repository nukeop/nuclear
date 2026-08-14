// These types correspond to Rust types in packages/player/src-tauri/src/ytdlp.rs
export type YtdlpSearchResult = {
  id: string;
  title: string;
  duration: number | null;
  thumbnail: string | null;
  channel: string | null;
};

export type YtdlpStreamInfo = {
  stream_url: string;
  duration: number | null;
  title: string | null;
  container: string | null;
  codec: string | null;
  album: string | null;
  artists: string[];
  album_artists: string[];
  upload_date: string | null;
};

export type YtdlpThumbnail = {
  url: string;
  width: number | null;
  height: number | null;
};

export type YtdlpPlaylistEntry = {
  id: string;
  title: string;
  duration: number | null;
  thumbnails: YtdlpThumbnail[];
  channel: string | null;
};

export type YtdlpPlaylistInfo = {
  id: string;
  title: string;
  entries: YtdlpPlaylistEntry[];
};

export type YtdlpHost = {
  search: (query: string, maxResults?: number) => Promise<YtdlpSearchResult[]>;
  getStream: (url: string) => Promise<YtdlpStreamInfo>;
  getPlaylist: (url: string) => Promise<YtdlpPlaylistInfo>;
};
