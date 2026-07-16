import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { HashIcon, Heart, ImageIcon, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import { pickArtwork, Track } from '@nuclearplayer/model';

import { formatTimeMillis } from '../../../utils/time';
import { FavoriteCell } from '../Cells/FavoriteCell';
import { PositionCell } from '../Cells/PositionCell';
import { RemoveCell } from '../Cells/RemoveCell';
import { TextCell } from '../Cells/TextCell';
import { ThumbnailCell } from '../Cells/ThumbnailCell';
import { TitleCell } from '../Cells/TitleCell';
import { IconHeader } from '../Headers/IconHeader';
import { TextHeader } from '../Headers/TextHeader';
import { TrackTableProps } from '../types';

export function useColumns<T extends Track = Track>(
  props: Pick<TrackTableProps<T>, 'display' | 'labels' | 'actions'>,
): ColumnDef<T>[] {
  const { display, labels, actions } = props;
  const columnHelper = createColumnHelper<T>();

  const showFavorite =
    display?.displayFavorite && Boolean(actions?.onToggleFavorite);
  const showDelete = display?.displayDeleteButton && Boolean(actions?.onRemove);

  const columns: ColumnDef<T>[] = useMemo(
    () => [
      showFavorite &&
        columnHelper.display({
          id: 'favorite',
          header: (context) => <IconHeader Icon={Heart} context={context} />,
          cell: FavoriteCell,
        }),
      display?.displayPosition &&
        columnHelper.accessor((track) => track.trackNumber, {
          id: 'position',
          enableSorting: true,
          header: (context) => <IconHeader Icon={HashIcon} context={context} />,
          cell: PositionCell,
        }),
      display?.displayThumbnail &&
        columnHelper.accessor(
          (track) => pickArtwork(track.artwork, 'thumbnail', 40),
          {
            id: 'thumbnail',
            header: (context) => (
              <IconHeader Icon={ImageIcon} context={context} />
            ),
            cell: ThumbnailCell,
            enableSorting: false,
          },
        ),
      columnHelper.accessor((track) => track.artists[0].name, {
        id: 'artist',
        enableSorting: true,
        header: (context) => (
          <TextHeader context={context}>{labels.headers.artist}</TextHeader>
        ),
        cell: TextCell,
      }),
      columnHelper.accessor((track) => track.title, {
        id: 'title',
        enableSorting: true,
        header: (context) => (
          <TextHeader context={context}>{labels.headers.title}</TextHeader>
        ),
        cell: TitleCell,
      }),
      display?.displayAlbum &&
        columnHelper.accessor((track) => track.album?.title, {
          id: 'album',
          enableSorting: true,
          header: (context) => (
            <TextHeader context={context}>{labels.headers.album}</TextHeader>
          ),
          cell: TextCell,
        }),
      display?.displayDuration &&
        columnHelper.accessor((track) => formatTimeMillis(track.durationMs), {
          id: 'duration',
          enableSorting: true,
          header: (context) => (
            <TextHeader context={context}>{labels.headers.duration}</TextHeader>
          ),
          cell: TextCell,
        }),
      showDelete &&
        columnHelper.display({
          id: 'delete',
          header: (context) => <IconHeader Icon={Trash2} context={context} />,
          cell: RemoveCell,
        }),
    ],
    [labels, display, showFavorite, showDelete],
  ).filter(Boolean) as ColumnDef<T>[];

  return columns;
}
