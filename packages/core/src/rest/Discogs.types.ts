export type DiscogsImage = {
  height: number;
  width: number;
  resource_url: string;
  uri: string;
  type: string;
}

export type DiscogsRelease = {
  resource_url?: string;
}

export type DiscogsSearchType = 'release' | 'master' | 'artist';

export type DiscogsSearchArgs = {
  [key: string]: string | string[];
}

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

export type DiscogsArtistReleaseSearchResult = {
  id: number;
  artist: string;
  title: string;
  thumb: string;
  resource_url: string;
  type: string;
  year: number;
}

export type DiscogsArtistSearchResult = {
  id: number;
  name: string;
  cover_image: string;
  resource_url: string;
  thumb: string;
  title: string;
}

export type DiscogsReleaseSearchResponse = {
  pagination: DiscogsPagination;
  results: DiscogsReleaseSearchResult[];
}

export type DiscogsArtistReleasesSearchResponse = {
  pagination: DiscogsPagination;
  releases: DiscogsArtistReleaseSearchResult[];
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

export type DiscogsReleaseInfo = {
  id: number;
  title: string;
  styles: string[];
  genres: string[];
  year: number;
  artists: {
    name: string;
    id: number;
  }[];
  cover_image: DiscogsImage;
  thumb: DiscogsImage;
  images: DiscogsImage[];
  resource_url: string;
  tracklist: DiscogsTrack[];
}

export type DiscogsTrackType = 'track' | 'heading' | 'index';

export type DiscogsTrack = {
  duration: string;
  position: string;
  title: string;
  extraartists?: {
    name: string;
  }[];
  sub_tracks?: DiscogsTrack[];
  type_: DiscogsTrackType;
}
