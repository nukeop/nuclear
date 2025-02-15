import { waitFor } from '@testing-library/react';
import { Deezer, LastFmApi } from '@nuclear/core/src/rest';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';
import userEvent from '@testing-library/user-event';

jest.mock('@nuclear/core/src/rest');
jest.mock('@nuclear/core');

describe('Dashboard container', () => {
  beforeAll(() => {
    setupI18Next();
    process.env.NUCLEAR_SERVICES_URL = 'http://nuclear.services.url';
    process.env.NUCLEAR_SERVICES_ANON_KEY = 'nuclear-services-anon-key';
  });

  beforeEach(() => {
    const mockState = buildStoreState().withDashboard().build();
    (Deezer.getTopTracks as jest.Mock).mockResolvedValue({ data: mockState.dashboard.topTracks });
    (Deezer.getEditorialCharts as jest.Mock).mockResolvedValue(mockState.dashboard.editorialCharts.data);
    (LastFmApi.prototype.getTopTags as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        toptags: {
          tag: mockState.dashboard.topTags
        }
      })
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should display the trending music', async () => {
    const { component, store } = mountComponent();
    
    await waitFor(() => {
      const state = store.getState();
      return state.dashboard.topTracks.length > 0 && 
             state.dashboard.editorialCharts.isReady;
    });
    
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display top tracks after going to top tracks tab', async () => {
    const { component, store } = mountComponent();
    
    await waitFor(() => {
      const state = store.getState();
      return state.dashboard.topTracks.length > 0;
    });

    await waitFor(() => component.getByText(/top tracks/i).click());
    
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should display genres after going to genres tab', async () => {
    const { component, store } = mountComponent();
    
    await waitFor(() => {
      const state = store.getState();
      return state.dashboard.topTags.length > 0;
    });

    await waitFor(() => component.getByText(/genres/i).click());
    
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should add a single track to the queue', async () => {
    const { component, store } = mountComponent();
    
    await waitFor(() => {
      const state = store.getState();
      return state.dashboard.topTracks.length > 0;
    });

    await waitFor(() => component.getByText(/top tracks/i).click());
    
    const trackRows = await waitFor(() => component.getAllByTestId('track-table-row'));
    const firstTrackRow = trackRows[0];
    const menuTrigger = firstTrackRow.querySelector('[data-testid="track-popup-trigger"]');
    await waitFor(() => userEvent.click(menuTrigger));
    
    await waitFor(() => component.getByText(/Add to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'top track artist 1',
        name: 'top track 1',
        thumbnail: 'top track album cover 1'
      })
    ]);
  });

  it('should add all top tracks to the queue', async () => {
    const { component, store } = mountComponent();

    await waitFor(() => component.getByText(/Top tracks/i).click());
    await waitFor(() => component.getByTitle(/Toggle All Rows Selected/i).click());
    await waitFor(() => component.getByTestId('select-all-popup-trigger').click());
    await waitFor(() => component.getByText(/Add selected to queue/i).click());

    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      expect.objectContaining({
        artist: 'top track artist 1',
        name: 'top track 1',
        thumbnail: 'top track album cover 1'
      }),
      expect.objectContaining({
        artist: 'top track artist 2',
        name: 'top track 2',
        thumbnail: 'top track album cover 2'
      })
    ]);
  });

  const mountComponent = mountedComponentFactory(
    ['/dashboard'],
    buildStoreState()
      .withDashboard()
      .withPlugins()
      .withConnectivity()
      .withSettings({
        promotedArtists: true
      })
      .build()
  );
});
