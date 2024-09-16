/* eslint-disable no-console */
import {GridTrackTable} from '../..';
import React, { useState } from 'react';
import { GridTrackTableProps } from '../../lib/components/GridTrackTable';
import { Track } from '../../lib/types';
import { swap } from '../storyUtils';
import { Icon } from 'semantic-ui-react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/GridTrackTable',
  component: GridTrackTable
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
      album: 'Test Album2',
      duration: '1:00'
    } as Track
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

const gridTrackTableStrings = {
  addSelectedTracksToQueue: 'Add selected to queue',
  addSelectedTracksToDownloads: 'Add selected to downloads',
  addSelectedTracksToFavorites: 'Add selected to favorites',
  playSelectedTracksNow: 'Play selected now',
  tracksSelectedLabelSingular: 'track selected',
  tracksSelectedLabelPlural: 'tracks selected',
  filterInputPlaceholder: 'Search...'
};

const TrackTableTemplate = <T extends Track>(args: Partial<GridTrackTableProps<T>>) => <GridTrackTable
  tracks={tracks as T[]} 
  positionHeader={<Icon name='hashtag' />}
  thumbnailHeader={<Icon name='image' />}
  artistHeader='Artist'
  albumHeader='Album'
  titleHeader='Title'
  durationHeader='Length'
  isTrackFavorite={() => false}
  strings={gridTrackTableStrings}
  {...callbacks}
  {...args} 
/>;

export const Basic = () => (
  <div className='bg column'>
    <TrackTableTemplate />
  </div>
);

export const DragAndDropVirtualized = () => {
  const [trackRows, setTrackRows] = useState([...tracks]);

  return <div className='bg column'>
    <TrackTableTemplate
      tracks={Array.from({ length: 1000 }, (_, i) => ({
        ...trackRows[i % trackRows.length],
        position: i + 1
      }))}  
      onDragEnd={(result) => {
        const { source, destination } = result;
        console.log({ source, destination });
        setTrackRows(swap(trackRows, source.index, destination!.index));
      }}
    />
  </div>;
};

export const Searchable = () => <div className='bg'>
  <TrackTableTemplate 
    tracks={tracks}
    searchable
  />
</div>;
