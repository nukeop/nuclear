import React from 'react';

import { QueueItem } from '../..';
// eslint-disable-next-line node/no-missing-import
import { formatDuration } from '../../lib/utils';

const commonProps = {
  track: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    name: 'Test track name',
    artist: 'Test artist',
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

export default {
  title: 'Components/Queue item'
};

export const Basic = () => {
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
};

export const Loading = () => {
  return (
    <div className='bg'>
      <QueueItem {...commonProps}
        track={{...commonProps.track, loading: true}}
      />
    </div>
  );
};

export const Current = () => {
  return (
    <div className='bg'>
      <QueueItem {...commonProps} isCurrent />
    </div>
  );
};

export const Compact = () => (
  <div className='bg'>
    <div
      style={{ width: '2.5rem' }}
    >
      <QueueItem {...commonProps} isCompact />
      <QueueItem {...commonProps}
        track={{
          thumbnail: 'https://i.imgur.com/koC6Otx.jpg',
          name: 'Test track name',
          artist: 'Test artist'
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
);

export const WithNoArt = () => (
  <div className='bg'>
    <QueueItem {...commonProps}
      track={{
        name: 'Test track name',
        artist: 'Test artist'
      }}
    />
    <div
      style={{ width: '2.5rem' }}
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
);

export const Error = () => (
  <div className='bg'>
    <QueueItem {...commonProps}
      track={{...commonProps.track, error: { message: 'An error has occurred.', details: '' }}}
    />
    <QueueItem {...commonProps}
      track={{...commonProps.track, error: { message: 'An error has occurred. This is a longer message containing several lines that will be truncated.', details: '' }}}
    />
  </div>
);
