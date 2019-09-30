import { stringify } from 'querystring';
import fpcalc from './fpcalc';

const API_KEY = 'Fivodjxo37';
const API_URL = 'https://api.acoustid.org/v2/lookup';

export default async (filePath) => {
  const { duration, fingerprint } = await fpcalc(filePath);

  const res = await fetch(`${API_URL}?${stringify({
    format: 'json',
    meta: 'recordings',
    client: API_KEY,
    duration,
    fingerprint
  })}`);

  const { results } = await res.json();

  return results;
};
