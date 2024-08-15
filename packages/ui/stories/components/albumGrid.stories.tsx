import React from 'react';
import _ from 'lodash';

import { AlbumGrid } from '../..';
import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';

export default {
  title: 'Components/Album grid'
};

export const Basic = () => (
  <div className='bg'>
    <AlbumGrid
      albums={[
        { title: 'test' },
        { title: 'test' },
        { title: 'test' },
        { title: 'test' }
      ] as SearchResultsAlbum[]}
    />
  </div>
);

export const Loading = () => (
  <div className='bg'>
    <AlbumGrid loading />
  </div>
);


export const WithAlbumPreview = () => (
  <div className='bg'>
    <AlbumGrid
      withAlbumPreview
      albums={_(null).range(17).map(() => ({
        title: 'test album',
        artist: {
          name: 'test artist'
        },
        image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}],
        tracklist: _(null).range(10).map(i => (
          {
            name: `Test track ${Math.random() * i}`,
            artist: { name: 'Test Artist' },
            album: 'Test album',
            position: i+1,
            duration: 100
          }
        )).value()
      })).value() as unknown as SearchResultsAlbum[]
      }
    />
  </div>
);
