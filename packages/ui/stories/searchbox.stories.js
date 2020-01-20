import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { SearchBox } from '..';

const searchProviders = [
  { key: 'discogs', text: 'Discogs', value: 'discogs' },
  { key: 'musicbrainz', text: 'Musicbrainz', value: 'musicbrainz' }
];

const commonProps = {
  placeholder: 'Search...',
  searchProviders
};

storiesOf('Search box', module)
  .add('Basic', () => {
    let [selectedSearchProvider, onSearchProviderSelect] = useState(searchProviders[0]);
    return <div className='bg'>
      <SearchBox 
        {...commonProps} 
        selectedSearchProvider={selectedSearchProvider}
        onSearchProviderSelect={onSearchProviderSelect}
      />
    </div>;
  })
  .add('Loading', () => {
    let [selectedSearchProvider, onSearchProviderSelect] = useState(searchProviders[0]);
    return <div className='bg'><SearchBox 
      {...commonProps} 
      selectedSearchProvider={selectedSearchProvider}
      onSearchProviderSelect={onSearchProviderSelect}
      loading
    />
    </div>;
  });
