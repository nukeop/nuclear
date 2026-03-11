import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { SearchWrapper } from '../Search/Search.test-wrapper';

const user = userEvent.setup();

export const AlbumWrapper = {
  async mount(header: string): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test album');
    const albums = await screen.findAllByTestId('card');
    if (albums.length === 0) {
      throw new Error('No albums found in search results');
    }
    await user.click(albums[0]!);
    await screen.findByText(header);
    return component;
  },
  async mountNoWait(): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test album');
    const albums = await screen.findAllByTestId('card');
    if (albums.length === 0) {
      throw new Error('No albums found in search results');
    }
    await user.click(albums[0]!);
    await new Promise((r) => setTimeout(r, 0));
    return component;
  },
  async mountDirectly(
    url: string = '/album/test-metadata-provider/album-1',
  ): Promise<RenderResult> {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const history = createMemoryHistory({ initialEntries: [url] });
    const router = createRouter({ routeTree, history });
    const component = render(
      <App queryClientProp={queryClient} routerProp={router} />,
    );
    await screen.findByTestId('album-view');

    return component;
  },
  getHeader: (name: string) => screen.getByRole('heading', { name }),
  getTracksTable: () => screen.queryByRole('table'),
  getTracks: () => screen.queryAllByTestId('track-row'),
  async addTrackToQueueByTitle(title: string) {
    const allTracks = await screen.findAllByTestId('track-row');
    const trackRow = allTracks.find((row) => row.textContent?.includes(title));
    await user.click(within(trackRow!).getByTestId('add-to-queue-button'));
  },
  async toggleFavorite() {
    const button = await screen.findByTestId('album-favorite-button');
    await user.click(button);
  },
  async openTrackContextMenu(trackTitle: string) {
    const allTracks = await screen.findAllByTestId('track-row');
    const trackRow = allTracks.find((row) =>
      row.textContent?.includes(trackTitle),
    );

    await user.click(
      within(trackRow!).getByTestId('track-context-menu-button'),
    );
    await screen.findByText('Play now');
  },
  async toggleTrackFavoriteViaContextMenu(trackTitle: string) {
    await this.openTrackContextMenu(trackTitle);
    const addButton = screen.queryByText('Add to favorites');
    const removeButton = screen.queryByText('Remove from favorites');
    const button = addButton || removeButton;

    await user.click(button!);
  },
  async addTrackToQueueViaContextMenu(trackTitle: string) {
    await this.openTrackContextMenu(trackTitle);
    await user.click(screen.getByText('Add to queue'));
  },
};
