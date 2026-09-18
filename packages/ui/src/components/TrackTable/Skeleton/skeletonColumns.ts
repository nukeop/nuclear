import { TrackTableProps, TrackTableSkeletonColumnKind } from '../types';

export type SkeletonColumn = {
  id: string;
  kind: TrackTableSkeletonColumnKind;
};

type SkeletonColumnDefinition = SkeletonColumn & {
  visible?: boolean;
};

export const getSkeletonColumns = (
  display: NonNullable<TrackTableProps['display']>,
): SkeletonColumn[] => {
  const columns: SkeletonColumnDefinition[] = [
    { id: 'favorite', kind: 'icon', visible: display.displayFavorite },
    { id: 'position', kind: 'icon', visible: display.displayPosition },
    { id: 'thumbnail', kind: 'thumbnail', visible: display.displayThumbnail },
    { id: 'artist', kind: 'text', visible: true },
    { id: 'title', kind: 'text', visible: true },
    { id: 'album', kind: 'text', visible: display.displayAlbum },
    { id: 'duration', kind: 'text', visible: display.displayDuration },
    { id: 'delete', kind: 'icon', visible: display.displayDeleteButton },
  ];

  return columns
    .filter((column) => column.visible)
    .map(({ id, kind }) => ({ id, kind }));
};
