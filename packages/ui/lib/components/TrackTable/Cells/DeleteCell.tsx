import React, { TdHTMLAttributes } from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { TrackTableExtraProps } from '../types';
import { Button } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const DeleteCell: React.FC<CellProps<Track> & TrackTableExtraProps<Track>> = ({
  cell,
  row,
  onDelete
}) => <td {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>} className={cx(styles.narrow, styles.delete_cell)}>
  <Button
    data-testid='delete-button'
    basic
    borderless
    circular
    size='tiny' 
    icon='times'
    onClick={() => onDelete(row.original, row.index)}
  />
</td>;

export default DeleteCell;
