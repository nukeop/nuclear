
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

    const addOrRemove = async () => waitFor(
      () => component
        .getByTestId('favorite-icon-test track artist 1-test track title 1')
        .click()
    );

    await addOrRemove();

    let state = store.getState();
    expect(state.favorites.tracks).toEqual([
      expect.objectContaining({
        artist: 'test track artist 1',
        name: 'test track title 1'
      })
    ]);

    await addOrRemove();
    state = store.getState();

    expect(state.favorites.tracks).toEqual([]);
  });

  it('should display top tracks after going to top tracks tab', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/top tracks/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display genres after going to genres tab', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByText(/genres/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add all top tracks to the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/top tracks/i).click());
    await waitFor(() => component.getByText(/add all/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'top track artist 1',
        name: 'top track 1',
        thumbnail: 'top track thumbnail 1'
      }),
      expect.objectContaining({
        artist: 'top track artist 2',
        name: 'top track 2',
        thumbnail: 'top track thumbnail 2'
      })
    ]);
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
