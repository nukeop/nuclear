import { makeSnapshotTest } from './helpers';
import { AlbumGrid } from '../lib';
import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';

makeSnapshotTest(
  AlbumGrid, { loading: true }, '(Snapshot) AlbumGrid (loading)'
);

makeSnapshotTest(
  AlbumGrid, { albums: [
    { title: 'test' },
    { title: 'test' },
    { title: 'test' },
    { title: 'test' }
  ] as SearchResultsAlbum[]}, '(Snapshot) AlbumGrid (basic)'
);
