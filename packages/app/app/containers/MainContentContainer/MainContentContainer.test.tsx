import Sound from 'react-hifi';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';
import { startPlayback } from '../../actions/player';
import { nextSongAction } from '../../actions/queue';
import { toggleOption } from '../../actions/settings';
import { Setting } from '@nuclear/core';

describe('Main content container', () => {
  beforeAll(() => {
    setupI18Next();
  });
      
  it('should loop with multiple tracks in the queue', async () => {
    const { store } = mountComponent();
    
    let state = store.getState();
    store.dispatch(toggleOption({name: 'loopAfterQueueEnd'} as Setting, state.settings));
    store.dispatch(startPlayback(false));
    store.dispatch(nextSongAction());
    store.dispatch(nextSongAction());
    store.dispatch(nextSongAction());
    
    state = store.getState();
    expect(state.settings.loopAfterQueueEnd).toEqual(true);
    expect(state.queue.currentTrack).toEqual(0);
  });
    
  it('should loop with a single track in the queue', () => {
    const storeWithTracks = buildStoreState().withTracksInPlayQueue().build();
    const { store } = mountComponent(
      {
        ...buildStoreState()
          .withTracksInPlayQueue()
          .withSettings({
            loopAfterQueueEnd: false
          })
          .build(),
        queue: {
          currentTrack: 0,
          queueItems: [storeWithTracks.queue.queueItems[0]]
        }
      }
    );
    
    let state = store.getState();
    store.dispatch(toggleOption({name: 'loopAfterQueueEnd'} as Setting, state.settings));
    store.dispatch(startPlayback(false));
    store.dispatch(nextSongAction());
    
    state = store.getState();
    expect(state.settings.loopAfterQueueEnd).toEqual(true);
    expect(state.queue.currentTrack).toEqual(0);
    expect(state.player.seek).toEqual(0);
    expect(state.player.playbackStatus).toEqual(Sound.status.PLAYING);
  });

  const mountComponent = mountedComponentFactory(
    ['/'], 
    buildStoreState()
      .withTracksInPlayQueue()
      .withSettings({
        loopAfterQueueEnd: false
      })
      .build()
  );

});
