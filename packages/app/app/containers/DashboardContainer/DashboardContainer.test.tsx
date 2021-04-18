
import { waitFor } from '@testing-library/react';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

describe('Dashboard container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display the best new music page of the dashboard', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to best new album review after clicking it', () => {
    const { component } = mountComponent();

    waitFor(() => component.getByText(/test title 2/i).click());

    expect(component.queryByText(/test review 2/i)).not.toBeNull();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should go to best new track review after clicking it', () => {
    const { component } = mountComponent();

    waitFor(() => component.getByText(/test track title 2/i).click());

    expect(component.queryByText(/track review 2/i)).not.toBeNull();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add/remove a best new track to favorites after clicking its star', async () => {
    const { component, store } = mountComponent();

    const addOrRemove = () => waitFor(
      () => component
        .getByTestId('favorite-icon-test track artist 1-test track title 1')
        .click()
    );

    await addOrRemove();

    const state = store.getState();
    expect(state.favorites.tracks).toEqual([
      expect.objectContaining({
        artist: {
          name: 'test track artist 1'
        },
        name: 'test track title 1'
      })
    ]);

    await addOrRemove();

    expect(state.favorites.tracks).toEqual([]);
  });

  it('should, display top tracks after going to top tracks tab', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/top tracks/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should, display genres after going to genres tab', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/genres/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountComponent = mountedComponentFactory(
    ['/dashboard'],
    buildStoreState()
      .withDashboard()
      .withPlugins()
      .withConnectivity()
      .build()
  );
});
