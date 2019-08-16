import { expect } from 'chai';

import {
  deletePlaylistInjectable,
  updatePlaylistInjectable
} from '../app/actions/playlists.injectable';

describe('Playlist actions tests', () => {
  const createFakeStore = () => ({
      get: () => ([
        { id: 'qwerty' },
        { id: 'asdf' },
        { id: 'abc' }
      ]),
      set: () => {}
  });
  
  it('deletes a track from a playlist', () => {
    const fakeStore = createFakeStore();
    const deletePlaylist = deletePlaylistInjectable(fakeStore);
    const playlists = deletePlaylist('abc');
    expect(playlists).to.eql([
      { id: 'qwerty' },
      { id: 'asdf' }
    ]);
  });

  it('replaces a playlist', () => {
    const fakeStore = createFakeStore();
    const updatePlaylist = updatePlaylistInjectable(fakeStore);
    const playlists = updatePlaylist({
      id: 'abc',
      tracks: [ 4, 8, 15 ]
    });
    expect(playlists).to.eql([
      { id: 'qwerty' },
        { id: 'asdf' },
      {
        id: 'abc',
        tracks: [ 4, 8, 15 ]
      }
    ]);
  });
});
