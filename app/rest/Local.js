import logger from 'electron-timber';
import { getOption } from '../persistence/store';

export function localSearch(body) {
  return fetch(`http://127.0.0.1:${getOption('api.port')}/nuclear/file/search`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(logger.error);
}
