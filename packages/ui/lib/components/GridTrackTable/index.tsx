import { Column, Row, TableInstance, TableOptions, TableState, UseSortByInstanceProps, UseSortByState, useRowSelect, useSortBy, useTable } from 'react-table';
import React, { useMemo, memo } from 'react';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { TrackTableColumn, TrackTableExtraProps, TrackTableHeaders, TrackTableSettings, TrackTableStrings } from '../TrackTable/types';
import { TextHeader } from './Headers/TextHeader';
import { TextCell } from './Cells/TextCell';
import { Track } from '../../types';
import { getTrackThumbnail } from '../TrackRow';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { ThumbnailCell } from './Cells/ThumbnailCell';
import { GridTrackTableRow } from './GridTrackTableRow';
import { isNumber, isString } from 'lodash';
import { SelectionCell } from './Cells/SelectionCell';
import { SelectionHeader } from './Headers/SelectionHeader';
import { formatDuration } from '../../utils';
import { PositionCell } from './Cells/PositionCell';
import { GridTrackTableRowClone } from './GridTrackTableRowClone';

export type GridTrackTableProps<T extends Track> = {
  className?: string;
  tracks: T[];
  isTrackFavorite: (track: T) => boolean;
  onDragEnd?: DragDropContextProps['onDragEnd'];
  strings: TrackTableStrings;
  customColumns?: (Column<T> & { columnWidth: string; })[];
} & TrackTableHeaders 
  & TrackTableSettings 
  & TrackTableExtraProps<T>;

export const GridTrackTable = <T extends Track>({ 
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

  displayHeaders=true,
  displayDeleteButton=true,
  displayPosition=true,
  displayFavorite=true,
  displayArtist=true, 
  displayAlbum=true,
  displayThumbnail=true,
  displayDuration=true,
  displayCustom=true,
  selectable=true,
  searchable=false,

  ...extraProps
}: GridTrackTableProps<T>) => {
  const shouldDisplayDuration = displayDuration && tracks.every(track => Boolean(track.duration));
  const columns = useMemo(() => [
    displayPosition && {
      id: TrackTableColumn.Position,
      Header: ({ column }) => <TextHeader
        column={column} 
        header={positionHeader} 
        isCentered
      />,
      accessor: 'position',
      Cell: PositionCell,
      enableSorting: true,
      columnWidth: '4em'
    },
    displayThumbnail && {
      id: TrackTableColumn.Thumbnail,
      Header: ({ column }) => <TextHeader column={column} header={thumbnailHeader} />,
      accessor: (track: T) => getTrackThumbnail(track) || artPlaceholder,
      Cell: ThumbnailCell,
      columnWidth: '3em'
    },
    {
      id: TrackTableColumn.Title,
      Header: ({ column }) => <TextHeader column={column} header={titleHeader} />,
      accessor: (track: T) => track.title ?? track.name,
      Cell: TextCell,
      enableSorting: true,
      columnWidth: '1fr'
    },
    displayArtist && {
      id: TrackTableColumn.Artist,
      Header: ({ column }) => <TextHeader column={column} header={artistHeader} />,
      accessor: (track: T) => isString(track.artist)
        ? track.artist
        : track.artist.name,
      Cell: TextCell,
      enableSorting: true,
      columnWidth: '1fr'
    },
    displayAlbum && {
      id: TrackTableColumn.Album,
      Header: ({ column }) => <TextHeader column={column} header={albumHeader} />,
      accessor: 'album',
      enableSorting: true,
      Cell: TextCell,
      columnWidth: '1fr'
    },
    shouldDisplayDuration && {
      id: TrackTableColumn.Duration,
      Header: ({ column }) => <TextHeader column={column} header={durationHeader} />,
      accessor: (track: T) => {
        if (isString(track.duration)) {
          return track.duration;
        } else if (isNumber(track.duration)) {
          return formatDuration(track.duration);
        } else {
          return null;
        }
      },
      Cell: TextCell
    },
    ...customColumns,
    selectable && {
      id: TrackTableColumn.Selection,
      Header: SelectionHeader,
      Cell: SelectionCell,
      columnWidth: '6em'
    }
  ], [displayDeleteButton, displayPosition, displayThumbnail, displayFavorite, isTrackFavorite, titleHeader, displayArtist, artistHeader, displayAlbum, albumHeader, shouldDisplayDuration, durationHeader, selectable, positionHeader, thumbnailHeader]);

  const data = useMemo(() => tracks, [tracks]);

  const initialState: Partial<TableState<T> & UseSortByState<T>> = {
    sortBy: [{ id: TrackTableColumn.Title, desc: false }]
  };
  const table = useTable<T>({ columns, data, initialState }, useSortBy, useRowSelect) as (TableInstance<T> & UseSortByInstanceProps<T>);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = table;

  const gridTemplateColumns = columns.map(column => column.columnWidth ?? '1fr').join(' ');

  // Disabled when there are selected rows, or when sorted by anything other than position
  const isDragDisabled = !onDragEnd || table.selectedFlatRows.length > 0 || table.state.sortBy[0]?.id !== TrackTableColumn.Position;

  return <div className={styles.track_table_wrapper}>
    <div 
      className={styles.track_table}
      {...getTableProps()}
    >
      <div className={styles.track_table_head}>
        {headerGroups.map(headerGroup => (
          <div 
            key={headerGroup.id}
            className={styles.track_table_header_row}
            style={{ gridTemplateColumns: gridTemplateColumns + ' auto' }}
            {...headerGroup.getHeaderGroupProps()} 
          >
            {
              headerGroup.headers.map(column => (
                <div 
                  key={column.id}
                  className={styles.track_table_header_cell}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header', extraProps)}
                </div>))
            }
            <div data-test-id='track-table-header-spacer' className={styles.track_table_header_spacer} />
          </div>
        ))}
      </div>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable 
          droppableId='track_table'
          mode='virtual'
          renderClone={GridTrackTableRowClone({
            rows,
            gridTemplateColumns,
            extraProps
          })}
        >
          {(droppableProvided, droppableSnapshot) => (
            <div
              data-testid='track-table-body'
              className={styles.track_table_body}
              ref={droppableProvided.innerRef}
              {...getTableBodyProps()}
              {...droppableProvided.droppableProps}
            >
              <AutoSizer
                className={styles.track_table_auto_sizer}
              >
                {({ height, width }) =>
                  <FixedSizeList
                    className={styles.track_table_virtualized_list}
                    height={height}
                    width={width}
                    itemSize={42}
                    itemCount={rows.length}
                    overscanCount={2}
                    itemData={{ 
                      rows: rows as Row<Track>[],
                      prepareRow: prepareRow as (row: Row<Track>) => void,
                      gridTemplateColumns,
                      isDragDisabled,
                      extraProps
                    }}
                    outerRef={droppableProvided.innerRef}
                  >
                    {GridTrackTableRow}
                  </FixedSizeList>
                }
              </AutoSizer>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  </div>;
};

