import { HashIcon, ImageIcon } from 'lucide-react';

import { TrackTableLabels } from './types';

export const defaultTrackTableLabels: TrackTableLabels = {
  headers: {
    positionHeader: <HashIcon />,
    thumbnailHeader: <ImageIcon />,
    artistHeader: 'Artist',
    titleHeader: 'Title',
    albumHeader: 'Album',
    durationHeader: 'Duration',
  },
  playNow: 'Play now',
  addToQueue: 'Add to queue',
  playNext: 'Play next',
  favorite: 'Add to favorites',
  unfavorite: 'Remove from favorites',
  contextMenu: 'More actions',
  selectAll: 'Select all tracks',
  reorderUnavailableDueToSort: 'Reordering disabled while sorted',
  reorderUnavailableDueToFilter: 'Reordering disabled while filtering',
  keyboardInstructions: 'Use arrow keys to navigate and space to select',
  dragHandleLabel: 'Drag to reorder',
  playAll: 'Play all',
  addAllToQueue: 'Add all to queue',
};

export function mergeLabels(
  partial?: Partial<TrackTableLabels>,
): TrackTableLabels {
  if (!partial) {
    return defaultTrackTableLabels;
  }
  return { ...defaultTrackTableLabels, ...partial };
}
