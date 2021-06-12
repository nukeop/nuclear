import { Checkbox } from '../lib';
import { makeSnapshotTest } from './helpers';

makeSnapshotTest(
  Checkbox, { checked: false }, '(Snapshot) Checkbox - unchecked'
);

makeSnapshotTest(
  Checkbox, { checked: true }, '(Snapshot) Checkbox - checked'
);

makeSnapshotTest(
  Checkbox, { indeterminate: true }, '(Snapshot) Checkbox - indeterminate'
);
