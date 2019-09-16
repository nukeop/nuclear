import { expect, should } from 'chai';
import { describe, it } from 'mocha';

import Artist from '../app/structs/artist';

describe.only('Artist structure tests', () => {
  it('Creates a new empty artist', () => {
    let artist = new Artist();
    should().not.exist(artist.name);
    should().not.exist(artist.description);
    should().not.exist(artist.tags);
    should().not.exist(artist.onTour);
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

    should().equal(artist.ids.discogs, 'test-discogs');
    should().equal(artist.name, 'test-name');
    should().equal(artist.description, 'test-desc');
    should().equal(artist.tags, ['test-tag1', 'test-tag2']);
    should().equal(artist.onTour, true);
    should().equal(artist.coverImage, 'test-cover');
    should().equal(artist.thumbnail, 'test-cover');
    should().equal(artist.images, ['test-img1', 'test-img2']);
    should().equal(artist.albums, ['test-album1', 'test-album2']);
    should().equal(artist.topTracks, ['test-track1', 'test-track2']);
    should().equal(artist.similarArtists, ['test-artist1', 'test-artist2']);
  });
});
