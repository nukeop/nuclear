import React from 'react';

import SidebarMenuContainer from '.';
import { buildStoreState } from '../../../test/storeBuilders';
import { setupI18Next, mountComponent } from '../../../test/testUtils';

describe('Sidebar menu container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should render the sidebar menu', () => {
    const { component } = mountApp();
    const sidebar = component.getByTestId('sidebar-menu');

    expect(sidebar).toMatchSnapshot();
  });

  it.each([
    ['dashboard', /dashboard/i, 'dashboard'],
    ['downloads', /downloads/i, 'downloads'],
    ['favorite albums', /favorite albums/i, 'favorites/albums'],
    ['favorite tracks', /favorite tracks/i, 'favorites/tracks'],
    ['playlists', /playlists/i, 'playlists'],
    ['plugins', /plugins/i, 'plugins'],
    ['settings', /settings/i, 'settings'],
    ['search', /search/i, 'search'],
    ['lyrics', /lyrics/i, 'lyrics'],
    ['equalizer', /equalizer/i, 'equalizer'],
    ['visualizer', /visualizer/i, 'visualizer'],
    ['local library', /local library/i, 'library']
  ])('should go to %s on click', (text, regex, path) => {
    const { component, history } = mountApp();

    const visualizer = component.getByText(regex);
    visualizer.click();

    expect(history.location.pathname).toBe(`/${path}`);
  });

  const mountApp = () => mountComponent(
    <SidebarMenuContainer />,
    ['/'],
    buildStoreState()
      .build()
  );
});
