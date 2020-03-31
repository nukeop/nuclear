export type MusicbrainzArtist = {
  id: string;
  name: string;
}

export type MusicbrainzReleaseGroup = {
  id: string;
  title: string;
  releases: MusicbrainzRelease[];
}

export type MusicbrainzTrack = {
  id: string;
  length: number;
  number: string;
  position: number;
  title: string;
};

export type MusicbrainzMedia = {
  position: number;
  'track-count': number;
  tracks: MusicbrainzTrack[];
}

export type MusicbrainzGenre = {
  name: string;
  count: number;
};

export type MusicbrainzRelease = {
  id: string;
  title: string;
  date: string;
  status: string;
  media?: MusicbrainzMedia[];
  genres?: MusicbrainzGenre[];
}

export type MusicbrainzArtistResponse = {
  artists: Array<MusicbrainzArtist>;
};

export type MusicbrainzReleaseGroupResponse = {
  ['release-groups']: Array<MusicbrainzReleaseGroup>;
};

export type MusicbrainzTrackResponse = {
  tracks: Array<MusicbrainzTrack>;
};
