import React from 'react';
import { ColumnInstance, UseSortByColumnProps } from 'react-table';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';

import { Track } from '../../../types';
import styles from '../styles.scss';

type TextHeaderProps = {
  className?: string;
  column: ColumnInstance<Track> & UseSortByColumnProps<Track>;
  header: string | React.ReactNode;
  isCentered?: boolean;
  'data-testid'?: string;
};

export const TextHeader: React.FC<TextHeaderProps> = ({ 
  className,
  column, 
  header,
  isCentered,
  'data-testid': dataTestId
}) => {
  const { isSorted, isSortedDesc } = column;
  const name = isSortedDesc
    ? 'sort content descending' : 'sort content ascending';

  return (
    <div className={cx(className, styles.text_header, {
      [styles.centered]: isCentered
    })} data-testid={dataTestId}>
      {header}
      {
        isSorted &&
          <Icon className={styles.text_header_icon} name={name} />
      }
    </div>
  );
};
