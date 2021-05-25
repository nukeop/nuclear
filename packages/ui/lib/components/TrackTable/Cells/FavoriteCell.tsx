import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { Button } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const FavoriteCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <td {...cell.getCellProps()} className={cx(styles.favorite_cell, styles.narrow)}>
  <Button basic borderless circular size='mini' icon={value ? 'heart' : 'heart outline'} />
</td>;

export default FavoriteCell;
