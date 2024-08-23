import { Row, TableInstance, TableState, UseSortByInstanceProps, UseSortByState, useSortBy, useTable } from 'react-table';
import React, { useMemo, memo } from 'react';
import { DragDropContext, DragDropContextProps, Draggable, Droppable } from 'react-beautiful-dnd';
import cx from 'classnames';
import { FixedSizeList, FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { TrackTableColumn, TrackTableHeaders, TrackTableSettings } from '../TrackTable/types';
import { TextHeader } from './Headers/TextHeader';
import { TextCell } from './Cells/TextCell';
import { Track } from '../../types';
import { getTrackThumbnail } from '../TrackRow';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { ThumbnailCell } from './Cells/ThumbnailCell';

type GridTrackTableRowProps<T extends Track> = {
  data: {
    rows: TableInstance<T>['rows'];
    prepareRow: TableInstance<T>['prepareRow'];
    extraProps: TrackTableSettings;
  };
  index: number;
  style: React.CSSProperties;
}

const GridTrackTableRow = memo(<T extends Track>({ index, style, data }: GridTrackTableRowProps<T>) => {
  const row = data.rows[index];
  data.prepareRow(row);
  return <Draggable
    key={row.id}
    draggableId={row.id}
    index={row.index}
    isDragDisabled={false}
  >
    {
      (draggableProvided, draggableSnapshot) => (
        <div
          data-test-id='track-table-row'
          className={cx(
            styles.track_table_row,
            { [styles.is_dragging]: draggableSnapshot.isDragging }
          )}
          ref={draggableProvided.innerRef}
          {...row.getRowProps()}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          style={style ? {
            ...draggableProvided.draggableProps.style,
            ...style
          } : draggableProvided.draggableProps.style}
        >
          {row.cells.map((cell, i) => cell.render(
            'Cell',
            { ...data.extraProps, key: i }
          ))}
        </div>
      )}
  </Draggable>;
});

export type GridTrackTableProps<T extends Track> = {
tracks: T[];
onDragEnd?: DragDropContextProps['onDragEnd'];
} & TrackTableHeaders & TrackTableSettings;

export const GridTrackTable = <T extends Track>({ 
  tracks, 

  titleHeader,
  thumbnailHeader,

  displayArtist=true, 
  displayThumbnail=true,

  ...extraProps
}: GridTrackTableProps<T>) => {
  const columns = useMemo(() => [
    displayThumbnail && {
      id: TrackTableColumn.Thumbnail,
      Header: () => <span className={styles.center_aligned}>{thumbnailHeader}</span>,
      accessor: (track) => getTrackThumbnail(track) || artPlaceholder,
      Cell: ThumbnailCell
    },
    {
      id: TrackTableColumn.Title,
      Header: ({ column }) => <TextHeader column={column} header={titleHeader} />,
      accessor: (track) => track.title ?? track.name,
      Cell: TextCell,
      enableSorting: true
    }
  ], [displayArtist, displayThumbnail]);

  const data = useMemo(() => tracks, [tracks]);

  const initialState: Partial<TableState<T> & UseSortByState<T>> = {
    sortBy: [{ id: TrackTableColumn.Title, desc: false }]
  };
  const table = useTable<T>({ columns, data, initialState }, useSortBy) as (TableInstance<T> & UseSortByInstanceProps<T>);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = table;

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
            {...headerGroup.getHeaderGroupProps()} 
          >
            {
              headerGroup.headers.map(column => (
                <div 
                  key={column.id}
                  className={styles.track_table_header_cell}
                  {...column.getHeaderProps()} 
                >
                  {column.render('Header')}
                </div>))
            }
          </div>
        ))}
      </div>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId='track_table'>
          {(droppableProvided) => (
            <div
              data-testid='track-table-body'
              className={styles.track_table_body}
              ref={droppableProvided.innerRef}
              {...getTableBodyProps()}
              {...droppableProvided.droppableProps}
            >
              <AutoSizer>
                {({ height, width }) =>
                  <>
                    <FixedSizeList
                      height={829}
                      width={width}
                      itemSize={42}
                      itemCount={rows.length}
                      overscanCount={2}
                      itemData={{ 
                        rows: rows as Row<Track>[],
                        prepareRow: prepareRow as (row: Row<Track>) => void,
                        extraProps
                      }}
                      outerRef={droppableProvided.innerRef}
                    >
                      {GridTrackTableRow}
                    </FixedSizeList>
                    {droppableProvided.placeholder}
                  </>
                }
              </AutoSizer>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  </div>;
};

