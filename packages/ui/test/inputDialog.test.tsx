import React from 'react';
import { makeSnapshotTest } from './helpers';
import { InputDialog } from '..';

makeSnapshotTest(InputDialog, {
  trigger: <button>Open</button>,
  header: <span>Input header</span>,
  acceptLabel: 'Accept',
  cancelLabel: 'Cancel',
  initialString: 'Initial string',
  placeholder: 'Input placeholder',
  onAccept: () => {}
}, '(Snapshot) InputDialog');
