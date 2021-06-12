import { makeSnapshotTest } from './helpers';
import { Cover } from '../lib';

makeSnapshotTest(
  Cover, { cover: 'https://i.imgur.com/4euOws2.jpg' }, '(Snapshot) Cover'
);
