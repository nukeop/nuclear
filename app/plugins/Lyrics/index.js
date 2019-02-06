import logger from 'electron-timber';

const cheerio = require('cheerio');
const _ = require('lodash');
import * as Promise from 'bluebird';

const textln = (html) => {
  html.find('br').replaceWith('\n');
  html.find('img').replaceWith('');
  html.find('h2').replaceWith('');
  html.find('script').replaceWith('');
  html.find('#video-musictory').replaceWith('');
  html.find('strong').replaceWith('');
  html = _.trim(html.text());
  html = html.replace(/\r\n\n/g, '\n');
  html = html.replace(/\t/g, '');
  html = html.replace(/\n\r\n/g, '\n');
  html = html.replace(/ +/g, ' ');
  html = html.replace(/\n /g, '\n');
  return html;
};

const lyricsUrl = (title) => {
  return _.kebabCase(_.trim(_.toLower(_.deburr(title))));
};
const lyricsManiaUrl = (title) => {
  return _.snakeCase(_.trim(_.toLower(_.deburr(title))));
};

function checkStatus (response) {
  if (response.status !== 200 || !response.ok) {
    let error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
  return Promise.resolve(response);
}

function getLyricsText (url, selector) {
  return fetch(url)
    .then(response => checkStatus(response))
    .then(response => response.text())
    .then(html => cheerio.load(html))
    .then(($) => {
      if ($(selector).length === 0) {
        let error = new Error('No text was found');
        error.response = $;
        return Promise.reject(error);
      }
      return textln($(selector));
    })
    .catch(function (err) {
      let error = new Error('Unable to get the lyrics');
      error.response = err;
      return Promise.reject(error);
    });
}

export function search (artistName, trackName) {
  let promises = [];

  const reqParolesNet = getLyricsText('http://www.paroles.net/' + lyricsUrl(artistName) + '/paroles-' + lyricsUrl(trackName), '.song-text');
  const reqWikia = getLyricsText('http://lyrics.wikia.com/wiki/' + encodeURIComponent(artistName) + ':' + encodeURIComponent(trackName), '.lyricbox');
  const reqLyricsMania1 = getLyricsText('http://www.lyricsmania.com/' + lyricsManiaUrl(trackName) + '_lyrics_' + lyricsManiaUrl(artistName) + '.html', '.lyrics-body');

  promises.push(reqParolesNet);
  promises.push(reqWikia);
  promises.push(reqLyricsMania1);

  return Promise.any(promises).then((lyrics) => {
    return lyrics;
  })
    .catch(err => {
      // logger.log(err);
    });
}
