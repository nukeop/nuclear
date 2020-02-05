import { string } from 'prop-types';

export type DiscogsImage = {
  height: number;
  width: number;
  resource_url: string;
  type: string;
}

export type DiscogsRelease = {
  resource_url?: string;
}

export type DiscogsSearchType = 'release' | 'master' | 'artist';

export type DiscogsPagination = {
  items: number;
  page: number;
  pages: number;
  per_page: number;
  urls: {
    last: string;
    next: string;
  };
}

export type DiscogsReleaseSearchResult = {
  id: number;
  cover_image: string;
  genre: string[];
  style: string[];
  resource_url: string;
  title: string;
  year: string;
}

export type DiscogsArtistSearchResult = {
  id: number;
  cover_image: string;
  resource_url: string;
  thumb: string;
  title: string;
}

export type DiscogsReleaseSearchResponse = {
  pagination: DiscogsPagination;
  results: DiscogsReleaseSearchResult[];
}

export type DiscogsArtistSearchResponse = {
  pagination: DiscogsPagination;
  results: DiscogsArtistSearchResult[];
}

export type DiscogsArtistInfo = {
  id: string;
  name: string;
  namevariations: string[];
  profile: string;
  releases_url: string;
  resource_url: string;
  images: DiscogsImage[];
}
