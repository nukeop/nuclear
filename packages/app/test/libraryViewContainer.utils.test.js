import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import { sortTracks } from '../app/containers/LibraryViewContainer/utils';

let tracks;
describe('LibraryViewContainer utils tests', () => {
  beforeEach(() => {
    tracks = [
      {artist: {name: 'test'}, name: 'test', album: 'test'},
      {artist: {name: 'asd'}, name: 'asd', album: 'zxc'},
      {artist: {name: 'rty'}, name: 'fgh', album: 'vbn'},
      {artist: {name: 'qaz'}, name: 'wsx', album: 'edc'}
    ];
  });

  it('sorts by artist name', () => {
    let sorted = sortTracks(tracks, 'artist');
    expect(sorted).to.be.an('array');
    expect(sorted).to.deep.equal([
      {artist: {name: 'asd'}, name: 'asd', album: 'zxc'},
      {artist: {name: 'qaz'}, name: 'wsx', album: 'edc'},
      {artist: {name: 'rty'}, name: 'fgh', album: 'vbn'},
      {artist: {name: 'test'}, name: 'test', album: 'test'}
    ]);
  });

  it('sorts by track name', () => {
    let sorted = sortTracks(tracks, 'name');
    expect(sorted).to.be.an('array');
    expect(sorted).to.deep.equal([
      {artist: {name: 'asd'}, name: 'asd', album: 'zxc'},
      {artist: {name: 'rty'}, name: 'fgh', album: 'vbn'},
      {artist: {name: 'test'}, name: 'test', album: 'test'},
      {artist: {name: 'qaz'}, name: 'wsx', album: 'edc'}
    ]);
  });

  it('sorts by album name', () => {
    let sorted = sortTracks(tracks, 'album');
    expect(sorted).to.be.an('array');
    expect(sorted).to.deep.equal([
      {artist: {name: 'qaz'}, name: 'wsx', album: 'edc'},
      {artist: {name: 'test'}, name: 'test', album: 'test'},
      {artist: {name: 'rty'}, name: 'fgh', album: 'vbn'},
      {artist: {name: 'asd'}, name: 'asd', album: 'zxc'}
    ]);
  });
});
