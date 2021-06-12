import { Button } from '../lib';
import { ButtonProps } from '../lib/components/Button';
import { makeSnapshotTest } from './helpers';

const propsList: ButtonProps[] = [
  { basic: true },
  {},
  { color: 'green' },
  { color: 'blue' },
  { color: 'purple' },
  { color: 'pink' },
  { color: 'orange' },
  { color: 'red' }
];

propsList.forEach(props => {
  makeSnapshotTest(Button, { ...props, children: 'Test button' }, `(Snapshot) Button - ${JSON.stringify(props)}`);
  makeSnapshotTest(Button, { ...props, circular: true, children: 'Test button' }, `(Snapshot) Button - circular - ${JSON.stringify(props)}`);
  makeSnapshotTest(Button, { ...props, icon: 'play' }, `(Snapshot) Button - icon - ${JSON.stringify(props)}`);
  makeSnapshotTest(Button, { ...props, circular: true, icon: 'play' }, `(Snapshot) Button - circular icon - ${JSON.stringify(props)}`);
});
