/* eslint-disable no-console */
import React from 'react';
import { storiesOf } from '@storybook/react';

import { StreamInfo } from '..';

const commonProps = {
  selectedStream: {
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    source: 'Youtube',
    title: 'What a song',
    id: '666'
  },
  handleRerollTrack: () => console.log(),
  handleSelectStream: () => console.log(),
  handleImageLoaded: () => console.log(),
  track: {
    name: 'Test track name',
    artist: 'Test artist'
  },
  dropdownOptions: [
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
  ],
  idLabel: 'id',
  titleLabel: 'title'
};

storiesOf('Stream Info', module)
  .add('Basic', () => {
    return (
      <StreamInfo {...commonProps} />
    );
  });
