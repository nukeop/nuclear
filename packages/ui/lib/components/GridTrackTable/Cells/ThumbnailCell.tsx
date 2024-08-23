import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import { Track } from '../../../types';
import styles from '../styles.scss';

export const ThumbnailCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <div
  className={cx(styles.track_table_cell, styles.thumbnail_cell)}
  {...cell.getCellProps()}
>
  <img className={styles.thumbnail_cell_thumbnail} src={value} />
</div>;
