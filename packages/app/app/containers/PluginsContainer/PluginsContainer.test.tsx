import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { ipcRenderer } from 'electron';

import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, configureMockStore, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';
import MainContentContainer from '../MainContentContainer';

jest.mock('fs');
jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn().mockResolvedValue(['test file.txt'])
  }
}));

describe('Plugins container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display plugins', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should be able to change the streaming provider plugin', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByText(/Test Stream Provider/i)[0].click());
    await waitFor(() => component.getByText(/Different Stream Provider/i).click());

    const state = store.getState();
    expect(state.plugin.selected.streamProviders).toEqual('Different Stream Provider');
  });

  it('should be able to change the metadata provider plugin', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByText(/Test Meta Provider/i)[0].click());
    await waitFor(() => component.getByText(/Another Meta Provider/i).click());

    const state = store.getState();
    expect(state.plugin.selected.metaProviders).toEqual('Another Metadata Provider');
  });

  it('should be able to change the lyrics provider plugin', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByText(/Test Lyrics Provider/i)[0].click());
    await waitFor(() => component.getByText(/Different Lyrics Provider/i).click());

    const state = store.getState();
    expect(state.plugin.selected.lyricsProviders).toEqual('Different Lyrics Provider');
  });

  it('should be able to load a user plugin', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByText(/Add a plugin/i)[0].click());

    const state = store.getState();
    
    await waitFor(() => expect(ipcRenderer.invoke).toHaveBeenCalledWith('open-file-picker', {
      filters: [{
        name: 'Javascript files',
        extensions: ['js', 'jsx']
      }]
    }));
    expect(state.plugin.userPlugins['test file.txt']).toEqual(
      expect.objectContaining({
        path: 'test file.txt'
      })
    );
  });

  it('should display loaded user plugins', async () => {
    const state = buildStoreState()
      .withPlugins()
      .build();

    state.plugin = {
      ...state.plugin,
      userPlugins: {
        'test file.txt': {
          path: 'test file.txt',
          name: 'test plugin',
          author: 'test author',
          description: 'test plugin description',
          image: null
        }
      }
    };

    const { component } = mountComponent(state);

    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
      buildStoreState()
        .withPlugins()
        .build();

    const history = createMemoryHistory({
      initialEntries: ['/plugins']
    });

    const store = configureMockStore(initialState);

    const component = render(
      <TestRouterProvider
        history={history}
      >
        <TestStoreProvider
          store={store}
        >
          <MainContentContainer />
        </TestStoreProvider>
      </TestRouterProvider >
    );

    return { component, history, store };
  };
});
