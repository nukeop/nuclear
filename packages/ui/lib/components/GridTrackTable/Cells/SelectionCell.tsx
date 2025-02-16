import React from 'react';
import { Cell } from 'react-table';

import { Track } from '../../../types';
import Checkbox, { CheckboxProps } from '../../Checkbox';
import styles from '../styles.scss';
import { TrackTableRow } from '..';

export type SelectionCellProps<T extends Track> = {
  cell: Cell<T>;
  row: TrackTableRow<T>;
}

export const SelectionCell = <T extends Track>({
  cell, 
  row
}: SelectionCellProps<T>) => {
  return <div
    {...cell.getCellProps()}
    className={styles.selection_cell}
  >
    <Checkbox
      {...(row.getToggleRowSelectedProps() as unknown as CheckboxProps)}
      tabIndex={-1} />
  </div>;
};

