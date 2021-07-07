const apiUrl = 'https://itunes.apple.com';

/* PODCAST */
export function podcastSearch(terms: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/search?limit=${limit}&media=podcast&term=${terms}`);
}

export function episodesSearch(terms: string, limit: string) {
  return fetch(`${apiUrl}/search?entity=podcastEpisode&limit=${limit}&media=podcast&term=${terms}`);
}

export function getPodcast(id: string): Promise<Response> {
  return fetch(`${apiUrl}/lookup?id=${id}`);
}

export function getPodcastEpisodes(id: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/lookup?id=${id}&media=podcast&entity=podcastEpisode&limit=${limit}`);
}

/* MUSIC */
export function artistSearch(terms: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/search?limit=${limit}&media=music&entity=musicArtist&term=${terms}`);
}

export function albumSearch(terms: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/search?limit=${limit}&media=music&entity=album&term=${terms}`);
}

export function musicSearch(terms: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/search?limit=${limit}&media=music&entity=musicTrack&term=${terms}`);
}

export function artistDetailsSearch(id: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/lookup?limit=${limit}&id=${id}&entity=song`);
}

export function artistAlbumsSearch(id: string): Promise<Response> {
  return fetch(`${apiUrl}/lookup?id=${id}&entity=album`);
}

export function albumSongsSearch(id: string, limit: string): Promise<Response> {
  return fetch(`${apiUrl}/lookup?limit=${limit}&id=${id}&entity=song`);
}
