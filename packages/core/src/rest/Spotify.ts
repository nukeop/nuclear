import logger from 'electron-timber';

import { PlaylistTrack } from '../helpers';

const SPOTIFY_API_OPEN_URL = 'https://open.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export type SpotifyImage = {
  height: number;
  width: number;
  url: string;
}

export type SpotifyArtist = {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export type SpotifySimplifiedArtist = {
  name: string;
}

export type SpotifyFullArtist = SpotifyArtist & {
  genres: string[];
  popularity: number;
}

export type SpotifyPaginatedResponse<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export type SpotifySimplifiedAlbum = {
  id: string;
  album_type: 'single' | 'album' | 'compilation';
  total_tracks: number;
  href: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  artists: SpotifySimplifiedArtist[];
}

export type SpotifyFullAlbum = SpotifySimplifiedAlbum & {
  genres: string[];
  tracks: SpotifyPaginatedResponse<Omit<SpotifyTrack, 'album' | 'popularity'>>;
}

export type SpotifyTrack = {
  id: string;
  name: string;
  href: string;
  album: {
    id: string;
    images: SpotifyImage[];
    name: string;
  };
  artists: SpotifySimplifiedArtist[];
  popularity: number;
  track_number: number;
  duration_ms: number;
  type: 'track';
}

export type SpotifyEpisode = {
  // We only want to filter this out
  type: 'episode';
}

export type SpotifyPlaylistResponse = {
  id: string;
  name: string;
  images: SpotifyImage[];
  uri: string;
  tracks: SpotifyPaginatedResponse<SpotifyPlaylistTrackObject>;
}

export type SpotifyPlaylist = {
  id: string;
  name: string;
  tracks: SpotifyTrack[];
  images: SpotifyImage[];
  uri: string;
}

export type SpotifyPlaylistTrackObject = {
  track: SpotifyTrack | SpotifyEpisode;
}

export type SpotifyPlaylistTracksResponse = SpotifyPaginatedResponse<SpotifyPlaylistTrackObject>;

export const isTrack = (track: SpotifyTrack | SpotifyEpisode): track is SpotifyTrack => {
  return track.type === 'track';
};

class SpotifyClient {
  private _token: string | undefined;

  constructor() {
  }

  async init() {
    return this.refreshToken();
  }

  get token() {
    return this._token;
  }

  async refreshToken() {
    const tokenData = await (await fetch(`${SPOTIFY_API_OPEN_URL}/get_access_token?reason=transport&productType=web_player`)).json();
    this._token = tokenData.accessToken;
  }

  async get(url: string) {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this._token}`
      }
    });
      
    if (result.ok) {
      return result.json();
    } else if (result.status === 401) {
      await this.refreshToken();
      return this.get(url);
    }
  }

  async searchArtists(query: string, limit=10): Promise<SpotifyArtist[]> {
    const data = await this.get(`${SPOTIFY_API_URL}/search?type=artist&q=${query}&decorate_restrictions=false&include_external=audio&limit=${limit}`);

    return data.artists.items;
  }

  async searchReleases(query: string, limit=10): Promise<SpotifySimplifiedAlbum[]> {
    const data = await this.get(`${SPOTIFY_API_URL}/search?type=album&q=${query}&decorate_restrictions=false&include_external=audio&limit=${limit}`);

    return data.albums.items;
  }

  async searchTracks(query: string, limit=20): Promise<SpotifyTrack[]> {
    const data = await this.get(`${SPOTIFY_API_URL}/search?type=track&q=${query}&decorate_restrictions=false&include_external=audio&limit=${limit}`);

    return data.tracks.items;
  }

  async searchAll(query: string): Promise<{ artists: SpotifyArtist[]; releases: SpotifySimplifiedAlbum[]; tracks: SpotifyTrack[]; }> {
    const data = await this.get(`${SPOTIFY_API_URL}/search?q=${query}&type=artist,album,track&decorate_restrictions=false&include_external=audio`);

    return {
      artists: data.artists.items,
      releases: data.albums.items,
      tracks: data.tracks.items
    };
  }

  async getArtistDetails(id: string): Promise<SpotifyFullArtist> {
    const data = await this.get(`${SPOTIFY_API_URL}/artists/${id}`);

    return data;
  }

  async getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
    const data = await this.get(`${SPOTIFY_API_URL}/artists/${id}/top-tracks`);

    return data.tracks;
  }

  async getSimilarArtists(id: string): Promise<SpotifyFullArtist[]> {
    const data = await this.get(`${SPOTIFY_API_URL}/artists/${id}/related-artists`);

    return data.artists;
  }

  async getArtistsAlbums(id: string): Promise<SpotifySimplifiedAlbum[]> {
    let albums: SpotifySimplifiedAlbum[] = [];
    let data: SpotifyPaginatedResponse<SpotifySimplifiedAlbum> = await this.get(`${SPOTIFY_API_URL}/artists/${id}/albums?include_groups=album`);
    albums = data.items;

    while (data.next && data.items?.length >= data.limit) {
      const nextData: SpotifyPaginatedResponse<SpotifySimplifiedAlbum> = await this.get(data.next);
      albums = [...albums, ...nextData.items];
      data = nextData;
    }

    return albums;
  }

  async getTopArtist(query: string): Promise<SpotifyFullArtist> {
    const data = await this.get(`${SPOTIFY_API_URL}/search?type=artist&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`);

    return data.best_match.items[0];
  }

  async getAlbum(id: string): Promise<SpotifyFullAlbum> {
    const data = await this.get(`${SPOTIFY_API_URL}/albums/${id}`);

    return data;
  }

  async getTopAlbum(query: string): Promise<SpotifyFullAlbum> {
    const data = await this.get(`${SPOTIFY_API_URL}/search?type=album&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`);

    return data.best_match.items[0];
  }

  async getPlaylist(id: string): Promise<SpotifyPlaylist> {
    const playlistResponse: SpotifyPlaylistResponse = await this.get(`${SPOTIFY_API_URL}/playlists/${id}`);
    let tracks = playlistResponse.tracks.items.map(item => item.track).filter(isTrack) as SpotifyTrack[];
    let data = playlistResponse.tracks;

    while (data.next) {
      const nextData: SpotifyPaginatedResponse<SpotifyPlaylistTrackObject> = await this.get(data.next);
      tracks = [...tracks, ...(nextData.items.map(item => item.track).filter(isTrack))] as SpotifyTrack[];
      data = nextData;
    }

    return {
      ...playlistResponse,
      tracks
    };
  }
}

export const getImageSet = (images: SpotifyImage[]): { thumb?: string; coverImage?: string; } => {
  const isNotEmpty = images.length > 0;
  const largestImage = isNotEmpty && images.reduce((prev, current) => {
    return (prev.height * prev.width) > (current.height * current.width) ? prev : current;
  });
  const thumbnail = isNotEmpty && images.find(image => image.height < 400 && image.width < 400);

  return {
    thumb: thumbnail?.url,
    coverImage: largestImage?.url
  };
};


export const mapSpotifyTrack = (track: SpotifyTrack): PlaylistTrack | null => {
  const { thumb } = getImageSet(track.album?.images ?? []);
  try {
    return {
      uuid: track.id,
      artists: track.artists.map(artist => artist.name),
      name: track.name,
      album: track.album.name,
      thumbnail: thumb,
      duration: track.duration_ms/1000,
      stream: undefined
    };
  } catch (e) {
    // If for any reason the track is malformed, we just ignore it
    // At some point, we could show errors on a per-track basis
    logger.error(e);
    return null;
  }
};


export class SpotifyClientProvider {
  private static client: SpotifyClient;

  private constructor() {}

  static async get(): Promise<SpotifyClient> {
    if (!SpotifyClientProvider.client) {
      SpotifyClientProvider.client = new SpotifyClient();
      await SpotifyClientProvider.client.init();
    }

    return SpotifyClientProvider.client;
  }
}
