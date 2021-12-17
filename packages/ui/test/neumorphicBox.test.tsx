import { makeSnapshotTest } from './helpers';
import NeumorphicBox from '../lib/components/NeumorphicBox';

makeSnapshotTest(
  NeumorphicBox, {
    children: ['test']
  },
  '(Snapshot) Neumorphic Box'
);
