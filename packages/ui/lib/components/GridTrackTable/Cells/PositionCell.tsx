import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import Button from '../../Button';
import { TrackTableExtraProps } from '../../TrackTable/types';
import { Track } from '../../../types';
import styles from '../styles.scss';

export const PositionCell = <T extends Track>({
  cell,
  row,
  value,
  onPlay
}: CellProps<T> & TrackTableExtraProps<T>) => {
  return (
    <div
      {...cell.getCellProps()}
      className={cx(styles.grid_track_table_cell, styles.position_cell)}
      data-testid='position-cell'
    >
      <Button
        circular
        size='tiny'
        icon='play'
        color='pink'
        className={styles.play_button}
        onClick={() => onPlay(row.original)}
        data-testid='play-now' />
      <span className={styles.position_cell_value}>{value ?? row.index + 1}</span>
    </div>
  );
};
