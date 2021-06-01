/* eslint-disable no-console */
// tslint:disable: jsx-no-plain-text-elements
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { action } from '@storybook/addon-actions';

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
    positionHeader={<Icon name='hashtag' />}
    thumbnailHeader={<Icon name='image' />}
    artistHeader='Artist'
    titleHeader='Title'
    albumHeader='Album'
    durationHeader='Length'
    isTrackFavorite={
      (track: Track) => track.artist === 'Test Artist 2'
    }

    onPlay={action('Started playing')}
    onPlayAll={action('Started playing all')}
    onAddToQueue={action('Added to queue')}
    onAddToFavorites={action('Added to favorites')}
    onRemoveFromFavorites={action('Removed from favorites')}
    onAddToDownloads={action('Added to downloads')}
    onAddToPlaylist={action('Added to playlist')}
    onDelete={action('Deleted')}
    playlists={[
      {name: 'Playlist 1'},
      {name: 'Another Playlist'},
      {name: 'Last Playlist'}
    ]}

    strings={{
      addSelectedTracksToQueue: 'Add selected to queue',
      addSelectedTracksToDownloads: 'Add selected to downloads',
      addSelectedTracksToFavorites: 'Add selected to favorites',
      playSelectedTracksNow: 'Play selected now',
      tracksSelectedLabelSingular: 'track selected',
      tracksSelectedLabelPlural: 'tracks selected'
    }}
  />
</div>;
