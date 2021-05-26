import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { Button } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';
import { TrackTableExtraProps } from '../types';

const FavoriteCell: React.FC<CellProps<Track> & TrackTableExtraProps> = ({
  cell,
  row,
  value,
  onAddToFavorites
}) => <td {...cell.getCellProps()} className={cx(styles.favorite_cell, styles.narrow)}>
  <Button
    basic
    borderless
    circular
    size='mini' icon={value ? 'heart' : 'heart outline'}
    onClick={() => onAddToFavorites(row.original)}
  />
</td>;

export default FavoriteCell;
