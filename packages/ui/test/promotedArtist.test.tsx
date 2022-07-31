import { PromotedArtist } from '../lib';
import { makeSnapshotTest } from './helpers';

makeSnapshotTest(
  PromotedArtist, {
    name: 'Test artist',
    imageUrl: 'https://via.placeholder.com/300',
    onListenClick: () => {}
  }, '(Snapshot) PromotedArtist (name only)'
);

makeSnapshotTest(
  PromotedArtist, {
    name: 'Test artist',
    description: 'Test description',
    imageUrl: 'https://via.placeholder.com/300',
    backgroundImageUrl: 'https://via.placeholder.com/600x250',
    onListenClick: () => {}
  }, '(Snapshot) PromotedArtist (name and description)'
);
