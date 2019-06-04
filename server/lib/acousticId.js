import fetch from 'node-fetch';
import { stringify } from 'querystring';

const API_KEY = 'Fivodjxo37';
const API_URL = 'https://api.acoustid.org/v2/lookup';

export default async ({ duration, fingerprint }) => {
  const res = await fetch(`${API_URL}?${stringify({
    format: 'json',
    meta: 'recordings',
    client: API_KEY,
    duration: duration,
    fingerprint: fingerprint
  })}`);

  const { results } = await res.json();

  return results;
};
