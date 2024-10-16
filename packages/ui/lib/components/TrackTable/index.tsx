/* eslint-disable react/jsx-key */
import React, { TableHTMLAttributes, ThHTMLAttributes, useMemo, useState } from 'react';
import cx from 'classnames';
import { useTable, Column, useRowSelect, useSortBy, HeaderGroup, UseSortByColumnProps, TableState, UseSortByState, useGlobalFilter, TableInstance, UseGlobalFiltersInstanceProps } from 'react-table';
import { isNumber, isString } from 'lodash';
import { DragDropContext, Droppable, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { Input } from 'semantic-ui-react';

import DeleteCell from './Cells/DeleteCell';
import FavoriteCell from './Cells/FavoriteCell';
import PositionCell from './Cells/PositionCell';
import SelectionCell from './Cells/SelectionCell';
import ThumbnailCell from './Cells/ThumbnailCell';
import TitleCell from './Cells/TitleCell';
import TrackTableCell from './Cells/TrackTableCell';
import SelectionHeader from './Headers/SelectionHeader';
import ColumnHeader from './Headers/ColumnHeader';
import { getTrackThumbnail } from '../TrackRow';
import { TrackTableColumn, TrackTableExtraProps, TrackTableHeaders, TrackTableSettings, TrackTableStrings } from './types';
import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { Track } from '../../types';
import { Button, formatDuration } from '../..';

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
  customColumns = [],
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
  searchable = false,

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
      Header: ({ column }) => <ColumnHeader column={column} header={positionHeader} data-testid='position-header' />,
      accessor: 'position',
      Cell: PositionCell,
      enableSorting: true
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
      Header: ({ column }) => <ColumnHeader column={column} header={titleHeader} />,
      accessor: (track) => track.title ?? track.name,
      Cell: TitleCell,
      enableSorting: true
    },
    displayArtist && {
      id: TrackTableColumn.Artist,
      Header: ({ column }) => <ColumnHeader column={column} header={artistHeader} />,
      accessor: (track) => track.artists?.[0],
      Cell: TrackTableCell,
      enableSorting: true
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
  const initialState: Partial<TableState<T> & UseSortByState<T>> = {
    sortBy: [{ id: TrackTableColumn.Position, desc: false }]
  };

  const table = useTable<T>({ columns, data, initialState }, useGlobalFilter, useSortBy, useRowSelect) as (TableInstance<T> & UseGlobalFiltersInstanceProps<T>);
  const [globalFilter, setGlobalFilterState] = useState(''); // Required, because useGlobalFilter does not provide a way to get the current filter value

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter
  } = table;

  const onFilterClick = () => {
    setGlobalFilter('');
    setGlobalFilterState('');
  };

  return <div className={styles.track_table_wrapper}> 
    {
      searchable && 
      <div className={styles.track_table_filter_row}>
        <Input
          data-testid='track-table-filter-input'
          type='text'
          placeholder={extraProps.strings.filterInputPlaceholder}
          className={styles.track_table_filter_input} 
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setGlobalFilterState(e.target.value);
          }}
          value={globalFilter}
        />
        <Button 
          className={styles.track_table_filter_button}
          onClick={onFilterClick}
          borderless
          color={'blue'}
          icon='filter' 
        />
      </div>
    }
    <table 
      {...getTableProps() as TableHTMLAttributes<HTMLTableElement>} 
      className={cx(className, styles.track_table)}
    >
      {
        displayHeaders && <thead>
          {
            headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps() as TableHTMLAttributes<HTMLTableRowElement>}>
                {
                  headerGroup.headers.map((column: (HeaderGroup<T> & UseSortByColumnProps<T>)) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps()) as ThHTMLAttributes<HTMLTableCellElement>}>
                      {column.render('Header', extraProps)}
                    </th>
                  )
                  )
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
              data-testid='track-table-body'
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
                          data-testid='track-table-row'
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
    </table>
  
  </div>;
}

export default TrackTable;
