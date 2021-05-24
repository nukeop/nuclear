import React from 'react';
import { Icon } from 'semantic-ui-react';
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
      <Button basic borderless rounded className={styles.title_cell_more}>
        <Icon name='ellipsis horizontal' />
      </Button>
    </span>
  </span>
</td>;

export default TitleCell;
