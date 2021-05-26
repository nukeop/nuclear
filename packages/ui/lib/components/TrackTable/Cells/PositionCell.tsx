import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { Button } from '../../..';
import { Track } from '../../../types';
import { TrackTableExtraProps } from '../types';
import styles from '../styles.scss';

const PositionCell: React.FC<CellProps<Track> & TrackTableExtraProps> = ({
  cell,
  row,
  value,
  onPlay
}) => <td {...cell.getCellProps()} className={cx(styles.position_cell, styles.narrow)}>
  <Button 
    circular 
    size='mini' 
    icon='play' 
    className={styles.add_button}
    onClick={() => onPlay(row.original)}
  />
  <span className={styles.position_cell_value}>
    {value}
  </span>
</td>;

export default PositionCell;
