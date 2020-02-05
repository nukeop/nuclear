export type DiscogsImage = {
  height: number;
  width: number;
  resource_url: string;
  type: string;
}

export type DiscogsRelease = {
  resource_url?: string;
}

export type DiscogsSearchType =  'release' | 'master' | 'artist';

export type DiscogsArtistInfo = {
  id: string;
  name: string;
  namevariations: string[];
  profile: string;
  releases_url: string;
  resource_url: string;
  images: DiscogsImage[];
}