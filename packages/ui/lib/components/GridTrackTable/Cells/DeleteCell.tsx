import React from 'react';
import { CellProps } from 'react-table';
import cx from 'classnames';

import styles from '../styles.scss';
import { Track } from '../../../types';
import { TrackTableExtraProps } from '../../TrackTable/types';
import Button from '../../Button';

export const DeleteCell = <T extends Track>({
  cell,
  row,
  onDelete
}: CellProps<T> & TrackTableExtraProps<T>) => {
  return (
    <div
      {...cell.getCellProps()}
      className={cx(styles.delete_cell)}
      data-testid='delete-cell'
    >
      <Button
        data-testid='delete-button'
        basic
        borderless
        circular
        size='tiny'
        icon='times'
        onClick={() => onDelete(row.original, row.index)} />
    </div>
  );
};
