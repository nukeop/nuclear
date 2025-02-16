import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import { Track } from '../../../types';
import styles from '../styles.scss';

export const TextCell = <T extends Track>({ cell, value }: CellProps<T>) => (
  <div
    {...cell.getCellProps()}
    className={cx(styles.grid_track_table_cell, styles.text_cell)}
  >
    {value}
  </div>
);
