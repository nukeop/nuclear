export async function _findHost(): Promise<string> {
  return new Promise((resolve, reject) => {
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    try {
      fetch('https://api.audius.co')
        .then(r => r.json())
        .then(j => j.data)
        .then(d => resolve(`${random(d)}/v1`));
    } catch (error) {
      reject(error);
    }
  });
}

export function artistSearch(endpoint: string, query: string): Promise<Response> {
  return fetch(`${endpoint}/users/search?query=${query}&app_name=Nuclear`);
}

export function getArtist(endpoint: string, id: string): Promise<Response> {
  return fetch(`${endpoint}/users/${id}?app_name=Nuclear`);
}

export function getArtistTracks(endpoint: string, id: string): Promise<Response> {
  return fetch(`${endpoint}/users/${id}/tracks?app_name=Nuclear`);
}

export function trackSearch(endpoint: string, query: string): Promise<Response> {
  return fetch(`${endpoint}/tracks/search?query=${query}&app_name=Nuclear`);
}

export function getTrack(endpoint: string, id: string): Promise<Response> {
  return fetch(`${endpoint}/tracks/${id}`);
}
