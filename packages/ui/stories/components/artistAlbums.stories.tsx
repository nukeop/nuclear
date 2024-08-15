import React from 'react';
import { ArtistAlbums } from '../..';
import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';
import { range } from 'lodash';

export default {
  title: 'Components/Artist albums'
};

export const Basic = () => (
  <div className='bg'>
    <ArtistAlbums
      albums={
        range(25).map(() => ({
          title: `test album ${Math.random()}`
        })) as SearchResultsAlbum[]
      }
      strings={{
        header: 'Albums',
        sortByAZ: 'A-Z',
        sortByMostPlayed: 'Most played',
        sortByReleaseDate: 'Release date',
        filterPlaceholder: 'Filter albums...'
      }}
      withSortByReleaseDate
      withSortByAZ
    />
  </div>
);
