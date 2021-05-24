import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';
import { Icon } from 'semantic-ui-react';

import { Track } from '../../../types';
import styles from '../styles.scss';

const PositionCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <td {...cell.getCellProps()} className={cx(styles.position_cell, styles.narrow)}>
  <button className={styles.add_button}><Icon name='play circle' size='big' /></button>
  <span className={styles.value}>
    {value}
  </span>
</td>;

export default PositionCell;
