/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import cx from 'classnames';
import { CellProps, UseRowSelectRowProps } from 'react-table';

import { Checkbox } from '../../..';
import { Track } from '../../../types';
import styles from '../styles.scss';

const SelectionCell: React.FC<CellProps<Track> & UseRowSelectRowProps<Track>> = ({
  cell,
  row
}) => <td {...cell.getCellProps()} className={cx(styles.select_cell, styles.narrow)}>
  {/* @ts-ignore */}
  <Checkbox {...row.getToggleRowSelectedProps()}/>
</td>;

export default SelectionCell;
