import React, { TdHTMLAttributes } from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import styles from '../styles.scss';
import { Playlist } from '@nuclear/core';

export type PlaylistThumbnailCellClassnames = {
  thumbnail_cell?: string;
  narrow?: string;
  thumbnail?: string;
}

const PlaylistThumbnailCell: (classnames?: PlaylistThumbnailCellClassnames) => React.FC<CellProps<Playlist>> = (classnames = styles) => ({
  cell,
  value
}) => <td {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>} className={cx(classnames.thumbnail_cell, classnames.narrow)}>
  <img className={classnames.thumbnail} src={value} />
</td>;

export default PlaylistThumbnailCell;
