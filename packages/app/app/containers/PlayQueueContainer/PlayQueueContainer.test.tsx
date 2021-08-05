// import { fireEvent, waitFor } from '@testing-library/react';
import { mountedPlayQueueFactory, setupI18Next } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';
import { fireEvent, waitFor } from '@testing-library/react';

describe('Play Queue container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should display with track in queue', async () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display a context popup on right click', async () => {
    const { component } = mountComponent();
    const track = component.getByTestId('queue-popup-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should copy original track url to clipboard', async () => {
    const { component } = mountComponent();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const clipboard = require('electron').clipboard;

    const track = component.getByTestId('queue-popup-uuid1');
    await waitFor(() => fireEvent.contextMenu(track));
    await waitFor(() => component.getByTestId('copy-original-url').click());
    expect(clipboard.writeText).toHaveBeenCalledWith('https://test-track-original-url');
  });

  it('should not display copy button', async () => {
    const { component } = mountComponent();
    const track = component.getByTestId('queue-popup-uuid2');
    await waitFor(() => fireEvent.contextMenu(track));
    const copyButton = component.queryByTestId('copy-original-url');
    expect(copyButton).toEqual(null);
  });

  const mountComponent = mountedPlayQueueFactory(
    ['/dashboard'],
    buildStoreState()
      .withTrackInPlayQueue()
      .withPlugins()
      .withConnectivity()
      .build()
  );
});
