import { StreamVerification } from '../lib';
import { makeSnapshotTest } from './helpers';

const defaultProps = {
  onVerify: () => {},
  onUnverify: () => {},
  tooltipStrings: {
    unknown: 'The status of this stream is unknown.',
    unverified: 'This stream has not yet been verified by the community. Click to verify.',
    weakly_verified: 'This stream has been verified by a couple of users. Click to verify.',
    verified: 'This stream has been verified by the community. Click to verify.',
    verified_by_user: 'This stream has been verified by you. Click to unverify.'
  },
  streamStatusStrings: {
    unknown: 'Unknown',
    unverified: 'Unverified',
    weakly_verified: 'Weakly Verified',
    verified: 'Verified',
    verified_by_user: 'Verified by you' 
  },
  textVerify: 'Verify'
};

makeSnapshotTest(StreamVerification, {
  ...defaultProps,
  status: 'unknown'
}, '(Snapshot) StreamVerification - unknown status');

makeSnapshotTest(StreamVerification, {
  ...defaultProps,
  status: 'weakly_verified'
}, '(Snapshot) StreamVerification - weakly verified');

makeSnapshotTest(StreamVerification, {
  ...defaultProps,
  status: 'verified'
}, '(Snapshot) StreamVerification - verified');

makeSnapshotTest(StreamVerification, {
  ...defaultProps,
  status: 'verified_by_user'
}, '(Snapshot) StreamVerification - verified by user');
