export type AudiusImage = {
  '150x150'?: string;
  '480x480'?: string;
  '1000x1000'?: string;
  '600x'?: string;
  '200x'?: string;
}

export type AudiusRelease = {
  resource_url?: string;
}

export type AudiusSearchType = 'release' | 'master' | 'artist';

export type AudiusReleaseSearchResult = {
  id: number;
  cover_image: string;
  genre: string[];
  style: string[];
  resource_url: string;
  title: string;
  year: string;
}

export type AudiusArtistReleaseSearchResult = {
  id: number;
  artist: string;
  title: string;
  thumb: string;
  resource_url: string;
  type: string;
  year: number;
}

export type AudiusArtistSearchResult = {
  id: string;
  cover_photo?: {
    '640x': string;
    '2000x': string;
  };
  profile_picture?: AudiusImage;
  handle: string;
  name: string;
}

export type AudiusReleaseSearchResponse = {
  results: AudiusReleaseSearchResult[];
}

export type AudiusArtistReleasesSearchResponse = {
  releases: AudiusArtistReleaseSearchResult[];
}

export type AudiusArtistSearchResponse = {
  data: AudiusArtistSearchResult[];
}

export type AudiusArtistInfo = {
  id: string;
  bio: string;
  name: string;
  cover_photo?: AudiusImage;
  profile: string;
  profile_picture?: AudiusImage;
}

export type AudiusReleaseInfo = {
  id: number;
  title: string;
  styles: string[];
  genres: string[];
  year: number;
  artists: {
    name: string;
    id: number;
  }[];
  cover_image: AudiusImage;
  thumb: AudiusImage;
  images: AudiusImage[];
  resource_url: string;
  tracklist: AudiusTrack[];
}

export type AudiusTrack = {
  duration: string;
  position: string;
  title: string;
}
