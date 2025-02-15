import { waitFor, screen } from '@testing-library/react';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next, uuidRegex } from '../../../test/testUtils';
import { ipcRenderer } from 'electron';
import userEvent from '@testing-library/user-event';

jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn()
  }
}));

describe('Library view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display an empty local library', () => {
    const initialState = buildStoreState()
      .withPlugins()
      .withConnectivity()
      .withLocal([])
      .build();
    const { component } = mountComponent(initialState);

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display local library in simple list mode', () => {
    const { component } = mountComponent();

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display local library in album grid mode', async () => {
    const { component } = mountComponent();
    const albumGridButton = await component.findByTestId('library-list-type-toggle-album-grid');
    await userEvent.click(albumGridButton);

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display local library in folder tree mode', async () => {
    const { component } = mountComponent();
    const folderTreeButton = await component.findByTestId('library-list-type-toggle-folder-tree');
    await userEvent.click(folderTreeButton);

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add a folder to the local library', async () => {
    const { component } = mountComponent();
    const addFoldersButton = await component.findByText(/add folders/i);
    await userEvent.click(addFoldersButton);

    expect(ipcRenderer.invoke).toHaveBeenCalledWith('open-path-picker', {
      properties: ['openDirectory', 'multiSelections']
    });
  });

  it('should add a track from the local library to the queue', async () => {
    const { component, store } = mountComponent();

    const triggers = await component.findAllByTestId('track-popup-trigger');
    await userEvent.click(triggers[0]);

    const addToQueueButton = await component.findByText(/add to queue/i);
    await userEvent.click(addToQueueButton);

    const state = store.getState();

    expect(state.queue.queueItems).toStrictEqual([
      expect.objectContaining({
        uuid: expect.stringMatching(uuidRegex),
        artist: 'local artist 1',
        name: 'local track 1',
        duration: 300,
        local: true
      })
    ]);
  });

  it('should not display the download button for tracks', async () => {
    const { component } = mountComponent();
    const triggers = await component.findAllByTestId('track-popup-trigger');
    await userEvent.click(triggers[0]);

    await component.findByText(/add to queue/i);

    expect(component.queryByText(/download/i)).toBeNull();
  });

  it('should not display the download all button for selected tracks', async () => {
    const { component } = mountComponent();
    const triggers = await component.findAllByTestId('track-popup-trigger');
    await userEvent.click(triggers[0]);
    
    const toggleAllButton = await component.findByTitle('Toggle All Rows Selected');
    await userEvent.click(toggleAllButton);
    
    const selectAllTrigger = await component.findByTestId('select-all-popup-trigger');
    await userEvent.click(selectAllTrigger);
    
    await component.findByText(/add selected to queue/i);

    expect(component.queryByText(/add selected to downloads/i)).toBeNull();
  });

  it('should add a track from the local library with the old format stream to the queue', async () => {
    const initialState = buildStoreState()
      .withPlugins()
      .withConnectivity()
      .withLocal([{
        uuid: 'local-track-1',
        artist: 'local artist 1',
        name: 'local track 1',
        duration: 250,
        path: '/path/to/local/track/1',
        local: true,
        streams: [{
          id: 'old-format-stream',
          source: 'Local',
          duration: 250,
          stream: 'file:///path/to/local/track/1'
        }]
      }])
      .build();
    const { component, store } = mountComponent(initialState);

    const triggers = await component.findAllByTestId('track-popup-trigger');
    await userEvent.click(triggers[0]);
    
    const addToQueueButton = await component.findByText(/add to queue/i);
    await userEvent.click(addToQueueButton);

    const state = store.getState();

    expect(state.queue.queueItems).toStrictEqual([
      expect.objectContaining({
        uuid: expect.stringMatching(uuidRegex),
        artist: 'local artist 1',
        name: 'local track 1',
        duration: 250,
        streams: [{
          id: 'old-format-stream',
          source: 'Local',
          duration: 250,
          stream: 'file:///path/to/local/track/1'
        }]
      })
    ]);
  });

  const mountComponent = mountedComponentFactory(
    ['/library'],
    buildStoreState()
      .withPlugins()
      .withConnectivity()
      .withLocal()
      .build()
  );
});
