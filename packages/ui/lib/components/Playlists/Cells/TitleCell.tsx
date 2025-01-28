import React, { TdHTMLAttributes } from 'react';
import { CellProps } from 'react-table';

import { Playlist } from '@nuclear/core';

import * as styles from '../styles.scss';

const TitleCell: React.FC<CellProps<Playlist>> =({
  cell,
  value
}) => <td
  {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>}
>
  {value}
</td>;

export default TitleCell;
