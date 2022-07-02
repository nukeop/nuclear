import DeezerPublicApi from 'deezer-public-api';

const deezer = new DeezerPublicApi();

export type DeezerTrack = {
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

export type DeezerPlaylist = {
  id: number;
  link: string;
  picture_big: string;
  picture_medium: string;
  title: string;
  tracklist: string;
}

export type DeezerPlaylistTracklist = DeezerTrack[];

export type DeezerArtist = {
  id: number;
  name: string;
  picture_big: string;
  picture_medium: string;
  type: 'artist';
}

export type DeezerAlbum = {
  id: number;
  title: string;
  cover_big: string;
  cover_medium: string;
  artist: DeezerArtist;
  type: 'album';
}

export type DeezerEditorialCharts = {
  albums: {
    data: DeezerAlbum[];
    total: number;
  };
  artists: {
    data: DeezerArtist[];
    total: number;
  };
  playlists: {
    data: DeezerPlaylist[];
    total: number;
  }
  podcasts?: unknown[];
  tracks: {
    data: DeezerTrack[];
    total: number;
  }
}

export const getChart = (): Promise<any> => deezer.chart();

export const getTopTracks = (limit = 50): Promise<{ data: DeezerTrack[] }> => {
  return (deezer.chart as any).tracks(limit);
};

export const getEditorialCharts = (limit=50): Promise<DeezerEditorialCharts> => deezer.editorial.charts(0, limit);

export const getPlaylistTracks = (playlistId: number, limit=50): Promise<{
    data: DeezerPlaylistTracklist;
}> => {
  return deezer.playlist.tracks(playlistId, limit);
};

export const mapDeezerTrackToInternal = (track: DeezerTrack) => ({
  ...track,
  name: track.title,
  thumbnail: track.artist.picture_medium
});
