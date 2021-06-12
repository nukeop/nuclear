import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { TrackTableExtraProps } from '../types';
import { Button } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const PositionCell: React.FC<CellProps<Track> & TrackTableExtraProps> = ({
  cell,
  row,
  value,
  onPlay
}) => <td {...cell.getCellProps()} className={cx(styles.position_cell, styles.narrow)}>
  <Button 
    circular 
    size='tiny'
    icon='play'
    color='pink'
    className={styles.add_button}
    onClick={() => onPlay(row.original)}
    data-testid='play-now'
  />
  <span className={styles.position_cell_value}>
    {value ?? row.index+1}
  </span>
</td>;

export default PositionCell;
