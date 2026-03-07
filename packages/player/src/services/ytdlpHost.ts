import { invoke } from '@tauri-apps/api/core';

import type {
  YtdlpHost,
  YtdlpPlaylistInfo,
  YtdlpSearchResult,
  YtdlpStreamInfo,
} from '@nuclearplayer/plugin-sdk';

export const ytdlpHost: YtdlpHost = {
  search: async (
    query: string,
    maxResults?: number,
  ): Promise<YtdlpSearchResult[]> => {
    return invoke<YtdlpSearchResult[]>('ytdlp_search', {
      query,
      maxResults: maxResults ?? 10,
    });
  },

  getStream: async (videoId: string): Promise<YtdlpStreamInfo> => {
    return invoke<YtdlpStreamInfo>('ytdlp_get_stream', { videoId });
  },

  getPlaylist: async (url: string): Promise<YtdlpPlaylistInfo> => {
    return invoke<YtdlpPlaylistInfo>('ytdlp_get_playlist', { url });
  },
};
