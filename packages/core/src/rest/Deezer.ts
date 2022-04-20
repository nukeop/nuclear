import DeezerPublicApi from 'deezer-public-api';

const deezer = new DeezerPublicApi();

export type DeezerTopTrack = {
  id: number;
  title: string;
  position: number;
  duration: number;
  preview: string;
  artist: {
    name: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
  };
  album: {
    title: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
  };
}

export const getChart = (): Promise<any> => deezer.chart();

export const getTopTracks = (limit = 50): Promise<{ data: DeezerTopTrack[] }> => {
  return (deezer.chart as any).tracks(limit);
};

export const mapDeezerTrackToInternal = (track: DeezerTopTrack) => ({
  ...track,
  name: track.title,
  thumbnail: track.artist.picture_medium
});
