import { fireEvent} from '@testing-library/react';
import React from 'react';

import ShortcutsContainer from '.';
import { isMac } from '../../hooks/usePlatform';
import { AnyProps, setupI18Next, mountComponent } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';

jest.mock('../../hooks/usePlatform');

describe('Shortcut container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should start playing the current track when the f8 key is clicked on mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(true);
    const { store } = mountShortcuts();
    fireEvent.keyDown(document.body, {key: 'F8', code: 'F8', which: 119});
    const state = store.getState();
    expect(state.player.playbackStatus).toBe('PLAYING');
  });

  it('should pause the current track when the f8 key is clicked and the song is currently playing on mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(true);
    const { store } = mountShortcuts({
      player: {
        playbackStatus: 'PLAYING'
      }
    });
    fireEvent.keyDown(document.body, {key: 'F8', code: 'F8', which: 119});
    const state = store.getState();
    expect(state.player.playbackStatus).toBe('PAUSED');
  });

  it('should skip to the next track when the f9 is clicked on mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(true);
    const { store } = mountShortcuts();
    fireEvent.keyDown(document.body, {key: 'F9', code: 'F9', which: 120});
    const state = store.getState();
    expect(state.queue.currentTrack).toBe(1);
  });

  it('should skip to the previous track when the f7 is clicked on mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(true);
    const { store } = mountShortcuts({
      queue: {
        currentTrack: 1,
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
    expect(state.player.seek).toBe(0);
    expect(state.queue.currentTrack).toBe(0);
  });

  it('should not start playing the current track when the f8 key is clicked and the os is not mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(false);
    const { store } = mountShortcuts();
    fireEvent.keyDown(document.body, {key: 'F8', code: 'F8', which: 119});
    const state = store.getState();
    expect(state.player.playbackStatus).toBe('PAUSED');
  });

  it('should not pause the current track when the f8 key is clicked and the song is currently playing, when the os is not mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(false);
    const { store } = mountShortcuts({
      player: {
        playbackStatus: 'PLAYING'
      }
    });
    fireEvent.keyDown(document.body, {key: 'F8', code: 'F8', which: 119});
    const state = store.getState();
    expect(state.player.playbackStatus).toBe('PLAYING');
  });

  it('should not skip to the next track when f9 is clicked and the os is not mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(false);
    const { store } = mountShortcuts();
    fireEvent.keyDown(document.body, {key: 'F9', code: 'F9', which: 120});
    const state = store.getState();
    expect(state.queue.currentTrack).toBe(0);
  });

  it('should not skip to the previous track when f7 is clicked and the os is not mac', async () => {
    (isMac as jest.Mock).mockReturnValueOnce(false);
    const { store } = mountShortcuts({
      queue: {
        currentTrack: 1,
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
    expect(state.player.seek).toBe(0);
    expect(state.queue.currentTrack).toBe(1);
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
