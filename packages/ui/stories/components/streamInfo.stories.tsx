/* eslint-disable no-console */
import { StreamData } from '@nuclear/core/src/plugins/plugins.types';
import React from 'react';

import { StreamInfo } from '../..';

export default {
  title: 'Components/Stream info'
};


const commonProps = {
  streams: [{
    title: 'Stream 1',
    id: 'stream1'
  }, {
    title: 'Stream 2',
    id: 'stream2'
  }, {
    title: 'Stream 3',
    id: 'stream3'
  }, {
    title: 'The Weeknd - Blinding Lights (Official Music Video)',
    id: 'abcdefghijklmnopqrst1234567890'
  }] as StreamData[],
  selectedStream: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    source: 'Youtube',
    title: 'The Weeknd - Blinding Lights (Official Music Video)',
    id: 'abcdefghijklmnopqrst1234567890',
    author: {
      name: 'Channel author'
    }
  } as StreamData,
  onImageLoaded: () => {},
  onCopyTrackUrl: () => {},
  onSelectStream: () => {},
  copyTrackUrlLabel: 'Copy track url'
};

export const Basic = () => (
  <div className='bg' >
    <div style={{
      display: 'flex'
    }}>
      <StreamInfo {...commonProps} />
    </div>
  </div>
);
