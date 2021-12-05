import { store as electronStore } from '@nuclear/core';
import { waitFor } from '@testing-library/dom';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

const initialStoreState = 
buildStoreState()
  .withDownloads()
  .withPlugins()
  .withConnectivity()
  .build();

describe('Downloads container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    electronStore.set(
      'downloads',
      initialStoreState.downloads
    );
  });

  it('should display downloads', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should clear finished downloads', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText(/clear finished tracks/i).click());

    expect(component.queryByText(/test artist 1 - finished track/i)).toBeNull();
  });

  it('should remove a track', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getAllByTestId(/remove-download/i)[0].click());

    expect(component.queryByText(/test artist 1 - finished track/i)).toBeNull();
  });

  it('should pause a download in progress', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId(/download-action/i)[3].click());

    const state = store.getState();
    expect(state.downloads[3].status).toBe('Paused');
  });

  it('should resume a paused download', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId(/download-action/i)[2].click());

    const state = store.getState();
    expect(state.downloads[2].status).toBe('Waiting');
  });

  it('should retry a download with error', async () => {
    const { component, store } = mountComponent();
    await waitFor(() => component.getAllByTestId(/download-action/i)[1].click());

    const state = store.getState();
    expect(state.downloads[1].status).toBe('Waiting');
  });

  it('should set downloads dir', async () => {
    const { component } = mountComponent();
    await waitFor(() => component.getByText(/choose a directory.../i).click());

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const remote = require('electron').remote;
    expect(remote.dialog.showOpenDialog).toHaveBeenCalledWith({
      properties: ['openDirectory']
    });
  });

  const mountComponent = mountedComponentFactory(
    ['/downloads'],
    initialStoreState
  );
});
