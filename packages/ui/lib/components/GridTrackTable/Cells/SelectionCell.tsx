import React from 'react';
import { CellProps, UseRowSelectRowProps } from 'react-table';

import { Track } from '../../../types';
import Checkbox, { CheckboxProps } from '../../Checkbox';
import styles from '../styles.scss';

export const SelectionCell: React.FC<CellProps<Track> & UseRowSelectRowProps<Track>> = ({
  cell, 
  row
}) => <div
  {...cell.getCellProps()}
  className={styles.selection_cell}
>
  <Checkbox
    {...(row.getToggleRowSelectedProps() as unknown as CheckboxProps)} 
    tabIndex={-1}
  />
</div>;

