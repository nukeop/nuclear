import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { Track } from '../../../types';
import styles from '../styles.scss';

const ThumbnailCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <td {...cell.getCellProps()} className={cx(styles.thumbnail_cell, styles.narrow)}>
  <img className={styles.thumbnail} src={value} />
</td>;

export default ThumbnailCell;
