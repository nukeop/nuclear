
import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import { Track } from '@nuclear/core';

import styles from '../styles.scss';


export const TextCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <div
  {...cell.getCellProps()}
  className={cx(styles.grid_track_table_cell, styles.text_cell)}
>
  {value}
</div>;
