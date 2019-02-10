import logger from 'electron-timber';
import lyrics from 'simple-get-lyrics';

export function search (artistName, trackName) {
  return lyrics.search(artistName, trackName)
    .then(result => result.lyrics).catch(function (err) {
      logger.log('error', err);
    });
}
