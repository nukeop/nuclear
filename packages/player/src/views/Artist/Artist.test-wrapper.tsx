import { RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchWrapper } from '../Search/Search.test-wrapper';

const user = userEvent.setup();

export const ArtistWrapper = {
  async mount(header: string): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test artist');
    const artistLink = await screen.findByText('Test Artist');
    await user.click(artistLink);
    await screen.findByRole('heading', {
      name: new RegExp(header),
    });
    return component;
  },
  async mountNoWait(): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test artist');
    const artistLink = await screen.findByText('Test Artist');
    await user.click(artistLink);
    await new Promise((resolve) => setTimeout(resolve, 0));
    return component;
  },

  getHeader: (name: string) => screen.getByRole('heading', { name }),

  bioHeader: {
    get skeleton() {
      return screen.queryByTestId('artist-header-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-header-skeleton');
    },
  },

  socialHeader: {
    get element() {
      return screen.queryByTestId('artist-social-header');
    },
    get skeleton() {
      return screen.queryByTestId('artist-social-header-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-social-header-skeleton');
    },
  },

  popularTracks: {
    get heading() {
      return screen.getByRole('heading', { name: /popular tracks/i });
    },
    get table() {
      return screen.queryByRole('table');
    },
    get skeleton() {
      return screen.queryByTestId('popular-tracks-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('popular-tracks-skeleton');
    },
  },

  similarArtists: {
    get heading() {
      return screen.getByRole('heading', { name: /similar artists/i });
    },
    get items() {
      return screen.queryAllByRole('listitem');
    },
    get skeleton() {
      return screen.queryByTestId('similar-artists-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('similar-artists-skeleton');
    },
    inspectItem(listItem: HTMLElement) {
      const utils = within(listItem);
      return {
        img: utils.queryByRole('img'),
        name: utils.getByText(/.+/),
      };
    },
  },

  albums: {
    get cards() {
      return screen.queryAllByTestId('card');
    },
    get skeleton() {
      return screen.queryByTestId('artist-albums-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-albums-skeleton');
    },
  },

  playlists: {
    get skeleton() {
      return screen.queryByTestId('artist-playlists-skeleton');
    },
    async findSkeleton() {
      return screen.findByTestId('artist-playlists-skeleton');
    },
  },

  async toggleFavorite() {
    const button = await screen.findByTestId('artist-favorite-button');
    await user.click(button);
  },
};
