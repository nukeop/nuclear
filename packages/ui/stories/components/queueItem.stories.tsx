import React from 'react';

import { QueueItem } from '../..';
import { formatDuration } from '../../lib/utils';
import { TrackStream } from '../../lib/types';

const commonProps = {
  track: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    name: 'Test track name',
    artist: 'Test artist',
    streams: [{
      id: '123',
      source: 'test'
    } satisfies TrackStream]
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
  },
  onReload: () => {
    alert('Item reloaded');
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
          artist: 'Test artist',
          streams: [{
            id: '123',
            source: 'test'
          } satisfies TrackStream]
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
