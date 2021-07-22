import { Track } from '../../types';
import { TrackPopupStrings } from '../TrackPopup';

export enum TrackTableColumn {
  Delete = 'delete',
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
  onPlayNext?: (track: Track) => void;
  onPlayAll?: (tracks: Track[]) => void;
  onAddToQueue?: (track: Track) => void;
  onAddToFavorites?: (track: Track) => void;
  onRemoveFromFavorites?: (track: Track) => void;
  onAddToPlaylist?: (track: Track, { name: string }) => void;
  onAddToDownloads?: (track: Track) => void;
  onDelete?: (track: Track, idx: number) => void;
  playlists?: Array<{
    name: string;
  }>;
  popupActionStrings?: TrackPopupStrings
}

export type TrackTableStrings = {
  addSelectedTracksToQueue: string;
  playSelectedTracksNow: string;
  addSelectedTracksToFavorites: string;
  addSelectedTracksToDownloads: string;
  tracksSelectedLabelSingular: string;
  tracksSelectedLabelPlural: string;
}

export type TrackTableHeaders = {
  positionHeader: React.ReactNode;
  thumbnailHeader: React.ReactNode;
  artistHeader: string;
  titleHeader: string;
  albumHeader: string;
  durationHeader: string;
}

export type TrackTableSettings = {
  displayDeleteButton?: boolean;
  displayPosition?: boolean;
  displayThumbnail?: boolean;
  displayFavorite?: boolean;
  displayArtist?: boolean;
  displayAlbum?: boolean;
  displayDuration?: boolean;
  selectable?: boolean;
};


