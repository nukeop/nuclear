import React, { useState } from 'react';

import { SearchBox } from '../..';
import { SearchProviderOption } from '../../lib/types';

const searchProviders = [
  { key: 'discogs', text: 'Discogs', value: 'discogs' },
  { key: 'musicbrainz', text: 'Musicbrainz', value: 'musicbrainz' }
];

const commonProps = {
  placeholder: 'Search...',
  searchProviders,
  loading: false,
  disabled: false,
  searchHistory: ['test', 'test2'],
  lastSearchesLabel: 'Last searches',
  clearHistoryLabel: 'Clear history',
  footerLabel: 'Footer',
  onClearHistory: () => {},
  onSearch: () => {},
  handleFocus: () => {},
  isFocused: false
};

export default {
  title: 'Components/Search box'
};

export const Basic = () => {
  const [selectedSearchProvider, onSearchProviderSelect] = useState(searchProviders[0]);
  return (
    <div className='bg'>
      <SearchBox 
        {...commonProps} 
        selectedSearchProvider={selectedSearchProvider}
        onSearchProviderSelect={(data) => onSearchProviderSelect(searchProviders.find((provider) => provider.value === data.value) as SearchProviderOption)}
      />
    </div>
  );
};

export const Loading = () => {
  const [selectedSearchProvider, onSearchProviderSelect] = useState(searchProviders[0]);
  return (
    <div className='bg'>
      <SearchBox 
        {...commonProps} 
        selectedSearchProvider={selectedSearchProvider}
        onSearchProviderSelect={(data) => onSearchProviderSelect(searchProviders.find((provider) => provider.value === data.value) as SearchProviderOption)}
        loading
      />
    </div>
  );
};

export const Disabled = () => {
  const [selectedSearchProvider, onSearchProviderSelect] = useState(searchProviders[0]);
  return (
    <div className='bg'>
      <SearchBox 
        {...commonProps} 
        selectedSearchProvider={selectedSearchProvider}
        onSearchProviderSelect={(data) => onSearchProviderSelect(searchProviders.find((provider) => provider.value === data.value) as SearchProviderOption)}
        disabled
      />
    </div>
  );
};
