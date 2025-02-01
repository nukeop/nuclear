import React, { TdHTMLAttributes } from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';

import { Track } from '../../../types';
import styles from '../styles.scss';

export type ThumbnailCellClassnames = {
  thumbnail_cell?: string;
  narrow?: string;
  thumbnail?: string;
}

const ThumbnailCell: (classnames?: ThumbnailCellClassnames) => React.FC<CellProps<Track>> = (classnames = styles) => ({
  cell,
  value
}) => <td {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>} className={cx(classnames.thumbnail_cell, classnames.narrow)}>
  <img className={classnames.thumbnail} src={value} />
</td>;

export default ThumbnailCell;
