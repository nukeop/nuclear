import React from 'react';
import { waitFor } from '@testing-library/react';

import { AnyProps, mountComponent } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';
import SoundContainer from '.';

jest.mock('react-hls-player', () => {
  return {
    __esModule: true,
    default: () => <div />
  };
});

jest.mock('react-hifi', () => {
  let finishPlayingCallback: () => void;

  const MockReactHifi = ({ onFinishedPlaying }: { onFinishedPlaying: () => void }) => {
    finishPlayingCallback = onFinishedPlaying;
    return null;
  };

  MockReactHifi.status = {
    PAUSED: 'PAUSED'
  };

  return {
    ...jest.requireActual('react-hifi'),
    __esModule: true,
    default: jest.fn().mockImplementation(MockReactHifi),
    status: {
      PAUSED: 'PAUSED'
    },
    finishPlaying: () => {
      if (finishPlayingCallback) {
        finishPlayingCallback();
      }
    },
    finishPlayingCallback
  };
});

type ReactHiFiMock = {
  default: React.FC<{ onFinishedPlaying: () => void }>;
  finishPlaying: () => void;
  finishPlayingCallback: () => void;
}

describe('Sound Container - visualizer shuffle functionality', () => {
  it('Should change visualizer preset on song end, if the setting is enabled', async () => {
    const { store, component } = mountSoundContainer();
    const state = store.getState();
    const reactHifiMock = (await import('react-hifi')) as unknown as ReactHiFiMock;

    await waitFor(() => expect(state.settings['visualizer.preset']).toBe('test preset'));
    
    await waitFor(() => expect(reactHifiMock.finishPlayingCallback).toBeDefined());
    await waitFor(() => expect(reactHifiMock.finishPlaying).toBeDefined());

    reactHifiMock.finishPlaying();

    await waitFor(() => expect(state.settings['visualizer.preset']).not.toBe('test preset'), { timeout: 2000 });
  });

  const mountSoundContainer = (initialStore?: AnyProps) => {
    const initialState = initialStore ?? {
      ...buildStoreState()
        .withTracksInPlayQueue()
        .withPlayer({playbackStatus: 'PLAYING'})
        .withSettings({
          skipSponsorblock: true,
          ['visualizer.shuffle']: true,
          ['visualizer.preset']: 'test preset'
        })
        .build()
    };

    return mountComponent(<SoundContainer />, ['/'], initialState);
  };
});
