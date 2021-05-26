/* eslint-disable no-console */
// tslint:disable: jsx-no-plain-text-elements
import React from 'react';
import { Icon } from 'semantic-ui-react';

import { TrackTable } from '..';
import { Track } from '../lib/types';


export default {
  title: 'Track table',
  component: TrackTable
};

export const Empty = () =>  <div className='bg'>
  <TrackTable
    tracks={[]}
    positionHeader='Position'
    thumbnailHeader='Thumbnail'
    artistHeader='Artist'
    albumHeader='Album'
    titleHeader='Title'
    durationHeader='Length'
    isTrackFavorite={() => false}
  />
</div>;

export const ExampleData = () =>  <div className='bg'>
  <TrackTable
    tracks={[
      {
        position: 1, 
        thumbnail: 'https://i.imgur.com/4euOws2.jpg', 
        artist: 'Test Artist',
        title: 'Test Title',
        album: 'Test Album',
        duration: '1:00'
      }, {
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
        artist: {name: 'Test Artist 3' },
        name: 'Test Title 3',
        album: 'Test Album',
        duration: '1:00'
      } as Track
    ]}
    positionHeader='#'
    thumbnailHeader={<Icon name='image' />}
    artistHeader='Artist'
    titleHeader='Title'
    albumHeader='Album'
    durationHeader='Length'
    isTrackFavorite={
      (track: Track) => track.artist === 'Test Artist 2'
    }

    onPlay={(track: Track) => console.log('Started playing', track)}
    onAddToQueue={(track: Track) => console.log('Added to queue', track)}
    onAddToFavorites={(track: Track) => console.log('Added to favorites', track)}
    onAddToDownloads={(track: Track) => console.log('Added to downloads', track)}
    onAddToPlaylist={(track: Track, playlist) => console.log('Added to playlist', track, playlist)}
    playlists={[
      {name: 'Playlist 1'},
      {name: 'Another Playlist'},
      {name: 'Last Playlist'}
    ]}
  />
</div>;
