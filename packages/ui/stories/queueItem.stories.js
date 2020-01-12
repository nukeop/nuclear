import React from 'react';
import { storiesOf } from '@storybook/react';

import { QueueItem } from '..';
import { formatDuration } from '../lib/utils';

const commonProps = {
  track: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    name: 'Test track name',
    artist: 'Test artist'
  },
  isLoading: false,
  isCurrent: false,
  isCompact: false,
  duration: formatDuration(123),
  defaultMusicSource: {},
  selectSong: () => {
    alert('Item selected');
  },
  removeFromQueue: () => {
    alert('Item removed from queue');
  }
};

storiesOf('Queue item', module)
  .add('Basic', () => {
    return (
      <div className='bg'>
        <QueueItem {...commonProps} />
        <QueueItem
          {...commonProps}
          track={{
            thumbnail: 'https://i.imgur.com/aVNWf3j.jpg',
            name: 'Small thumbnail',
            artist: 'Test artist'
          }}
        />
      </div>
    );
  })
  .add('Loading', () => {
    return (
      <div className='bg'>
        <QueueItem {...commonProps} isLoading />
      </div>
    );
  })
  .add('Current', () => {
    return (
      <div className='bg'>
        <QueueItem {...commonProps} isCurrent />
      </div>
    );
  })
  .add('Compact', () => (
    <div className='bg'>
      <div
        style={{ width: '3rem' }}
      >
        <QueueItem {...commonProps} isCompact />
        <QueueItem {...commonProps} isCompact isLoading />
        <QueueItem {...commonProps} isCompact isCurrent />
      </div>
    </div>
  ))
  .add('With no art', () => (
    <div className='bg'>
      <QueueItem {...commonProps} 
        track={{
          name: 'Test track name',
          artist: 'Test artist'
        }}
      />
      <div
        style={{ width: '3rem' }}
      >
        <QueueItem {...commonProps}
          isCompact
          track={{
            name: 'Test track name',
            artist: 'Test artist'
          }}
        />
      </div>
    </div>
  ));
