import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { Track } from '../../../types';
import styles from '../styles.scss';
import { Button } from '../../..';

const PositionCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <td {...cell.getCellProps()} className={cx(styles.position_cell, styles.narrow)}>
  <Button circular size='mini' icon='play' className={styles.add_button} />
  <span className={styles.position_cell_value}>
    {value}
  </span>
</td>;

export default PositionCell;
