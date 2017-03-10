import Axios from 'axios';

const cheerio = require('cheerio');

const p4kUrl = 'http://pitchfork.com';

function getReviewDetails(reviewUrl, callback) {
  Axios.get(reviewUrl)
  .then((response) => {
    var $ = cheerio.load(response.data);
    var details = {};

    details.score = $('.score').text();
    details.abstract = $('.abstract>p').text();

    callback(details);
  });
}

function getBestNewAlbums(callback) {
  var parsedAlbums = [];

  Axios.get(p4kUrl + '/best/')
  .then((response) => {
    var $ = cheerio.load(response.data);
    var albums = $('#best-new-albums>div>ul').find('li>div.album-small');

    albums.map((i, el) => {
      var album = {};
      var el$ = cheerio.load(el);
      album.thumbnail = el$('div.artwork>img').attr('src');
      album.artist = el$('ul.artist-list').text();
      album.title = el$('h2.title').html();
      album.reviewUrl = p4kUrl + el$('a').attr('href');
      album.genres = el$('ul.genre-list').find('li>a').toArray().map((el, i) => {return el.children[0].data});

      var details = getReviewDetails(album.reviewUrl, (details) => {
        album.details = details;
        parsedAlbums.push(album);

        if (parsedAlbums.length==albums.length) {
          callback(parsedAlbums);
        }
      });
    });
  });

}

module.exports = {
  getBestNewAlbums: getBestNewAlbums
}
