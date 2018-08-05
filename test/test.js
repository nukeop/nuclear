require('isomorphic-fetch');
import assert from 'assert';
import { expect } from 'chai';
import core from 'nuclear-core';
import globals from '../app/globals';

var billboard = require('../app/rest/Billboard');
var lastfm = new core.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

describe('Billboard api tests', () => {
  it('tests exports', () => {
    expect(billboard).to.be.an('object');
    expect(billboard).to.have.property('getTop');
    expect(billboard).to.have.property('lists');
  });

  it('gets a pop songs list', () => {
    billboard.getTop(billboard.lists.genres[0].link)
    .then(songs => {
      expect(songs).to.be.an('array').that.has.lengthOf(40);
    })
    .catch(err => {
      console.error(err);
    });
  });
});

describe('Last.fm api tests', () => {
  it('tests exports', () => {
    expect(lastfm).to.be.an('object');
  });

  it('tests getting top tags', () => {
    lastfm.getTopTags()
    .then(response => response.json())
    .then(results => {
      expect(results).to.be.an('object').that.has.nested.property('toptags.tag');
      var sample = results.toptags.tag[0];
      expect(sample).to.be.an('object').that.has.all.keys('name', 'count', 'reach');
    });
  });

  it('tests getting tag info', () => {
    lastfm.getTagInfo('indie')
    .then(response => response.json())
    .then(results => {
      expect(results).to.be.an('object').that.has.property('tag');
      expect(results.tag).to.be.an('object').that.has.all.keys(
        'name',
        'total',
        'reach',
        'wiki'
      );
    })
    .catch(err => {
      console.error(err);
    });
  });

  it('tests getting top tag tracks', () => {
    lastfm.getTagTracks('indie')
    .then(response => response.json())
    .then(results => {
      expect(results).to.be.an('object').that.has.nested.property('tracks.track');
      var sample = results.tracks.track[0];
      expect(sample).to.be.an('object').that.has.all.keys(
        'name',
        'artist',
        'duration',
        'streamable',
        'mbid',
        'url',
        'image',
        '@attr'
      );
    })
    .catch(err => {
      console.error(err);
    });
  });

  it('tests getting top tag albums', () => {
    lastfm.getTagAlbums('indie')
    .then(response => response.json())
    .then(results => {
      expect(results).to.be.an('object').that.has.nested.property('albums.album');
      var sample = results.albums.album[0];
      expect(sample).to.be.an('object').that.has.all.keys(
        'name',
        'mbid',
        'url',
        'artist',
        'image',
        '@attr'
      );
    })
    .catch(err => {
      console.error(err);
    });
  });

  it('tests getting top tag artists', () => {
    lastfm.getTagArtists('indie')
    .then(response => response.json())
    .then(results => {
      expect(results).to.be.an('object').that.has.nested.property('topartists.artist');
      var sample = results.topartists.artist[0];
      expect(sample).to.be.an('object').that.has.all.keys(
        'name',
        'mbid',
        'url',
        'streamable',
        'image',
        '@attr'
      );
    })
    .catch(err => {
      console.error(err);
    });
  });

  it('tests getting similar tags', () => {
    lastfm.getSimilarTags('electronic')
    .then(response => response.json())
    .then(results => {
      expect(results).to.be.an('object').that.has.property('similartags');
    })
    .catch(err => {
      console.error(err);
    });
  });

});
