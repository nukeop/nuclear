export type LastfmImage = {
  '#text': string;
  size: '' | 'small' | 'medium' | 'large' | 'extralarge' | 'mega';
}

export type LastfmArtistShort = {
  name: string;
  url: string;
  image: LastfmImage[];
}

export type LastfmTag = {
  name: string;
  url: string;
  reach: number;
  taggings: number;
  wiki: { 
    summary: string;
    content: string;
  };
}

export type LastFmArtistInfo = {
  name: string;
  mbid: string;
  url: string;
  image: LastfmImage[];
  stats: {
    listeners: number;
    playcount: number;
  };
  similar: { artist: LastfmArtistShort[] };
  tags: { tag: LastfmTag[] };
  ontour: '0' | '1';
  streamable: '0' | '1';
  bio: {
    summary: string;
    content: string;
  };
}

export type LastfmTrack = {
  name: string;
  playcount: number;
  listeners: number;
  artist: LastfmArtistShort;
  '@attr': { rank: string };
}

export type LastfmTopTracks = {
  track: LastfmTrack[];
  '@attr': {
    artist: 'string';
  };
}

export type LastfmTrackMatch = {
  name: string;
  mbid: string;
  url: string;
  streamable: string;
  artist: string;
  image: LastfmImage[];
  listeners: string;
}

export type LastfmTagTopTrack = LastfmTrackMatch & {
  artist: {name: string;}
};

export type LastfmTrackMatchInternal  = LastfmTrackMatch & { thumbnail: string }

export type LastfmTopTag = {
  name: string
  count: number
  reach: number
}

export type LastfmAlbum = {
  name: string;
  mbid: string;
  url: string;
  artist: string;
  image: LastfmImage[];
}
