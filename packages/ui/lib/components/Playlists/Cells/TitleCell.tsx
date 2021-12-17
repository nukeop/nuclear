import React from 'react';
import { CellProps } from 'react-table';

import { Playlist } from '@nuclear/core';

import styles from '../styles.scss';

const TitleCell: React.FC<CellProps<Playlist>> =({
  cell,
  value
}) => <td
  {...cell.getCellProps()}
  className={styles.title_cell}
>
  {value}
</td>;

export default TitleCell;
