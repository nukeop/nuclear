import React from 'react';
import { DraggableChildrenFn } from 'react-beautiful-dnd';

import cx from 'classnames';
import styles from './styles.scss';
import { Row } from 'react-table';
import { Track } from '../../types';
import { TrackTableExtraProps } from '../TrackTable/types';

export type GridTrackTableRowCloneProps<T extends Track> = {
    rows: Row<T>[];
    gridTemplateColumns: string;
    extraProps: TrackTableExtraProps<T>;
}

export const GridTrackTableRowClone: <T extends Track>(props: GridTrackTableRowCloneProps<T>) => DraggableChildrenFn = ({
  rows,
  gridTemplateColumns,
  extraProps
}) => (provided, snapshot, rubric) => {
  const row = rows[rubric.source.index];
  return <div
    ref={provided.innerRef}
    className={cx(
      styles.grid_track_table_row,
      styles.is_dragging
    )}
    {...row.getRowProps()}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    style={{
      ...provided.draggableProps.style,
      gridTemplateColumns
    }}
  >
    {row.cells.map((cell, i) => cell.render(
      'Cell',
      { ...extraProps, key: i }
    ))}
  </div>;
};
