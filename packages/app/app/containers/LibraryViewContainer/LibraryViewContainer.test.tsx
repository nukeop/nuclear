import { waitFor } from '@testing-library/react';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

describe('Library view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display local library', () => {
    const { component } = mountComponent();

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
