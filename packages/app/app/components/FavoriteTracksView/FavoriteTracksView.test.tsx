
import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import FavoriteTracksView from '.';


describe('the Shuffle play button', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should queue all the favorite tracks', () => {
    const initialState = buildStoreState()
      .withFavorites()
      .build();
  
    const { component, store } = mountComponent(initialState);
    component.getByTestId('shuffle_play_button').click();
    const state = store.getState();

    expect(state.queue.queueItems.length).toEqual(initialState.favorites.tracks.length);
  });

  it('toggles the shuffle settings ', () => {
    const initialState = buildStoreState()
      .withFavorites()
      .withSettings({
        shuffleQueue: false
      })
      .build();

    const { component, store } = mountComponent(initialState);
    component.getByTestId('shuffle_play_button').click();
    const state = store.getState();
    
    expect(state.settings.shuffleQueue).toEqual(true);
  });

  it('does not toggle the shuffle when shuffle is already toggled', () => {
    const initialState = buildStoreState()
      .withFavorites()
      .withSettings({
        shuffleQueue: true
      })
      .build();

    const { component, store } = mountComponent(initialState);
    component.getByTestId('shuffle_play_button').click();
    const state = store.getState();
    
    expect(state.settings.shuffleQueue).toEqual(true);
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .build();

    const history = createMemoryHistory({
      initialEntries: ['/favorites/tracks']
    });
    const store = configureMockStore(initialState);
    const component = render(
      <TestRouterProvider
        history={history}
      >
        <TestStoreProvider
          store={store}
        >
          <FavoriteTracksView tracks={initialState.favorites.tracks} removeFavoriteTrack={() => {}}/>
        </TestStoreProvider>
      </TestRouterProvider >
    );
    return { component, history, store };
  };
});
