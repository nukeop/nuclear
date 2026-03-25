import { TrackTableProps } from './types';

export const defaultFeatures: TrackTableProps['features'] = {
  header: true,
  filterable: true,
  sortable: true,
  reorderable: false,
  playAll: false,
  addAllToQueue: false,
  favorites: true,
  contextMenu: true,
};
export const defaultDisplay: TrackTableProps['display'] = {
  displayDeleteButton: false,
  displayPosition: false,
  displayThumbnail: true,
  displayFavorite: false,
  displayArtist: true,
  displayDuration: true,
  displayQueueControls: true,
};
