export type LastfmImage = {
  '#text': string;
  size: string;
}

export type LastfmArtistShort = {
  name: string;
  url: string;
}

export type LastfmTag = {
  name: string;
  url: string;
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
