import React from 'react';
import { ColumnInstance } from 'react-table';
import { Icon } from 'semantic-ui-react';

import { Track } from '../../../types';

import styles from '../styles.scss';

type ColumnHeaderProps = {
  column: ColumnInstance<Track>,
  header: string | React.ReactNode
};

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, header }) => {
  const { isSorted, isSortedDesc } = column;
  const name = column.isSortedDesc
    ? 'sort content descending' : 'sort content ascending';

  return (
    <span className={styles.title_with_icon}>
      {header}
      <Icon disabled={!isSorted} name={name} />
    </span>
  );
};

export default ColumnHeader;
