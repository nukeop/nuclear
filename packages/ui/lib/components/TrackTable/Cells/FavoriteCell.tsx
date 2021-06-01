import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { TrackTableExtraProps } from '../types';
import { Button } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const FavoriteCell: React.FC<CellProps<Track> & TrackTableExtraProps> = ({
  cell,
  row,
  value,
  onAddToFavorites,
  onRemoveFromFavorites
}) => <td {...cell.getCellProps()} className={cx(styles.favorite_cell, styles.narrow)}>
  <Button
    basic
    borderless
    circular
    size='tiny' icon={value ? 'heart' : 'heart outline'}
    onClick={() =>  value ? onRemoveFromFavorites(row.original) : onAddToFavorites(row.original)}
  />
</td>;

export default FavoriteCell;
