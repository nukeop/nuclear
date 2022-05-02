import { waitFor } from '@testing-library/react';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

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

  const mountComponent = mountedComponentFactory(
    ['/library'],
    buildStoreState()
      .withPlugins()
      .withConnectivity()
      .withLocal()
      .build()
  );
});
