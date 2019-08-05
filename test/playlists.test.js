import { expect } from 'chai';

import {
  deletePlaylistInjectable
} from '../app/actions/playlists.injectable';

describe('Playlist actions tests', () => {
  it('deletes a track from a playlist', () => {
    const fakeStore = {
      get: () => ([
        { id: 'qwerty' },
        { id: 'asdf' },
        { id: 'abc' }
      ]),
      set: () => {}
    };
    
    const deletePlaylist = deletePlaylistInjectable(fakeStore);
    const playlists = deletePlaylist('abc');
    expect(playlists).to.eql([
      { id: 'qwerty' },
      { id: 'asdf' }
    ]);
  });
});
