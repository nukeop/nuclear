/* eslint-disable no-console */
// tslint:disable: jsx-no-plain-text-elements
import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { action } from '@storybook/addon-actions';

import { TrackTable, HistoryTable, HistoryTableDate } from '../..';
import { swap } from '../storyUtils';
import { Track } from '../../lib/types';
import { TrackTableProps } from '../../lib/components/TrackTable';

export default {
  title: 'Components/Track table',
  component: TrackTable
};

const tracks = [
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
    artist: { name: 'Test Artist 3' },
    name: 'Test Title 3',
    album: 'Test Album',
    duration: '1:00'
  } as Track
];

const playlists = [
  { name: 'Playlist 1' },
  { name: 'Another Playlist' },
  { name: 'Last Playlist' }
];

const callbacks = {
  onPlay: action('Started playing'),
  onPlayAll: action('Started playing all'),
  onAddToQueue: action('Added to queue'),
  onAddToFavorites: action('Added to favorites'),
  onRemoveFromFavorites: action('Removed from favorites'),
  onAddToDownloads: action('Added to downloads'),
  onAddToPlaylist: action('Added to playlist'),
  onDelete: action('Deleted')
};

const trackTableStrings = {
  addSelectedTracksToQueue: 'Add selected to queue',
  addSelectedTracksToDownloads: 'Add selected to downloads',
  addSelectedTracksToFavorites: 'Add selected to favorites',
  playSelectedTracksNow: 'Play selected now',
  tracksSelectedLabelSingular: 'track selected',
  tracksSelectedLabelPlural: 'tracks selected',
  filterInputPlaceholder: 'Search...'
};

const TrackTableTemplate = <T extends Track>(args: Partial<TrackTableProps<T>>) => <TrackTable
  tracks={[]} 
  positionHeader='Position'
  thumbnailHeader='Thumbnail'
  artistHeader='Artist'
  albumHeader='Album'
  titleHeader='Title'
  durationHeader='Length'
  isTrackFavorite={() => false}
  strings={trackTableStrings}
  {...args} 
/>;

export const Empty = () => <div className='bg'>
  <TrackTableTemplate
    tracks={[]}
  />
</div>;

export const WithRows = () => <div className='bg'>
  <TrackTableTemplate
    tracks={tracks}
    positionHeader={<Icon name='hashtag' />}
    thumbnailHeader={<Icon name='image' />}
    
    isTrackFavorite={
      (track: Track) => track.artist === 'Test Artist 2'
    }
    playlists={playlists}
    strings={trackTableStrings}
    {...callbacks}
  />
</div>;

export const DragAndDrop = () => {
  const [trackRows, setTrackRows] = useState([...tracks]);

  return <div className='bg'>
    <TrackTableTemplate
      tracks={trackRows}
      positionHeader={<Icon name='hashtag' />}
      thumbnailHeader={<Icon name='image' />}
     
      isTrackFavorite={(track: Track) => track.artist === 'Test Artist 2'}
      playlists={playlists}
      strings={trackTableStrings}
      onDragEnd={(result) => {
        const { source, destination } = result;
        setTrackRows(swap(trackRows, source.index, destination!.index));
      }}
      {...callbacks} />
  </div>;
};

export const Searchable = () => <div className='bg'>
  <TrackTableTemplate 
    tracks={tracks}
    searchable
  />
</div>;


const HistoryTableTemplate = (args) => <HistoryTable 
  {...args}
  isTrackFavorite={() => false}
  playlists={playlists}
  strings={trackTableStrings}
  displayHeaders={false}
  displayPosition={false}
  displayThumbnail={false}
  displayAlbum={false}
  displayDuration={false}
/>;

export const ListeningHistory = () => <div className='bg'>
  <HistoryTableDate>
    {new Date().toLocaleDateString()}
  </HistoryTableDate>
  <HistoryTableTemplate
    tracks={[{
      artist: 'Test Artist',
      title: 'Test Title',
      createdAt: new Date()
    }]}
    displayDeleteButton={false}
  />
  <HistoryTableDate>
    {new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()}
  </HistoryTableDate>
  <HistoryTableTemplate
    tracks={[{
      artist: 'Test Artist 2',
      title: 'Test Title 2',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
    }, {
      artist: 'Test Artist 4',
      title: 'Test Title 4',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
    }]}
    displayDeleteButton={false}
  />
  <HistoryTableDate>
    {new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString()}
  </HistoryTableDate>
  <HistoryTableTemplate
    tracks={[{
      artist: 'Test Artist 3',
      title: 'Test Title 3',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
    }]}
    displayDeleteButton={false}
  />
</div>;

export const DragAndDropVirtualized = () => {
  const [trackRows, setTrackRows] = useState([...tracks]);

  return <div className='bg'>
    <TrackTableTemplate
      tracks={Array.from({ length: 100 }, (_, i) => ({
        ...trackRows[i % trackRows.length],
        position: i + 1
      }))}  
      positionHeader={<Icon name='hashtag' />}
      thumbnailHeader={<Icon name='image' />}
      
      isTrackFavorite={(track: Track) => track.artist === 'Test Artist 2'}
      playlists={playlists}
      strings={trackTableStrings}
      onDragEnd={(result) => {
        const { source, destination } = result;
        setTrackRows(swap(trackRows, source.index, destination!.index));
      }}
      {...callbacks} 
      displayDeleteButton={false}
      displayThumbnail={false}
    />
  </div>;
};
