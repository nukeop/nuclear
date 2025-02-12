import { CellProps, Column, ColumnInstance, HeaderGroup, HeaderProps, Row, TableInstance, TableState, UseGlobalFiltersInstanceProps, UseRowSelectInstanceProps, UseRowSelectRowProps, UseSortByColumnProps, UseSortByInstanceProps, UseSortByState, useGlobalFilter, useRowSelect, useSortBy, useTable } from 'react-table';
import React, { useMemo, useState } from 'react';
import { DragDropContext, DragDropContextProps, Droppable } from 'react-beautiful-dnd';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { TrackTableColumn, TrackTableExtraProps, TrackTableHeaders, TrackTableSettings, TrackTableStrings } from '../TrackTable/types';
import { TextHeader, TextHeaderProps } from './Headers/TextHeader';
import { TextCell } from './Cells/TextCell';
import { Track } from '../../types';
import { getTrackThumbnail } from '../TrackRow';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { ThumbnailCell } from './Cells/ThumbnailCell';
import { GridTrackTableRow } from './GridTrackTableRow';
import { groupBy, isString } from 'lodash';
import { SelectionCell, SelectionCellProps } from './Cells/SelectionCell';
import { SelectionHeader } from './Headers/SelectionHeader';
import { formatDuration } from '../../utils';
import { PositionCell } from './Cells/PositionCell';
import { GridTrackTableRowClone } from './GridTrackTableRowClone';
import { DeleteCell } from './Cells/DeleteCell';
import { FavoriteCell } from './Cells/FavoriteCell';
import { TitleCell } from './Cells/TitleCell';
import { Input } from 'semantic-ui-react';
import Button from '../Button';

export type GridTrackTableProps<T extends Track> = {
  className?: string;
  tracks: T[];
  isTrackFavorite: (track: T) => boolean;
  onDragEnd?: DragDropContextProps['onDragEnd'];
  strings: TrackTableStrings;
  customColumns?: (ColumnWithWidth<T>)[];
} & TrackTableHeaders
  & TrackTableSettings
  & TrackTableExtraProps<T>;

type ColumnWithWidth<T extends Track> = Column<T> & { columnWidth: string; };
type TrackTableColumnInstance<T extends Track> = ColumnInstance<T> & UseSortByColumnProps<T>;
type TrackTableHeaderGroup<T extends Track> = HeaderGroup<T> & UseSortByColumnProps<T>;
type TrackTableInstance<T extends Track> = TableInstance<T> & UseGlobalFiltersInstanceProps<T> & UseSortByInstanceProps<T> & UseRowSelectInstanceProps<T>;
type TrackTableState<T extends Track> = TableState<T> & UseSortByState<T>;
export type TrackTableRow<T extends Track> = Row<T> & UseRowSelectRowProps<T>;

