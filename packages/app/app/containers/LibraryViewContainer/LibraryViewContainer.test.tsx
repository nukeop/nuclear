import { waitFor } from '@testing-library/react';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next, uuidRegex } from '../../../test/testUtils';

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

  it('should display local library in album grid mode', () => {
    const { component } = mountComponent();

    waitFor(() => component.getByTestId('library-list-type-toggle-album-grid').click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display local library in folder tree mode', () => {
    const { component } = mountComponent();

    waitFor(() => component.getByTestId('library-list-type-toggle-folder-tree').click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add a folder to the local library', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/add folders/i).click());

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const remote = require('electron').remote;
    expect(remote.dialog.showOpenDialog).toHaveBeenCalledWith(
      'currentWindow',
      {
        properties: ['openDirectory', 'multiSelections']
      }
    );
  });

  it('should add a track from the local library to the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    await waitFor(() => component.getByText(/add to queue/i).click());

    const state = store.getState();

    expect(state.queue.queueItems).toStrictEqual([
      expect.objectContaining({
        uuid: expect.stringMatching(uuidRegex),
        artists: ['local artist 1'],
        name: 'local track 1',
        duration: 300,
        local: true
      })
    ]);
  });

  it('should not display the download button for tracks', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    await component.findByText(/add to queue/i);

    expect(component.queryByText(/download/i)).toBeNull();
  });

  it('should not display the download all button for selected tracks', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    await waitFor(() => component.getByTitle('Toggle All Rows Selected').click());
    await waitFor(() => component.getByTestId('select-all-popup-trigger').click());
    await component.findByText(/add selected to queue/i);

    expect(component.queryByText(/add selected to downloads/i)).toBeNull();
  });

  it('should add a track from the local library with the old format stream to the queue', async () => {
    const initialState = buildStoreState()
      .withPlugins()
      .withConnectivity()
      .withLocal([{
        uuid: 'local-track-1',
        artists: ['local artist 1'],
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

    await waitFor(() => component.getAllByTestId('track-popup-trigger')[0].click());
    await waitFor(() => component.getByText(/add to queue/i).click());

    const state = store.getState();

    expect(state.queue.queueItems).toStrictEqual([
      expect.objectContaining({
        uuid: expect.stringMatching(uuidRegex),
        artists: ['local artist 1'],
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
