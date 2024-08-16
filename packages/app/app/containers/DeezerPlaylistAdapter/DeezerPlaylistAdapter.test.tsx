/* eslint-disable @typescript-eslint/ban-ts-comment */
import { rest } from '@nuclear/core';

import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

jest.mock('@nuclear/core/src/rest');

describe('Deezer playlist adapter', () => {
  beforeAll(() => {
    setupI18Next();

    // @ts-ignore
    rest.Deezer = {
      getEditorialCharts: jest.fn().mockResolvedValue({
        playlists: {
          data: [{
            id: 1,
            title: 'Playlist 1'
          }]
        }
      })
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should display a Deezer playlist', async () => {
    const { component } = mountComponent();
    await component.findByTestId('playlist-view');
    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountComponent = mountedComponentFactory(
    ['/playlists/deezer/1'],
    buildStoreState()
      .withDashboard()
      .withPlugins()
      .withConnectivity()
      .build()
  );
});
