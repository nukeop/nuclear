import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { rest } from '@nuclear/core';

import SearchBoxContainer from '.';
import { AnyProps, configureMockStore, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';


describe('Search box container', () => {
  beforeAll(() => {
    setupI18Next();
    jest.useFakeTimers();
  });

  it('should render the search box', () => {
    const { component } = mountComponent();

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should search after pressing enter', () => {
    const { component, store } = mountComponent();
    const searchInput = component.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', keyCode: 13 });

    const state = store.getState();
    expect(state.search.searchHistory).toEqual(['test']);
    expect(state.plugin.plugins.metaProviders[0].searchForArtists).toHaveBeenCalledWith('test');
    expect(state.plugin.plugins.metaProviders[0].searchForReleases).toHaveBeenCalledWith('test');
    expect(state.plugin.plugins.metaProviders[0].searchForPodcast).toHaveBeenCalledWith('test');

    const lastfmApi = new rest.LastFmApi('test', 'test');
    expect(lastfmApi.searchTracks).toHaveBeenCalledWith('test');
    expect(rest.Youtube.urlSearch).toHaveBeenCalledWith('test');
    expect(rest.Youtube.liveStreamSearch).toHaveBeenCalledWith('test');
  });

  it('should select the metadata provider from the dropdown', () => {
    const { component, store } = mountComponent();
    component.getAllByText('Test Metadata Provider')[0].click();
    component.getByText('Another Metadata Provider').click();

    const state = store.getState();
    expect(state.plugin.selected.metaProviders).toEqual('Another Metadata Provider');
  });

  it('should clear the input on pressing the clear button', async () => {
    const { component } = mountComponent();
    const searchInput = component.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await component.getByTestId('search-box-clear').click();

    expect(component.queryByDisplayValue('test')).not.toBeInTheDocument();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
            buildStoreState()
              .withPlugins()
              .build();
    const store = configureMockStore(initialState);
    const component = render(
      <TestStoreProvider store={store}>
        <SearchBoxContainer />
      </TestStoreProvider>
    );

    return {
      component,
      store
    };
  };
});
