/* eslint-disable no-console */
import React from 'react';
import { storiesOf } from '@storybook/react';

import { QueueItem } from '../..';
// eslint-disable-next-line node/no-missing-import
import { formatDuration } from '../../lib/utils';

const commonProps = {
  track: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    name: 'Test track name',
    artists: ['Test artist'],
    stream: {}
  },
  isCurrent: false,
  isCompact: false,
  duration: formatDuration(123),
  defaultMusicSource: {},
  onSelect: () => {
    alert('Item selected');
  },
  onRemove: () => {
    alert('Item removed from queue');
  }
};

storiesOf('Components/Queue item', module)
  .add('Basic', () => {
    return (
      <div className='bg'>
        <QueueItem {...commonProps} />
        <QueueItem
          {...commonProps}
          track={{
            thumbnail: 'https://i.imgur.com/aVNWf3j.jpg',
            name: 'Small thumbnail',
            artists: ['Test artist']
          }}
        />
      </div>
    );
  })
  .add('Loading', () => {
    return (
      <div className='bg'>
        <QueueItem {...commonProps}
          track={{...commonProps.track, loading: true}}
        />
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
        style={{ width: '2.5rem' }}
      >
        <QueueItem {...commonProps} isCompact />
        <QueueItem {...commonProps}
          track={{
            thumbnail: 'https://i.imgur.com/koC6Otx.jpg',
            name: 'Test track name',
            artists: ['Test artist']
          }}
          isCompact
        />
        <QueueItem {...commonProps} isCompact 
          track={{...commonProps.track, loading: true}}
        />
        <QueueItem {...commonProps} isCompact isCurrent />
        <QueueItem {...commonProps} isCompact 
          track={{...commonProps.track, error: { message: 'An error has occurred.', details: 'Error details are available here.' }}}
        />
      </div>
    </div>
  ))
  .add('With no art', () => (
    <div className='bg'>
      <QueueItem {...commonProps}
        track={{
          name: 'Test track name',
          artists: ['Test artist']
        }}
      />
      <div
        style={{ width: '2.5rem' }}
      >
        <QueueItem {...commonProps}
          isCompact
          track={{
            name: 'Test track name',
            artists: ['Test artist']
          }}
        />
      </div>
    </div>
  ))
  .add('Error', () => (
    <div className='bg'>
      <QueueItem {...commonProps}
        track={{...commonProps.track, error: { message: 'An error has occurred.', details: '' }}}
      />
      <QueueItem {...commonProps}
        track={{...commonProps.track, error: { message: 'An error has occurred. This is a longer message containing several lines that will be truncated.', details: '' }}}
      />
    </div>
  ));
