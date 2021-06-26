const apiUrl = 'https://itunes.apple.com';

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
