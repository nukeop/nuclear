import React from 'react';
import { Button } from '../../..';

import styles from '../styles.scss';

type TitleCellProps = {
  value: string;
}
const TitleCell: React.FC<TitleCellProps> = ({
  value
}) => <td className={styles.title_cell}>
  <span className={styles.title_cell_content}>
    <span className={styles.title_cell_value}>
      {value}
    </span>
    <span className={styles.title_cell_buttons}>
      <Button basic borderless circular size='mini' icon='plus' />
      <Button basic borderless circular size='mini' icon='ellipsis horizontal' />
    </span>
  </span>
</td>;

export default TitleCell;
