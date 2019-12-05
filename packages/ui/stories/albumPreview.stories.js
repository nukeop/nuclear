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
          image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}],
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
        handleAddToQueue={() => alert('Album added to queue')}
        handlePlayAll={() => alert('Album started playing')}
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
  ))
  .add('With track buttons', () => (
    <div className='bg'>
      <AlbumPreview
        album={{
          title: 'test album',
          artist: {
            name: 'test artist'
          },
          image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}],
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
        trackButtons={[
          {
            onClick: () => alert('Button 1 clicked'),
            icon: 'share',
            label: 'Share'
          },
          {
            onClick: () => alert('Button 2 clicked'),
            icon: 'edit',
            label: 'Edit'
          },
          {
            onClick: () => alert('Button 3 clicked'),
            icon: 'cogs',
            label: 'Settings'
          }
        ]}
      />
    </div>
  ));
