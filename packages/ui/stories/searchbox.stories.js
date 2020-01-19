import React from 'react';
import { storiesOf } from '@storybook/react';

import { SearchBox } from '..';

const commonProps = {
  placeholder: 'Search...',
  searchProviders: [
    { key: 'discogs', text: 'Discogs', value: 'discogs' },
    { key: 'musicbrainz', text: 'Musicbrainz', value: 'musicbrainz' }
  ],
  selectedSearchProvider: 'Discogs'
}

storiesOf('Search box', module)
  .add('Basic', () => (
    <SearchBox {...commonProps} />
  ))
  .add('Loading', () => (
    <SearchBox {...commonProps} loading />
  ));