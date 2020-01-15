/* eslint-disable no-console */
import React from 'react';
import { storiesOf } from '@storybook/react';

import { QueueItem, QueuePopup } from '..';
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
  ))
  .add('WithPopup', () => (
    <div className='bg padding_xl'>
      <QueuePopup
        trigger={<QueueItem {...commonProps} />}
        onRerollTrack={console.log}
        track={{
          streams: []
        }}
        selectedStream={{
          thumbnail: 'https://i.imgur.com/4euOws2.jpg',
          source: 'Youtube',
          title: 'What a song',
          id: '666'
        }}
        dropdownOptions={[
          {
            key: 'Youtube',
            text: 'Youtube',
            value: 'Youtube',
            content: 'Youtube'
          },
          {
            key: 'Soundcloud',
            text: 'Soundcloud',
            value: 'Soundcloud',
            content: 'Soundcloud'
          }
        ]}
        titleLabel='title'
        idLabel='id'
      />
    </div>
  ));
