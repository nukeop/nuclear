import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { AnyProps, configureMockStore, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import { getMouseEvent } from '../../../test/mockMouseEvent';
import PlayerBarContainer from '.';
import { buildStoreState } from '../../../test/storeBuilders';

describe('PlayerBar container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display no time stamp if trackDuration is false', async () => {
    const { component } = mountComponent({
      settings: {
        trackDuration: false
      }
    });

    const timePlayed = component.queryByTestId('track-duration-played');
    expect(timePlayed).toBeNull();
  });

  it('should have an empty seekbar if the current track is still loading', () => {
    const { component } = mountComponent({
      queue: {
        queueItems: [{
          loading: true
        }]
      }
    });

    const fill = component.getByTestId('seekbar-fill');
    const timePlayed = component.queryByTestId('track-duration-played');
    const timeToEnd = component.queryByTestId('track-duration-to-end');

    expect(fill.style.width).toBe('0%');
    expect(timePlayed).toBeNull();
    expect(timeToEnd).toBeNull();
  });

  it('should show a loading play button if the current track is still loading', () => {
    const { component } = mountComponent({
      queue: {
        queueItems: [{
          loading: true
        }]
      }
    });

    const playButton = component.queryByTestId('player-controls-play');
    expect(playButton.children[0].className).toContain('circle notch');
  });

  it.each([
    ['loop', 'loopAfterQueueEnd'], 
    ['shuffle', 'shuffleQueue'],
    ['autoradio', 'autoradio'],
    ['mini-player', 'miniPlayer']
  ])('should enable %s option', async (option, setting) => {
    const { component, store } = mountComponent({
      settings: {
        loopAfterQueueEnd: false,
        shuffleQueue: false,
        autoradio: false,
        miniPlayer: false
      }
    });

    await waitFor(() => component.getByTestId(`${option}-play-option`).click());
    const state = store.getState();
    expect(state.settings[setting]).toBe(true);
  });

  // Has to be skipped until jsdom supports setting clientWidth on the body
  xit('should seek to a particular place in the current track when the seekbar is clicked', async () => {
    const { component, store } = mountComponent();

    const seekbar = await component.findByTestId('seekbar');
    fireEvent(seekbar, getMouseEvent('click', {
      pageX: 100
    }));
    const state = store.getState();

    const documentWidth = 200;
    // set document width to the above value here

    expect(state.player.seek).toBe(100 / documentWidth);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const store = configureMockStore({
      ...buildStoreState()
        .withTracksInPlayQueue()
        .withSettings({
          trackDuration: true
        })
        .build(),
      ...initialStore
    });

    const component = render(<TestStoreProvider
      store={store}
    >
      <PlayerBarContainer />
    </TestStoreProvider>);
    return { component, store };
  };
});
