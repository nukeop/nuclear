import React, { useState } from 'react';

import { Playlists } from '../..';
import { Track } from '../../lib/types';
import { swap } from '../storyUtils';

export default {
  title: 'Components/Playlists',
  component: Playlists
};

const tracks = [
  {
    position: 1,
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    artist: 'Test Artist',
    title: 'Test Title',
    album: 'Test Album',
    duration: '1:00'
  } as Track, {
    position: 2,
    thumbnail: 'https://i.imgur.com/4euOws2.jpg',
    artist: 'Test Artist 2',
    name: 'Test Title 2',
    album: 'Test Album',
    duration: '1:00'
  } as Track,
    {
      position: 3,
      thumbnail: 'https://i.imgur.com/4euOws2.jpg',
      artist: { name: 'Test Artist 3' },
      name: 'Test Title 3',
      album: 'Test Album',
      duration: '1:00'
    } as Track
];

const playlists = [
  { name: 'Playlist 1', tracks },
  { name: 'Another Playlist', tracks: [tracks[0], tracks[1]] },
  { name: 'Playlist with 1 track', tracks: [tracks[0]] },
  { name: 'Last Playlist', tracks: [] }
];

export const Empty = () => <div className='bg'>
  <Playlists
    playlists={[]}
    tracksSingular='track'
    tracksPlural='tracks'
  />
</div>;

export const DragAndDropRows = () => {
  const [rows, setRows] = useState([...playlists]);
  return <div className='bg'>
    <Playlists
      playlists={rows} 
      onDragEnd={({source, destination}) => setRows(swap(rows, source.index, destination.index))}
      tracksSingular='track'
      tracksPlural='tracks'
    />
  </div>;
};
