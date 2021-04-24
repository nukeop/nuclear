import DeezerPublicApi from 'deezer-public-api';

const deezer = new DeezerPublicApi();

export type DeezerTopTrack = {
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

export const getChart = (): Promise<any> => deezer.chart();

export const getTopTracks = (limit = 50): Promise<{ data: DeezerTopTrack[] }> => {
  return deezer.chart.tracks(limit);
};

export const mapDeezerTrackToInternal = (track: DeezerTopTrack) => ({
  ...track,
  name: track.title,
  thumbnail: track.artist.picture_medium
});
