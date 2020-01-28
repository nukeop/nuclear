type MusicbrainzArtist = {
  id: string;
  name: string;
}

type MusicbrainzRelease = {
  id: string;
  title: string;
}

type MusicbrainzTrack = {
  id: string;
}

type MusicbrainzArtistResponse = {
  artists: Array<MusicbrainzArtist>;
};

type MusicbrainzReleaseResponse = {
  ['release-groups']: Array<MusicbrainzRelease>;
};

type MusicbrainzTrackResponse = {
  tracks: Array<MusicbrainzTrack>;
};
