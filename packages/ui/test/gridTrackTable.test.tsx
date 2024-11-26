import { GridTrackTable } from '../lib';
import { Track } from '../lib/types';
import { makeSnapshotTest } from './helpers';

jest.mock(
  'react-virtualized-auto-sizer',
  () =>
    ({ children }) =>
      children({ height: 600, width: 600 })
);

makeSnapshotTest(GridTrackTable, {
  tracks: [],
  positionHeader: 'Position',
  thumbnailHeader: 'Thumbnail',
  artistHeader: 'Artist',
  albumHeader: 'Album',
  titleHeader: 'Title',
  durationHeader: 'Length'
}, '(Snapshot) Grid track table - empty');

makeSnapshotTest(GridTrackTable, {
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
  thumbnailHeader: 'Thumbnail',
  artistHeader: 'Artist',
  albumHeader: 'Album',
  titleHeader: 'Title',
  durationHeader: 'Length'
}, '(Snapshot) Grid track table - example data with all rows');

makeSnapshotTest(GridTrackTable, {
  tracks: [
    {
      position: 1, 
      thumbnail: 'https://i.imgur.com/4euOws2.jpg', 
      artist: 'Test Artist',
      title: 'Test Title',
      album: 'Test Album',
      duration: '1:00',
      discNumber: '0'
    }, {
      position: 2, 
      thumbnail: 'https://i.imgur.com/4euOws2.jpg', 
      artist: 'Test Artist 2',
      name: 'Test Title 2',
      album: 'Test Album',
      duration: '1:00',
      discNumber: '1'
    } as Track
  ],
  positionHeader: 'Position',
  thumbnailHeader: 'Thumbnail',
  artistHeader: 'Artist',
  albumHeader: 'Album',
  titleHeader: 'Title',
  durationHeader: 'Length'
}, '(Snapshot) Grid track table - example data with multiple discs');
