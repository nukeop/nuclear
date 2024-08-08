const SPOTIFY_API_OPEN_URL = 'https://open.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export type SpotifyArtist = {
  name: string;
  images: {
    height: number;
    url: string;
  }[];
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

  async searchArtists(query: string): Promise<SpotifyArtist[]> {
    if (!this._token) {
      await this.init();
    }

    const data = await (
      await fetch(`${SPOTIFY_API_URL}/search?type=artist&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
        headers: {
          Authorization: `Bearer ${this._token}`
        }})
    ).json();

    return data.best_match.items;
  }

  async getTopArtist(query: string): Promise<SpotifyArtist> {
    return (await this.searchArtists(query))[0];
  }
}

export class SpotifyClientProvider {
  private static client: SpotifyClient;

  private constructor() {}

  static get(): SpotifyClient {
    if (!SpotifyClientProvider.client) {
      SpotifyClientProvider.client = new SpotifyClient();
    }

    return SpotifyClientProvider.client;
  }
}
