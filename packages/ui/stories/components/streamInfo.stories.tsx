/* eslint-disable no-console */
import { StreamData } from '@nuclear/core/src/plugins/plugins.types';
import React from 'react';

import { StreamInfo } from '../..';

export default {
  title: 'Components/Stream info'
};

const commonProps = {
  streams: [{
    id: 'stream1',
    title: 'Stream 1',
    thumbnail: 'https://i.ibb.co/q0h4jsd/image.png',
    author: {
      name: 'Author 1'
    }
  }, {
    id: 'stream2',
    title: 'Stream 2',
    thumbnail: 'https://i.ibb.co/fqVSWSw/image.png',
    author: {
      name: 'Author 2'
    }
  }, {
    id: 'stream3',
    title: 'Stream 3',
    thumbnail: 'https://i.ibb.co/h9xyCdm/1664106623786004.png',
    author: {
      name: 'Author 3'
    }
  }, {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    title: 'The Weeknd - Blinding Lights (Official Music Video)',
    id: 'abcdefghijklmnopqrst1234567890',
    author: {
      name: 'Channel author'
    }
  }] as StreamData[],
  selectedStream: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    source: 'Youtube',
    title: 'The Weeknd - Blinding Lights (Official Music Video)',
    id: 'abcdefghijklmnopqrst1234567890',
    originalUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
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
