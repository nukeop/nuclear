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
  let _finishPlayingCallback: () => void;

  const MockReactHifi = ({ onFinishedPlaying }: { onFinishedPlaying: () => void }) => {
    _finishPlayingCallback = onFinishedPlaying;
    return null;
  };

  MockReactHifi.status = {
    PAUSED: 'PAUSED'
  };

  const _default = jest.fn().mockImplementation(MockReactHifi);
  (_default as unknown as ReactHiFiMock['default']).status = {
    PAUSED: 'PAUSED'
  };

  return {
    ...jest.requireActual('react-hifi'),
    __esModule: true,
    default: _default,
    finishPlaying: () => {
      if (_finishPlayingCallback) {
        _finishPlayingCallback();
      }
    },
    finishPlayingCallback: () => _finishPlayingCallback
  };
});

type ReactHiFiMock = {
  default: React.FC<{ onFinishedPlaying: () => void }> & {
    status: {
      PAUSED: 'PAUSED'
    }
  };
  finishPlaying: () => void;
  finishPlayingCallback: () => void;
}

describe('Sound Container - visualizer shuffle functionality', () => {
  it('Should change visualizer preset on song end, if the setting is enabled', async () => {
    const { store, component } = mountSoundContainer();
    let state = store.getState();
    const reactHifiMock = (await import('react-hifi')) as unknown as ReactHiFiMock;

    await waitFor(() => expect(state.settings['visualizer.preset']).toBe('test preset'));
    
    await waitFor(async () => expect(reactHifiMock.finishPlayingCallback()).toBeDefined());
    await waitFor(async () => expect(reactHifiMock.finishPlaying).toBeDefined());

    reactHifiMock.finishPlaying();

    state = store.getState();
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
