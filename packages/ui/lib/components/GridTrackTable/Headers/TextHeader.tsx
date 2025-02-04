import React from 'react';
import { ColumnInstance, UseSortByColumnProps } from 'react-table';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';

import { Track } from '../../../types';
import styles from '../styles.scss';

export type TextHeaderProps<T extends Track> = {
  className?: string;
  column: ColumnInstance<T> & UseSortByColumnProps<T>;
  header?: string | React.ReactNode;
  isCentered?: boolean;
  'data-testid'?: string;
};

export const TextHeader: <T extends Track>(props: TextHeaderProps<T>) => React.ReactElement<TextHeaderProps<T>> = ({
  className,
  column, 
  header = '',
  isCentered,
  'data-testid': dataTestId
}) => {
  const { isSorted, isSortedDesc } = column;
  const name = isSortedDesc
    ? 'sort content descending' : 'sort content ascending';

  return (
    <div 
      className={cx(className, styles.text_header, {
        [styles.centered]: isCentered
      })} 
      data-testid={dataTestId}
    >
      { header }
      {
        isSorted &&
          <Icon className={styles.text_header_icon} name={name} />
      }
    </div>
  );
};
