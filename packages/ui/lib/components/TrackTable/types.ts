import { Track } from '../../types';

export enum TrackTableColumn {
  Position = 'position',
  Thumbnail = 'thumbnail',
  Favorite = 'favorite',
  Title = 'title',
  Artist = 'artist',
  Album = 'album',
  Duration = 'duration',
  Selection = 'selection'
}

export type TrackTableExtraProps = {
  onPlay?: (track: Track) => void;
  onAddToQueue?: (track: Track) => void;
  onAddToFavorites?: (track: Track) => void;
  onAddToPlaylist?: (track: Track, { name: string }) => void;
  onAddToDownloads?: (track: Track) => void;
  playlists?: Array<{
    name: string;
  }>;
}
