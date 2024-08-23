import { ColumnInstance, UseSortByColumnProps } from 'react-table';
import { Track } from '../../../types';
import React from 'react';
import { Icon } from 'semantic-ui-react';

type TextHeaderProps = {
  column: ColumnInstance<Track> & UseSortByColumnProps<Track>;
    header: string | React.ReactNode;
    'data-testid'?: string;
};

export const TextHeader: React.FC<TextHeaderProps> = ({ 
  column, 
  header, 
  'data-testid': dataTestId
}) => {
  const { isSorted, isSortedDesc } = column;
  const name = isSortedDesc
    ? 'sort content descending' : 'sort content ascending';

  return (
    <div data-testid={dataTestId}>
      {header}
      {
        isSorted &&
          <Icon name={name} />
      }
    </div>
  );
};
