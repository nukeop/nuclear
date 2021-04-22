import DeezerPublicApi from 'deezer-public-api';

const deezer = new DeezerPublicApi();

type DeezerTopTrack = {
  id: number;
  title: string;
  position: number;
  preview: string;
  artist: {
    name: string;
    picture_small: string;
    picture_medium: string;
  };
}

export const getTopTracks = (limit = 50): { data: DeezerTopTrack[] } => {
  return deezer.chart.tracks(limit);
};

export const mapDeezerTrackToInternal = (track: DeezerTopTrack) => ({
  ...track,
  name: track.title,
  thumbnail: track.artist.picture_medium
});
