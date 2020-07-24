import { makeSnapshotTest } from './helpers';
import { AlbumGrid } from '../lib';

makeSnapshotTest(
  AlbumGrid, { loading: true }, '(Snapshot) AlbumGrid (loading)'
);

makeSnapshotTest(
  AlbumGrid, { albums: [
    { title: 'test' },
    { title: 'test' },
    { title: 'test' },
    { title: 'test' }
  ]}, '(Snapshot) AlbumGrid (basic)'
);