export const GridTrackTable = <T extends Track>({
  className,
  tracks = [],
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
  displayFavorite = true,
  displayArtist = true,
  displayAlbum = true,
  displayThumbnail = true,
  displayDuration = true,
  displayCustom = true,
  selectable = true,
  searchable = false,

  ...extraProps
}: GridTrackTableProps<T>) => {
  const shouldDisplayDuration = displayDuration && tracks.every(track => Boolean(track.duration));
  const groupedDisc = useMemo(() => groupBy(tracks, (track) => track.discNumber || 1), [tracks]);

  const [globalFilter, setGlobalFilterState] = useState(''); // Required, because useGlobalFilter does not provide a way to get the current filter value

  const generateColumns = () => [
    selectable && {
      id: TrackTableColumn.Selection,
      Header: (props: HeaderProps<T> & UseRowSelectInstanceProps<T> & TrackTableExtraProps<T>) => <SelectionHeader<T> {...props} {...extraProps} />,
      Cell: (props: SelectionCellProps<T> & UseRowSelectRowProps<T>) => <SelectionCell<T> {...props} />,
      columnWidth: '7.5em'
    },
    displayPosition && {
      id: TrackTableColumn.Position,
      Header: ({ column }: { column: TrackTableColumnInstance<T> }) => <TextHeader<T> data-testid='position-header' column={column} header={positionHeader} isCentered />,
      accessor: (track: T) => track.position,
      Cell: (props: CellProps<T>) => <PositionCell<T> {...props} {...extraProps} />,
      enableSorting: true,
      columnWidth: '4em'
    },
    displayThumbnail && {
      id: TrackTableColumn.Thumbnail,
      Header: ({ column }: { column: ColumnInstance<T> & UseSortByColumnProps<T>; }) => <TextHeader<T> column={column} header={thumbnailHeader} />,
      accessor: (track: T) => getTrackThumbnail(track) || artPlaceholder,
      Cell: (props: CellProps<T>) => <ThumbnailCell<T> {...props} {...extraProps} />,
      columnWidth: '3em'
    },
    displayFavorite && {
      id: TrackTableColumn.Favorite,
      accessor: isTrackFavorite,
      Cell: (props: CellProps<T>) => <FavoriteCell<T> {...props} {...extraProps} />,
      columnWidth: '3em'
    },
    {
      id: TrackTableColumn.Title,
      Header: ({ column }: { column: TrackTableColumnInstance<T> }) => <TextHeader<T> column={column} header={titleHeader} />,
      accessor: (track: T) => track.title ?? track.name,
      Cell: (props: CellProps<T>) => <TitleCell<T> {...props} {...extraProps} />,
      enableSorting: true,
      columnWidth: 'minmax(8em, 1fr)'
    },
    displayArtist && {
      id: TrackTableColumn.Artist,
      Header: ({ column }: { column: TrackTableColumnInstance<T> }) => <TextHeader<T> column={column} header={artistHeader} />,
      accessor: (track: T) => isString(track.artist) ? track.artist : track.artist.name,
      Cell: (props: CellProps<T>) => <TextCell<T> {...props} {...extraProps} />,
      enableSorting: true,
      columnWidth: '6em'
    },
    displayAlbum && {
      id: TrackTableColumn.Album,
      Header: ({ column }: { column: TrackTableColumnInstance<T> }) => <TextHeader<T> column={column} header={albumHeader} />,
      accessor: (track: T) => track.album,
      enableSorting: true,
      Cell: (props: CellProps<T>) => <TextCell<T> {...props} {...extraProps} />,
      columnWidth: '6em'
    },
    shouldDisplayDuration && {
      id: TrackTableColumn.Duration,
      Header: ({ column }: { column: TrackTableColumnInstance<T> }) => <TextHeader<T> column={column} header={durationHeader} />,
      accessor: (track: T) => isString(track.duration) ? track.duration : formatDuration(track.duration),
      Cell: (props: CellProps<T>) => <TextCell<T> {...props} {...extraProps} />,
      columnWidth: '6em'
    },
    ...customColumns,
    displayDeleteButton && {
      id: TrackTableColumn.Delete,
      Cell: (props: CellProps<T>) => <DeleteCell<T> {...props} {...extraProps} />,
      columnWidth: '3em'
    } as ColumnWithWidth<T>
  ].filter(Boolean);

  const renderTable = (data: T[], discNumber?: string) => {
    const columns = useMemo(generateColumns, [displayDeleteButton, displayPosition, displayThumbnail, displayFavorite, isTrackFavorite, titleHeader, displayArtist, artistHeader, displayAlbum, albumHeader, shouldDisplayDuration, durationHeader, selectable, positionHeader, thumbnailHeader]);

    const initialState: Partial<TableState<T> & UseSortByState<T>> = {
      sortBy: [{ id: TrackTableColumn.Position, desc: false }]
    };

    const table = useTable<T>(
      { columns: columns as Column<T>[], data, initialState },
      useGlobalFilter, useSortBy, useRowSelect
    ) as TrackTableInstance<T>;

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter, state: tableState, selectedFlatRows } = table;
    const onFilterClick = () => {
      setGlobalFilter('');
      setGlobalFilterState('');
    };
    const gridTemplateColumns = columns.map((col: ColumnWithWidth<T>) => col.columnWidth ?? '1fr').join(' ');

    const isDragDisabled = !onDragEnd || selectedFlatRows.length > 0 || (tableState as TrackTableState<T>).sortBy[0]?.id !== TrackTableColumn.Position;

    return (
      <div className={styles.track_table_wrapper}>
        {searchable && (
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
        )}
        <div className={styles.grid_track_table} {...getTableProps()}>
          {discNumber && <h3>Disc {discNumber}</h3>}
          <div className={styles.track_table_head}>
            {headerGroups.map((headerGroup) => (
              <div key={headerGroup.id} className={styles.track_table_header_row} style={{ gridTemplateColumns: gridTemplateColumns + ' auto' }} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: TrackTableHeaderGroup<T>) => (
                  <div key={column.id} className={styles.track_table_header_cell} {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={'track_table'} mode='virtual' renderClone={GridTrackTableRowClone({ rows, gridTemplateColumns, extraProps })}>
              {(droppableProvided) => (
                <div data-testid={'track-table-body'} className={styles.track_table_body} ref={droppableProvided.innerRef} {...getTableBodyProps()} {...droppableProvided.droppableProps}>
                  <AutoSizer className={styles.track_table_auto_sizer}>
                    {({ height, width }) => (
                      <FixedSizeList<{
                        rows: TableInstance<T>['rows'];
                        prepareRow: TableInstance<T>['prepareRow'];
                        gridTemplateColumns: string;
                        isDragDisabled: boolean;
                        extraProps: TrackTableExtraProps<T>;
                      }>
                        className={styles.track_table_virtualized_list}
                        height={height}
                        width={width}
                        itemSize={42}
                        itemCount={rows.length}
                        overscanCount={2}
                        itemData={{
                          rows,
                          prepareRow,
                          gridTemplateColumns,
                          isDragDisabled,
                          extraProps
                        }}
                        outerRef={droppableProvided.innerRef}
                      >
                        {({ data, index, style}) => <GridTrackTableRow index={index} style={style} data={data}/>}
                      </FixedSizeList>
                    )}
                  </AutoSizer>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  };

  if (Object.keys(groupedDisc).length < 2) {
    return renderTable(tracks);
  } else {
    return (
      <div className={styles.track_table_wrapper}>
        {Object.entries(groupedDisc).map(([discNumber, discTracks]) => renderTable(discTracks, discNumber))}
      </div>
    );
  }

};

