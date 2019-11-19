import React from 'react';
import { storiesOf } from '@storybook/react';

import { AlbumPreview } from '..';

storiesOf('Album preview', module)
  .add('Basic', () => (
    <div className='bg'>
      <AlbumPreview
        album={{
          title: 'test album',
          artist: {
            name: 'test artist'
          },
          images: [{'uri': 'https://i.imgur.com/4euOws2.jpg'}],
          tracks: _().range(10).map(i => (
            {
              name: `Test track ${i}`,
              artist: { name: 'Test Artist' },
              album: 'Test album',
              position: i+1,
              duration: 100
            }
          )).value()
        }}
      />
    </div>
  ))
  .add('No cover', () => (
    <div className='bg'>
      <AlbumPreview
        album={{
          title: 'test album',
          artist: {
            name: 'test artist'
          },
          tracks: _().range(10).map(i => (
            {
              name: `Test track ${i}`,
              artist: { name: 'Test Artist' },
              album: 'Test album',
              position: i+1,
              duration: 100
            }
          )).value()
        }}
      />
    </div>
  ));
