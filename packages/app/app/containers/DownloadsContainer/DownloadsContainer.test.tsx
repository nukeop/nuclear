import { store as electronStore } from '@nuclear/core';
import { waitFor } from '@testing-library/dom';
import { ipcRenderer } from 'electron';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn()
  }
}));
jest.mock('electron-store');

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
    jest.clearAllMocks();
    (ipcRenderer.invoke as jest.Mock).mockResolvedValue( 'selected_directory' );
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

    expect(ipcRenderer.invoke).toHaveBeenNthCalledWith(1, 'get-download-path');
    expect(ipcRenderer.invoke).toHaveBeenNthCalledWith(2, 'open-path-picker', {
      properties: ['openDirectory'],
      title: 'Choose a directory...'
    });
    expect(ipcRenderer.invoke).toHaveBeenCalledTimes(2);
  });

  const mountComponent = mountedComponentFactory(
    ['/downloads'],
    initialStoreState
  );
});
