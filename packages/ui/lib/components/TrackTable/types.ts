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
  Selection = 'selection',
  Date = 'date',
}

export type TrackTableExtraProps<T extends Track> = {
  onPlay?: (track: T) => void;
  onPlayNext?: (track: T) => void;
  onPlayAll?: (tracks: T[]) => void;
  onAddToQueue?: (track: T) => void;
  onAddToFavorites?: (track: T) => void;
  onRemoveFromFavorites?: (track: T) => void;
  onAddToPlaylist?: (track: T, { name }: { name: string }) => void;
  onCreatePlaylist?: (track: T, { name }: { name: string }) => void;
  onAddToDownloads?: (track: T) => void;
  onDelete?: (track: T, idx: number) => void;
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
  filterInputPlaceholder: string;
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
  displayHeaders?: boolean;
  displayDeleteButton?: boolean;
  displayPosition?: boolean;
  displayThumbnail?: boolean;
  displayFavorite?: boolean;
  displayArtist?: boolean;
  displayAlbum?: boolean;
  displayDuration?: boolean;
  displayCustom?: boolean;
  selectable?: boolean;
  searchable?: boolean;
};


