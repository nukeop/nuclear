import React from 'react';
import { HeaderProps } from 'react-table';
import { Icon } from 'semantic-ui-react';

import { Track } from '../../../types';

import styles from '../styles.scss';

const ColumnHeader: React.FC<
  HeaderProps<Track> &
  { text: string }
> = ({
  column,
  text
}) => {
  const { isSorted, isSortedDesc } = column;
  const name = column.isSortedDesc
    ? 'sort content descending' : 'sort content ascending';

  return (
    <span className={styles.title_with_icon}>
      {text}
      <Icon disabled={!isSorted} name={name} />
    </span>
  );
};

export default ColumnHeader;
