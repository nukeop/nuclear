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

export type SpotifyArtistAlbumsResponse = {
  href: string;
  items: SpotifySimplifiedAlbum[];
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
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: Omit<SpotifyTrack, 'album' | 'popularity'>[];
  };
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
  duration_ms: number;
}


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
    let data: SpotifyArtistAlbumsResponse = await this.get(`${SPOTIFY_API_URL}/artists/${id}/albums?include_groups=album`);
    albums = data.items;

    while (data.next) {
      const nextData: SpotifyArtistAlbumsResponse = await this.get(data.next);
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
