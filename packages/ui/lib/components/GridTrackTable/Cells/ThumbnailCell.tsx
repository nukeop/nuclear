import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import { Track } from '../../../types';
import styles from '../styles.scss';
import Img from 'react-image';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

export const ThumbnailCell = <T extends Track>({
  cell,
  value
}: CellProps<T>) => {
  return (
    <div
      className={cx(styles.grid_track_table_cell, styles.thumbnail_cell)}
      {...cell.getCellProps()}
    >
      <Img
        className={styles.thumbnail_cell_thumbnail}
        src={value}
        unloader={<img className={styles.thumbnail_cell_thumbnail} src={artPlaceholder} />} />
    </div>
  );
};
