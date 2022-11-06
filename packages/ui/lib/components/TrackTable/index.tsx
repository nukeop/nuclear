/* eslint-disable react/jsx-key */
import React, { TableHTMLAttributes, useMemo } from 'react';
import cx from 'classnames';
import { useTable, Column, useRowSelect } from 'react-table';
import { isNumber, isString } from 'lodash';
import { DragDropContext, Droppable, Draggable, DragDropContextProps } from 'react-beautiful-dnd';

import DeleteCell from './Cells/DeleteCell';
import FavoriteCell from './Cells/FavoriteCell';
import PositionCell from './Cells/PositionCell';
import SelectionCell from './Cells/SelectionCell';
import ThumbnailCell from './Cells/ThumbnailCell';
import TitleCell from './Cells/TitleCell';
import TrackTableCell from './Cells/TrackTableCell';
import SelectionHeader from './Headers/SelectionHeader';
import { getTrackThumbnail } from '../TrackRow';
import { TrackTableColumn, TrackTableExtraProps, TrackTableHeaders, TrackTableSettings, TrackTableStrings } from './types';
import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { Track } from '../../types';
import { formatDuration } from '../..';
import { ThHTMLAttributes } from 'react';

export type TrackTableProps<T extends Track> = TrackTableExtraProps<T> &
  TrackTableHeaders &
  TrackTableSettings & {
    className?: string;
    tracks: T[];
    isTrackFavorite: (track: T) => boolean;
    onDragEnd?: DragDropContextProps['onDragEnd'];
    strings: TrackTableStrings;
    customColumns?: Column<T>[];
  }

function TrackTable<T extends Track>({
  className,
  tracks,
  customColumns=[],
  isTrackFavorite,
  onDragEnd,

  positionHeader,
  thumbnailHeader,
  artistHeader,
  titleHeader,
  albumHeader,
  durationHeader,

  displayHeaders = true,
  displayDeleteButton = true,
  displayPosition = true,
  displayThumbnail = true,
  displayFavorite = true,
  displayArtist = true,
  displayAlbum = true,
  displayDuration = true,
  displayCustom = true,
  selectable = true,

  ...extraProps
}: TrackTableProps<T>) {
  const shouldDisplayDuration = displayDuration && tracks.every(track => Boolean(track.duration));
  const columns = useMemo(() => [
    displayDeleteButton && {
      id: TrackTableColumn.Delete,
      Cell: DeleteCell
    },
    displayPosition && {
      id: TrackTableColumn.Position,
      Header: () => <span className={styles.center_aligned}>{positionHeader}</span>,
      accessor: 'position',
      Cell: PositionCell
    },
    displayThumbnail && {
      id: TrackTableColumn.Thumbnail,
      Header: () => <span className={styles.center_aligned}>{thumbnailHeader}</span>,
      accessor: (track) => getTrackThumbnail(track) || artPlaceholder,
      Cell: ThumbnailCell()
    },
    displayFavorite && {
      id: TrackTableColumn.Favorite,
      accessor: isTrackFavorite,
      Cell: FavoriteCell
    },
    {
      id: TrackTableColumn.Title,
      Header: titleHeader,
      accessor: (track) => track.title ?? track.name,
      Cell: TitleCell
    },
    displayArtist && {
      id: TrackTableColumn.Artist,
      Header: artistHeader,
      accessor: (track) => isString(track.artist)
        ? track.artist
        : track.artist.name,
      Cell: TrackTableCell
    },
    displayAlbum && {
      id: TrackTableColumn.Album,
      Header: albumHeader,
      accessor: 'album',
      Cell: TrackTableCell
    },
    shouldDisplayDuration && {
      id: TrackTableColumn.Duration,
      Header: durationHeader,
      accessor: track => {
        if (isString(track.duration)) {
          return track.duration;
        } else if (isNumber(track.duration)) {
          return formatDuration(track.duration);
        } else {
          return null;
        }
      },
      Cell: TrackTableCell
    },
    ...customColumns,
    selectable && {
      id: TrackTableColumn.Selection,
      Header: SelectionHeader,
      Cell: SelectionCell
    }
  ].filter(Boolean) as Column<T>[], [displayDeleteButton, displayPosition, displayThumbnail, displayFavorite, isTrackFavorite, titleHeader, displayArtist, artistHeader, displayAlbum, albumHeader, shouldDisplayDuration, durationHeader, selectable, positionHeader, thumbnailHeader]);

  const data = useMemo(() => tracks, [tracks]);

  const table = useTable<T>({ columns, data }, useRowSelect);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = table;

  return <table {...getTableProps() as TableHTMLAttributes<HTMLTableElement>} className={cx(className, styles.track_table)}>
    {
      displayHeaders && <thead>
        {
          headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps() as TableHTMLAttributes<HTMLTableRowElement>}>
              {
                headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps() as ThHTMLAttributes<HTMLTableCellElement>}>
                    {column.render('Header', extraProps)}
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
    }
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='track_table'>
        {(provided) => (

          <tbody
            ref={provided.innerRef}
            {...getTableBodyProps() as TableHTMLAttributes<HTMLTableSectionElement>}
            {...provided.droppableProps}
          >
            {
              rows.map(row => {
                prepareRow(row);
                return (
                  <Draggable
                    key={`${row.values[TrackTableColumn.Title]} ${row.index}`}
                    draggableId={`${row.values[TrackTableColumn.Title]} ${row.index}`}
                    index={row.index}
                    isDragDisabled={!onDragEnd}
                  >
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        className={cx({ [styles.is_dragging]: snapshot.isDragging })}
                        {...row.getRowProps() as TableHTMLAttributes<HTMLTableRowElement>}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {row.cells.map((cell, i) => (cell.render('Cell', { ...extraProps, key: i })))}
                      </tr>
                    )}
                  </Draggable>
                );
              })
            }
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  </table>;
}

export default TrackTable;
