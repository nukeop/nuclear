import { waitFor } from '@testing-library/react';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory } from '../../../test/testUtils';

describe('Listening history container', () => {

  it('renders the listening history', () => {
    const { component } = mountComponent();

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('fetches the most recent items on entering the listening history view', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/recently played/i));
  });

  const mountComponent = mountedComponentFactory(
    ['/listening-history'],
    buildStoreState()
      .withConnectivity()
      .build()
  );
});
