require('isomorphic-fetch');
import core from 'nuclear-core';
import globals from '../app/globals';

const billboard = require('../app/rest/Billboard');
const lastfm = new core.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

describe('Billboard api tests', () => {
  it('tests exports', () => {
    expect(typeof billboard).toBe('object');
    expect(billboard).toHaveProperty('getTop');
    expect(billboard).toHaveProperty('lists');
  });

  it('gets a pop songs list', async () => {
    const songs = (await billboard.getTop(billboard.lists.genres[0].link)).songs;
    expect(songs).toHaveLength(40);
  });
});

describe('Last.fm api tests', () => {
  it('tests exports', () => {
    expect(typeof lastfm).toBe('object');
  });

  it('tests getting top tags', async () => {
    return lastfm.getTopTags()
      .then(response => response.json())
      .then(results => {
        expect(typeof results).toBe('object');
        expect(results.toptags).toHaveProperty('tag');
        const sample = results.toptags.tag[0];
        expect(typeof sample).toBe('object')
        expect(Object.keys(sample)).toEqual(expect.arrayContaining(['name', 'count', 'reach']));
      });
  });

  it('tests getting tag info', async () => {
    return lastfm.getTagInfo('indie')
      .then(response => response.json())
      .then(results => {
        expect(typeof results).toBe('object');
        expect(results).toHaveProperty('tag');
        expect(typeof results.tag).toBe('object');
        expect(Object.keys(results.tag)).toEqual(expect.arrayContaining([
          'name',
          'total',
          'reach',
          'wiki'
        ]));
      });
  });

  it('tests getting top tag tracks', async () => {
    return lastfm.getTagTracks('indie')
      .then(response => response.json())
      .then(results => {
        expect(typeof results).toBe('object');
        expect(results.tracks).toHaveProperty('track');
        const sample = results.tracks.track[0];
        expect(typeof sample).toBe('object');
        expect(Object.keys(sample)).toEqual(expect.arrayContaining([
          'name',
          'artist',
          'duration',
          'streamable',
          'mbid',
          'url',
          'image',
          '@attr'
        ]));
      });
      
  });

  it('tests getting top tag albums', async () => {
    return lastfm.getTagAlbums('indie')
      .then(response => response.json())
      .then(results => {
        expect(typeof results).toBe('object');
        expect(results.albums).toHaveProperty('album');
        const sample = results.albums.album[0];
        expect(typeof sample).toBe('object');
        expect(Object.keys(sample)).toEqual(expect.arrayContaining([
          'name',
          'mbid',
          'url',
          'artist',
          'image',
          '@attr'
        ]));
      });
      
  });

  it('tests getting top tag artists', async () => {
    return lastfm.getTagArtists('indie')
      .then(response => response.json())
      .then(results => {
        expect(typeof results).toBe('object');
        expect(results.topartists).toHaveProperty('artist');
        const sample = results.topartists.artist[0];
        expect(typeof sample).toBe('object');
        expect(Object.keys(sample)).toEqual(expect.arrayContaining([
          'name',
          'mbid',
          'url',
          'streamable',
          'image',
          '@attr'
        ]));
      });
  });

  it('tests getting similar tags', async () => {
    return lastfm.getSimilarTags('electronic')
      .then(response => response.json())
      .then(results => {
        expect(typeof results).toBe('object');
        expect(results).toHaveProperty('similartags');
      });
  });

});
