import { fireEvent} from '@testing-library/react';
import React from 'react';

import ShortcutsContainer from '.';
import { isMac } from '../../hooks/usePlatform';
import { AnyProps, setupI18Next, mountComponent } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Shortcut container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should start playing the current track when the f8 key is clicked on mac', async () => {
    const { store } = mountShortcuts();
    fireEvent.keyDown(document.body, {key: 'F8', code: 'F8', which: 119});
    const state = store.getState();
    if (isMac()){
      expect(state.player.playbackStatus).toBe('PLAYING');
    } else {
      expect(state.player.playbackStatus).toBe('PAUSED');
    }
  });

  it('should pause the current track when the f8 key is clicked and the song is currently playing on mac', async () => {
    const { store } = mountShortcuts({
      player: {
        playbackStatus: 'PLAYING'
      }
    });
    fireEvent.keyDown(document.body, {key: 'F8', code: 'F8', which: 119});
    const state = store.getState();
    if (isMac()){
      expect(state.player.playbackStatus).toBe('PAUSED');
    } else {
      expect(state.player.playbackStatus).toBe('PLAYING');
    }
  });

  it('should skip to the next track when the f9 is clicked on mac', async () => {
    const { store } = mountShortcuts();
    fireEvent.keyDown(document.body, {key: 'F9', code: 'F9', which: 120});
    const state = store.getState();
    if (isMac()){
      expect(state.queue.currentSong).toBe(1);
    } else {
      expect(state.queue.currentSong).toBe(0);
    }
        
  });

  it('should skip to the previous track when the f7 is clicked on mac', async () => {
    const { store } = mountShortcuts({
      queue: {
        currentSong: 1,
        queueItems: [{
          artist: 'test artist 1',
          name: 'test track 1',
          streams: [{
            duration: 300,
            title: 'test track 1',
            skipSegments: [],
            stream: 'stream URL 1'
          }]
        }, {
          artist: 'test artist 2',
          name: 'test track 2',
          streams: [{
            duration: 300,
            title: 'test track 2',
            skipSegments: [],
            stream: 'stream URL 2'
          }]
        }]
      },
      player: {
        seek: 0
      }
    });
    fireEvent.keyDown(document.body, {key: 'F7', code: 'F7', which: 118});
    const state = store.getState();
    if (isMac()){
      expect(state.player.seek).toBe(0);
      expect(state.queue.currentSong).toBe(0);
    } else {
      expect(state.player.seek).toBe(0);
      expect(state.queue.currentSong).toBe(1);
    }

  });

  const mountShortcuts = (initialStore?: AnyProps) => {
    return mountComponent(
      <ShortcutsContainer />,
      ['/'],
      {
        ...buildStoreState()
          .withTracksInPlayQueue()
          .withSettings({
            trackDuration: true,
            skipSponsorblock: true
          })
          .build(),
        ...initialStore
      }
    );
  };
});
