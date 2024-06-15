import '../../../__mocks__/AudioContext';
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { AnyProps, configureMockStore, TestStoreProvider } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';
import SoundContainer from '.';

describe('Sound Container - visualizer shuffle functionality', () => {
  it('Should change visualizer preset on song end, if the setting is enabled', async () => {
    const { store } = mountComponent({
      queue: {
        currentSong: 0,
        queueItems: [{
          artist: 'test artist 1',
          name: 'test track 1',
          streams: [{
            duration: 1,
            title: 'test track 1',
            skipSegments: [],
            stream: 'stream URL'
          }]
        }]
      },
      player: {
        playbackStatus: 'PLAYING'
      }
    });
    const state = store.getState();
    await waitFor(() => expect(state.settings['visualizer.preset']).not.toBe('test preset'), { timeout: 2000 });
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const store = configureMockStore({
      ...buildStoreState()
        .withTracksInPlayQueue()
        .withSettings({
          skipSponsorblock: true,
          ['visualizer.shuffle']: true,
          ['visualizer.preset']: 'test preset'
        })
        .build(),
      ...initialStore
    });

    const component = render(
      <TestStoreProvider store={store}>
        <SoundContainer />
      </TestStoreProvider>
    );
    return { component, store };
  };
});
