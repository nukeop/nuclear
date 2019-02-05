import { createHttpError } from 'builder-util-runtime';

const cheerio = require('cheerio');
const _ = require('lodash');
const request = require('request-promise');
const levenshtein = require('fast-levenshtein');

// export { default as LyricsSearch } from './LyricsSearch';

const textln = (html) => {
  // html.find('br').replaceWith('\n');
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
  html = html.replace(/\n/g, '<br>');
  return html;
};

const lyricsUrl = (title) => {
  return _.kebabCase(_.trim(_.toLower(_.deburr(title))));
};
const lyricsManiaUrl = (title) => {
  return _.snakeCase(_.trim(_.toLower(_.deburr(title))));
};
const lyricsManiaUrlAlt = (title) => {
  title = _.trim(_.toLower(title));
  title = title.replace('\'', '');
  title = title.replace(' ', '_');
  title = title.replace(/_+/g, '_');
  return title;
};

export function search (artistName, trackName) {
  let promises = [];

  /*
                        const reqWikia = request({
                          uri: 'http://lyrics.wikia.com/wiki/' + encodeURIComponent(artistName) + ':' + encodeURIComponent(trackName),
                          transform: (body) => {
                            return cheerio.load(body);
                          }
                        }).then(($) => {
                          return textln($('.lyricbox'));
                        });*/

  const reqParolesNet = request({
    uri: 'http://www.paroles.net/' + lyricsUrl(artistName) + '/paroles-' + lyricsUrl(trackName),
    transform: (body) => {
      return cheerio.load(body);
    }
  }).then(($) => {
    if ($('.song-text').length === 0) {
      // return Promise.reject();
      return Promise.resolve('');
    }
    return textln($('.song-text'));
  });


  /* const reqLyricsMania1 = request({
          uri: 'http://www.lyricsmania.com/' + lyricsManiaUrl(trackName) + '_lyrics_' + lyricsManiaUrl(artistName) + '.html',
          transform: (body) => {
            return cheerio.load(body);
          }
        }).then(($) => {
          if ($('.lyrics-body').length === 0) {
            // return Promise.reject();
            return Promise.resolve('');
          }
          return textln($('.lyrics-body'));
        });
      
        const reqLyricsMania2 = request({
          uri: 'http://www.lyricsmania.com/' + lyricsManiaUrl(trackName) + '_' + lyricsManiaUrl(artistName) + '.html',
          transform: (body) => {
            return cheerio.load(body);
          }
        }).then(($) => {
          if ($('.lyrics-body').length === 0) {
            // return Promise.reject();
            return Promise.resolve('');
          }
          return textln($('.lyrics-body'));
        });
      
        const reqLyricsMania3 = request({
          uri: 'http://www.lyricsmania.com/' + lyricsManiaUrlAlt(trackName) + '_lyrics_' + encodeURIComponent(lyricsManiaUrlAlt(artistName)) + '.html',
          transform: (body) => {
            return cheerio.load(body);
          }
        }).then(($) => {
          if ($('.lyrics-body').length === 0) {
            // return Promise.reject();
            return Promise.resolve('');
          }
          return textln($('.lyrics-body'));
        });*/

  /* const reqSweetLyrics = request({
                     method: 'POST',
                     uri: 'http://www.sweetslyrics.com/search.php',
                     form: {
                         search: 'trackName',
                         searchtext: trackName
                     },
                     transform: (body) => {
                         return cheerio.load(body);
                     }
                 }).then(($) => {
                     let closestLink, closestScore = -1;
                     _.forEach($('.search_results_row_color'), (e) => {
                         let artist = $(e).text().replace(/ - .+$/, '');
                         let currentScore = levenshtein.get(artistName, artist);
                         if (closestScore === -1 || currentScore < closestScore) {
                             closestScore = currentScore;
                             closestLink = $(e).find('a').last().attr('href');
                         }
                     });
                     if (!closestLink) {
                         return Promise.reject();
                     }
                     return request({
                         uri: 'http://www.sweetslyrics.com/' + closestLink,
                         transform: (body) => {
                             return cheerio.load(body);
                         }
                     });
                 }).then(($) => {
                     return textln($('.lyric_full_text'));
                 });*/


  // promises.push(reqWikia);
  promises.push(reqParolesNet);
  /* promises.push(reqLyricsMania1);
        promises.push(reqLyricsMania2);
        promises.push(reqLyricsMania3);*/
  // promises.push(reqSweetLyrics);

  return Promise.all(promises).then((lyrics) => {
    console.log(lyrics);
    return lyrics;
  });
  /* .catch(err => {
            console.log(err);
          });*/
}
