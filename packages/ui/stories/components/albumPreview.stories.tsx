import React from 'react';
import _ from 'lodash';

import { AlbumPreview } from '../..';

export default {
  title: 'Components/Album preview',
  argTypes: {
    handleAddToQueue: {action: 'Album added to queue'},
    handlePlayAll: {action: 'Album started playing'}
  }
};

export const Basic = ({
  handleAddToQueue,
  handlePlayAll
}) => (
  <div className='bg'>
    <AlbumPreview
      album={{
        title: 'test album',
        artist: {
          name: 'test artist'
        },
        image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}],
        tracks: _(null).range(10).map(i => (
          {
            name: `Test track ${i}`,
            artist: { name: 'Test Artist' },
            album: 'Test album',
            position: i+1,
            duration: 100
          }
        )).value()
      }}
      handleAddToQueue={handleAddToQueue}
      handlePlayAll={handlePlayAll}
    />
  </div>
);

export const NoCover = ({
  handleAddToQueue,
  handlePlayAll
}) => (
  <div className='bg'>
    <AlbumPreview
      album={{
        title: 'test album',
        artist: {
          name: 'test artist'
        },
        tracks: _(null).range(10).map(i => (
          {
            name: `Test track ${i}`,
            artist: { name: 'Test Artist' },
            album: 'Test album',
            position: i+1,
            duration: 100
          }
        )).value()
      }}
      handleAddToQueue={handleAddToQueue}
      handlePlayAll={handlePlayAll}
    />
  </div>
);


export const WithTrackButtons = ({
  handleAddToQueue,
  handlePlayAll
}) => (
  <div className='bg'>
    <AlbumPreview
      album={{
        title: 'test album',
        artist: {
          name: 'test artist'
        },
        image: [{'#text': 'https://i.imgur.com/4euOws2.jpg'}],
        tracks: _(null).range(10).map(i => (
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
      handleAddToQueue={handleAddToQueue}
      handlePlayAll={handlePlayAll}
    />
  </div>
);
