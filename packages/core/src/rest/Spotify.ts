const SPOTIFY_API_OPEN_URL = 'https://open.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

type SpotifyArtist = {
    images: {
        height: number;
        url: string;
    }[];
}

export const getToken = async (): Promise<string> => {
  const data = await (await fetch(`${SPOTIFY_API_OPEN_URL}/get_access_token?reason=transport&productType=web_player`)).json();

  return data.accessToken as string;
};

export const searchArtists = async (token: string, query: string): Promise<SpotifyArtist> => {
  const data = await (
    await fetch(`${SPOTIFY_API_URL}/search?type=artist&q=${query}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }})
  ).json();

  return data.best_match.items[0];
};
