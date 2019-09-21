import { expect } from 'chai';
import { describe, it } from 'mocha';

import Artist from '../app/structs/artist';
let should = require('chai').should();

describe('Artist structure tests', () => {
  it('Creates a new empty artist', () => {
    let artist = new Artist();
    should.not.exist(artist.name);
    should.not.exist(artist.description);
    should.not.exist(artist.tags);
    should.not.exist(artist.onTour);
  });

  it('Creates a new artist with all parameters', () => {
    let artist = new Artist({
      ids: { discogs: 'test-discogs' },
      name: 'test-name',
      description: 'test-desc',
      tags: ['test-tag1', 'test-tag2'],
      onTour: true,
      coverImage: 'test-cover',
      thumbnail: 'test-thumb',
      images: ['test-img1', 'test-img2'],
      albums: ['test-album1', 'test-album2'],
      topTracks: ['test-track1', 'test-track2'],
      similarArtists: ['test-artist1', 'test-artist2']
    });
    should.equal(artist.ids.discogs, 'test-discogs');
    should.equal(artist.name, 'test-name');
    should.equal(artist.description, 'test-desc');
    expect(artist.tags).to.eql(['test-tag1', 'test-tag2']);
    should.equal(artist.onTour, true);
    should.equal(artist.coverImage, 'test-cover');
    should.equal(artist.thumbnail, 'test-thumb');
    expect(artist.images).to.eql(['test-img1', 'test-img2']);
    expect(artist.albums).to.eql(['test-album1', 'test-album2']);
    expect(artist.topTracks).to.eql(['test-track1', 'test-track2']);
    expect(artist.similarArtists).to.eql(['test-artist1', 'test-artist2']);
  });

  it('Creates an artist from Discogs search data', () => {
    let artist = Artist.fromDiscogsSearchData({
      id: 'test-id',
      title: 'test-title',
      cover_image: 'test-cover',
      thumb: 'test-thumb'
    });
    should.equal(artist.ids.discogs, 'test-id');
    should.equal(artist.name, 'test-title');
    should.equal(artist.coverImage, 'test-cover');
    should.equal(artist.thumbnail, 'test-thumb');
  });

  it('Creates an artist from Discogs data', () => {
    let artist = Artist.fromDiscogsData({
      id: 'test-id',
      name: 'test-name',
      profile: 'test-desc',
      images: ['test-img1', 'test-img2']
    });
    should.equal(artist.ids.discogs, 'test-id');
    should.equal(artist.name, 'test-name');
    should.equal(artist.description, 'test-desc');
    expect(artist.images).to.eql(['test-img1', 'test-img2']);
  });

  it('Creates an artist from Last.fm data', () => {
    let artist = Artist.fromLastfmData({
      mbid: 'test-id',
      name: 'test-name',
      bio: {content: 'test-desc'},
      tags: {tag: [{name: 'test-tag1'}, {name: 'test-tag2'}]},
      ontour: 1,
      similar: {artist: [{name: 'test-artist1'}, {name: 'test-artist2'}]}
    });
    should.equal(artist.ids.musicbrainz, 'test-id');
    should.equal(artist.name, 'test-name');
    should.equal(artist.description, 'test-desc');
    should.equal(artist.onTour, true);
    expect(artist.tags).to.eql(['test-tag1', 'test-tag2']);
    expect(artist.similarArtists).to.eql(['test-artist1', 'test-artist2']);
  });
});
