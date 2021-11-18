import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { Playlist } from '@nuclear/core';

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

const playlists: Playlist[] = [
  { id: 'playlist-1', name: 'Playlist 1', tracks, lastModified: new Date().valueOf() },
  { id: 'playlist-2', name: 'Another Playlist', tracks: [tracks[0], tracks[1]] },
  { id: 'playlist-3', name: 'Playlist with 1 track', tracks: [tracks[0]] },
  { id: 'playlist-4', name: 'Last Playlist', tracks: [] }
];

const callbacks = {
  onPlaylistDownload: action('Playlist download'),
  onPlaylistUpload: action('Playlist upload')
};

const strings = {
  tracksSingular: 'track',
  tracksPlural: 'tracks',
  modifiedAt: 'Last modified: ',
  neverModified: 'Unknown',
  serverModifiedAt: 'Server modified: ',
  uploadToServer: 'Upload to server',
  downloadFromServer: 'Download from server',
  locale: 'en-US'
};

export const Empty = () => <div className='bg'>
  <Playlists
    playlists={[]}
    tracksSingular='track'
    tracksPlural='tracks'
    {...strings}
    {...callbacks}
  />
</div>;

export const DragAndDropRows = () => {
  const [rows, setRows] = useState([...playlists]);
  return <div className='bg'>
    <Playlists
      displayModificationDates
      playlists={rows}
      onDragEnd={({ source, destination }) => setRows(swap(rows, source.index, destination.index))}
      {...strings}
      {...callbacks}
    />
  </div>;
};
