import React from 'react';
import { storiesOf } from '@storybook/react';

import { AlbumGrid } from '..';

storiesOf('Album grid', module)
  .add('Basic', () => (
    <div className='bg'>
      <AlbumGrid
        albums={[
          { title: 'test' },
          { title: 'test' },
          { title: 'test' },
          { title: 'test' }
        ]}
      />
    </div>
  ))
  .add('Loading', () => (
    <div className='bg'>
      <AlbumGrid loading />
    </div>
  ))
  .add('With album preview', () => (
    <div className='bg'>
      <AlbumGrid
        withAlbumPreview
        albums={_().range(17).map(() => ({
          title: 'test album',
          artist: {
            name: 'test artist'
          },
          image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}],
          tracks: _().range(10).map(i => (
            {
              name: `Test track ${Math.random() * i}`,
              artist: { name: 'Test Artist' },
              album: 'Test album',
              position: i+1,
              duration: 100
            }
          )).value()
        })).value()
        }
      />
    </div>
  ));
