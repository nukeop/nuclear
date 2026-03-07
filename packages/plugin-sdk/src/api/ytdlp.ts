import type {
  YtdlpHost,
  YtdlpPlaylistInfo,
  YtdlpSearchResult,
  YtdlpStreamInfo,
} from '../types/ytdlp';

export class YtdlpAPI {
  private host?: YtdlpHost;

  constructor(host?: YtdlpHost) {
    this.host = host;
  }

  get available(): boolean {
    return !!this.host;
  }

  async search(
    query: string,
    maxResults?: number,
  ): Promise<YtdlpSearchResult[]> {
    if (!this.host) {
      throw new Error('YtdlpAPI: No host configured');
    }
    return this.host.search(query, maxResults);
  }

  async getStream(videoId: string): Promise<YtdlpStreamInfo> {
    if (!this.host) {
      throw new Error('YtdlpAPI: No host configured');
    }
    return this.host.getStream(videoId);
  }

  async getPlaylist(url: string): Promise<YtdlpPlaylistInfo> {
    if (!this.host) {
      throw new Error('YtdlpAPI: No host configured');
    }
    return this.host.getPlaylist(url);
  }
}
