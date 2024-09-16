import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import { TrackTableExtraProps } from '../../TrackTable/types';
import { Track } from '../../../types';
import Button from '../../Button';
import styles from '../styles.scss';

export const FavoriteCell: React.FC<CellProps<Track> & TrackTableExtraProps<Track>> = ({
  cell,
  row,
  value,
  onAddToFavorites,
  onRemoveFromFavorites
}) => <div
  {...cell.getCellProps()}
  className={cx(styles.grid_track_table_cell, styles.favorite_cell)}
  data-testid='favorite-cell'>
  <Button
    data-testid='favorite-button'
    basic
    borderless
    circular
    size='tiny' icon={value ? 'heart' : 'heart outline'}
    onClick={() =>  value ? onRemoveFromFavorites(row.original) : onAddToFavorites(row.original)}
  />
</div>;
