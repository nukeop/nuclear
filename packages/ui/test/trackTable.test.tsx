import React from 'react';
import { Icon } from 'semantic-ui-react';

import { TrackTable } from '../lib';
import { Track } from '../lib/types';
import { makeSnapshotTest } from './helpers';

makeSnapshotTest(
  TrackTable,
  {
    tracks: [],
    positionHeader: 'Position',
    thumbnailHeader: 'Thumbnail',
    artistHeader: 'Artist',
    albumHeader: 'Album',
    titleHeader: 'Title',
    durationHeader: 'Length'
  },
  '(Snapshot) Track table - empty'
);

makeSnapshotTest(
  TrackTable,
  {
    tracks: [
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
    ],
    positionHeader: 'Position',
    thumbnailHeader: <Icon name='image' />,
    artistHeader: 'Artist',
    albumHeader: 'Album',
    titleHeader: 'Title',
    durationHeader: 'Length',
    isTrackFavorite:
      (track: Track) => track.artist === 'Test Artist 2'
  },
  '(Snapshot) Track table - example data with all rows'
);
