import { FullscreenForm } from '..';
import { makeSnapshotTest } from './helpers';

makeSnapshotTest(FullscreenForm, {
  isOpen: true,
  onClose: () => { }
},
'(Snapshot) Fullscreen Form - opened');

makeSnapshotTest(FullscreenForm, {
  isOpen: true,
  isSubmitting: true
},
'(Snapshot) Fullscreen Form - submitting');

makeSnapshotTest(FullscreenForm, {
  isOpen: true,
  message: {
    type: 'error',
    content: 'Error message'
  }
},
'(Snapshot) Fullscreen Form - error');

makeSnapshotTest(FullscreenForm, {
  isOpen: true,
  message: {
    type: 'success',
    content: 'Success message'
  }
},
'(Snapshot) Fullscreen Form - success');
