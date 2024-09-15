/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { ChangeEvent, TdHTMLAttributes } from 'react';
import cx from 'classnames';
import { Cell, Row, TableToggleRowsSelectedProps, UseRowSelectRowProps } from 'react-table';

import { Checkbox } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

type SelectionCellProps<T extends Track> = {
  cell: Cell<T>;
  row: Row<T> & UseRowSelectRowProps<T>
}

const SelectionCell = <T extends Track>({
  cell,
  row
}: SelectionCellProps<T>) => {
  const toggleRowSelectedProps: TableToggleRowsSelectedProps = row.getToggleRowSelectedProps();

  return <td {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>} className={cx(styles.select_cell, styles.narrow)}>
    <Checkbox 
      {...toggleRowSelectedProps}
      onChange={(e) => toggleRowSelectedProps.onChange(e as ChangeEvent<HTMLInputElement>)}
      tabIndex={undefined} 
    />
  </td>;
};

export default SelectionCell;
