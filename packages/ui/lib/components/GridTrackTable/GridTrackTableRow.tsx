import React, { memo } from 'react';
import { TableInstance } from 'react-table';
import { Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';

import { TrackTableExtraProps } from '../TrackTable/types';
import { Track } from '../../types';
import styles from './styles.scss';

export type GridTrackTableRowProps<T extends Track> = {
  data: {
    rows: TableInstance<T>['rows'];
    prepareRow: TableInstance<T>['prepareRow'];
    gridTemplateColumns: string;
    isDragDisabled: boolean;
    extraProps: TrackTableExtraProps<T>;
  };
  index: number;
  style: React.CSSProperties;
}

const GridTrackTableRowComponent = <T extends Track>({ index, style, data }: GridTrackTableRowProps<T>): JSX.Element => {
  const row = data.rows[index];
  data.prepareRow(row);
  return (
    <Draggable
      key={row.id}
      draggableId={row.id}
      index={row.index}
      isDragDisabled={data.isDragDisabled}
    >
      {(draggableProvided, draggableSnapshot) => (
        <div
          data-testid='track-table-row'
          className={cx(
            styles.grid_track_table_row,
            { [styles.is_dragging]: draggableSnapshot.isDragging }
          )}
          ref={draggableProvided.innerRef}
          {...row.getRowProps()}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          style={{
            ...(draggableProvided.draggableProps.style ? { ...draggableProvided.draggableProps.style, ...style } : draggableProvided.draggableProps.style),
            gridTemplateColumns: data.gridTemplateColumns
          }}
          tabIndex={row.index}
        >
          {row.cells.map((cell, i) => cell.render('Cell', { ...data.extraProps, key: i }))}
        </div>
      )}
    </Draggable>
  );
};

export const GridTrackTableRow = memo(GridTrackTableRowComponent) as <T extends Track>(props: GridTrackTableRowProps<T>) => JSX.Element;
