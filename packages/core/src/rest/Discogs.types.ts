type DiscogsImage = {
  height: number;
  width: number;
  resource_url: string;
  type: string;
}

type DiscogsArtistInfo = {
  id: string;
  namevariations: string[];
  profile: string;
  releases_url: string;
  resource_url: string;
  images: DiscogsImage[];
}