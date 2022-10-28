import React, {TdHTMLAttributes} from 'react';
import { CellProps } from 'react-table';

import { HistoryTableTrack } from '../HistoryTable';
import styles from '../styles.scss';

const DateCell: React.FC<CellProps<HistoryTableTrack>> = ({ cell, value }) => {
  return <td {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>}
    className={styles.date_cell}
  >
    {value}
  </td>;
};

export default DateCell;
