import { SearchBox } from '@nuclear/ui';
import React from 'react';
import { useSearch } from './hooks';

export const SearchBoxContainer: React.FC = () => {
  const searchProps = useSearch();

  return <SearchBox
    loading={false}
    disabled={false}
    placeholder='Search'
    onSearch={searchProps.onSearch}
  />;
};
