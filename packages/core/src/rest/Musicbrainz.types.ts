export type MusicbrainzArtist = {
  id: string;
  name: string;
}

export type MusicbrainzRelease = {
  id: string;
  title: string;
}

export type MusicbrainzTrack = {
  id: string;
}

export type MusicbrainzArtistResponse = {
  artists: Array<MusicbrainzArtist>;
};

export type MusicbrainzReleaseResponse = {
  ['release-groups']: Array<MusicbrainzRelease>;
};

export type MusicbrainzTrackResponse = {
  tracks: Array<MusicbrainzTrack>;
};
