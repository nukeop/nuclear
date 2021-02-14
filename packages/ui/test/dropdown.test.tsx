import { makeSnapshotTest } from './helpers';
import { Dropdown } from '..';

makeSnapshotTest(Dropdown, {
  search: true,
  selection: true,
  options: [{
    text: 'abc',
    value: 'abc'
  }, {
    text: 'qwe',
    value: 'qwe'
  }, {
    text: 'zxc',
    value: 'zxc'
  }],
  defaultValue: 'default'
}, '(Snapshot) Dropdown - search variant');
