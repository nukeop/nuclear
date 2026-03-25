import { FC, ReactNode } from 'react';

import { Track } from '@nuclearplayer/model';

export interface TrackTableLabels {
  headers: {
    positionHeader: React.ReactNode;
    thumbnailHeader: React.ReactNode;
    artistHeader: string;
    titleHeader: string;
    albumHeader: string;
    durationHeader: string;
  };
  playNow: string;
  addToQueue: string;
  playNext: string;
  favorite: string;
  unfavorite: string;
  contextMenu: string;
  selectAll: string;
  reorderUnavailableDueToSort: string;
  reorderUnavailableDueToFilter: string;
  keyboardInstructions: string;
  dragHandleLabel: string;
  playAll: string;
  addAllToQueue: string;
}

export type TrackTableClasses = {
  root?: string;
};

export type TrackTableActions<T extends Track = Track> = {
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onPlayNow?: (track: T) => void;
  onPlayNext?: (track: T) => void;
  onAddToQueue?: (track: T) => void;
  onToggleFavorite?: (track: T) => void;
  onRemove?: (track: T, index: number) => void;
  onPlayAll?: () => void;
  onAddAllToQueue?: () => void;
};

export type ContextMenuWrapperProps<T extends Track = Track> = {
  track: T;
  children: ReactNode;
};

export type TrackTableProps<T extends Track = Track> = {
  tracks: T[];
  getItemId?: (track: T, index: number) => string;
  customColumns?: unknown[];
  features?: {
    header?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    selectable?: boolean;
    reorderable?: boolean;
    favorites?: boolean;
    playAll?: boolean;
    addAllToQueue?: boolean;
    contextMenu?: boolean;
  };
  display?: {
    displayDeleteButton?: boolean;
    displayPosition?: boolean;
    displayThumbnail?: boolean;
    displayFavorite?: boolean;
    displayArtist?: boolean;
    displayAlbum?: boolean;
    displayDuration?: boolean;
    displayQueueControls?: boolean;
  };
  actions: TrackTableActions<T>;
  meta?: {
    isTrackFavorite?: (track: T) => boolean;
    ContextMenuWrapper?: FC<ContextMenuWrapperProps<T>>;
  };
  rowHeight?: number;
  overscan?: number;
  classes?: TrackTableClasses;
  labels?: Partial<TrackTableLabels>;
  'aria-label'?: string;
};
