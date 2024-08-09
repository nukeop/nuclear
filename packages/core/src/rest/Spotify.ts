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

export type SpotifyFullArtist = {
  id: string;
  genres: string[];
  images: SpotifyImage[];
  name: string;
  popularity: number;
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

export type SpotifyTrack = {
  id: string;
  name: string;
  href: string;
  album: {
    id: string;
    images: SpotifyImage[];
  };
  artists: SpotifySimplifiedArtist[];
  popularity: number;
  track_number: number;
}


class SpotifyClient {
  private _token: string | undefined;

  constructor() {
  }

  async init() {
    const tokenData = await (await fetch(`${SPOTIFY_API_OPEN_URL}/get_access_token?reason=transport&productType=web_player`)).json();
    this._token = tokenData.accessToken;
  }

  get token() {
    return this._token;
  }

  async searchArtists(query: string, limit=10): Promise<SpotifyArtist[]> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/search?type=artist&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.artists.items;
  }

  async searchReleases(query: string, limit=10): Promise<SpotifySimplifiedAlbum[]> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/search?type=album&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.albums.items;
  }

  async searchTracks(query: string, limit=20): Promise<SpotifyTrack[]> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/search?type=track&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.tracks.items;
  }

  async searchAll(query: string): Promise<{ artists: SpotifyArtist[]; releases: SpotifySimplifiedAlbum[]; tracks: SpotifyTrack[]; }> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/search?q=${query}&type=artist,album,track&decorate_restrictions=false&best_match=true&include_external=audio`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return {
      artists: data.artists.items,
      releases: data.albums.items,
      tracks: data.tracks.items
    };
  }

  async getArtistDetails(id: string): Promise<SpotifyArtist> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data;
  }

  async getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/artists/${id}/top-tracks`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.tracks;
  }

  async getSimilarArtists(id: string): Promise<SpotifyFullArtist[]> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/artists/${id}/related-artists?limit=5`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.artists;
  }

  async getArtistsAlbums(id: string): Promise<SpotifySimplifiedAlbum[]> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/artists/${id}/albums`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.items;
  }

  async getTopArtist(query: string): Promise<SpotifyFullArtist> {
    const data = await (
      await fetch(`${SPOTIFY_API_URL}/search?type=artist&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.best_match.items[0];
  }
}

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
