import { memo } from 'react';
import React from 'react';
import { TableInstance } from 'react-table';
import { Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';

import { TrackTableColumn, TrackTableExtraProps } from './types';
import { Track } from '../../types';
import styles from './styles.scss';

type TrackTableRowProps<T extends Track> = {
    data: {
        rows: TableInstance<T>['rows'];
        prepareRow: TableInstance<T>['prepareRow'];
        extraProps: TrackTableExtraProps<T>;
    };
    index: number;
    style: React.CSSProperties;
}

export const TrackTableRow = memo(<T extends Track>({ data, index, style }: TrackTableRowProps<T>) => {
  const row = data.rows[index];
  data.prepareRow(row);

  return <Draggable
    key={`${row.values[TrackTableColumn.Title]} ${row.index}`}
    draggableId={`${row.values[TrackTableColumn.Title]} ${row.index}`}
    index={row.index}
    isDragDisabled={true}
  >
    {(draggableProvided, draggableSnapshot) => {  
      return <tr
        data-testid='track-table-row'
        ref={draggableProvided.innerRef}
        className={cx({ [styles.is_dragging]: draggableSnapshot.isDragging })}
        {...row.getRowProps()}
        {...draggableProvided.draggableProps}
        {...draggableProvided.dragHandleProps}
      >
        {
          row.cells.map((cell, i) => (cell.render('Cell', { ...data.extraProps, key: i })))
        }
      </tr>;
    }}
  </Draggable>;
});
