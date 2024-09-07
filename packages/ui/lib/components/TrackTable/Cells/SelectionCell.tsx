/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { ChangeEvent, TdHTMLAttributes } from 'react';
import cx from 'classnames';
import { CellProps, UseRowSelectRowProps } from 'react-table';

import { Checkbox } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const SelectionCell: React.FC<CellProps<Track> & UseRowSelectRowProps<Track>> = ({
  cell,
  row,
  getToggleRowSelectedProps
}) => {
  const toggleRowSelectedProps = getToggleRowSelectedProps();
  return <td {...cell.getCellProps() as TdHTMLAttributes<HTMLTableCellElement>} className={cx(styles.select_cell, styles.narrow)}>
    <Checkbox 
      {...toggleRowSelectedProps}
      onChange={(e) => toggleRowSelectedProps.onChange(e as ChangeEvent<HTMLInputElement>)}
      tabIndex={undefined} 
    />
  </td>;
};

export default SelectionCell;
