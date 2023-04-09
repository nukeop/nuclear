import React from 'react';
import { action } from '@storybook/addon-actions';

import { StreamVerification } from '../..';
import { StreamVerificationProps } from '../../lib/components/StreamVerification';

export default {
  title: 'Components/Stream Verification',
  component: StreamVerification,
  parameters: { actions: { argTypesRegex: '^on.*' } }
};

const Template = (args: StreamVerificationProps) => <div className='bg'>
  <StreamVerification 
    {...args} 
    onVerify={action('onVerify')}
    onUnverify={action('onUnverify')}
    tooltipStrings={{
      unknown: 'The status of this stream is unknown.',
      unverified: 'This stream has not yet been verified by the community.',
      weakly_verified: 'This stream has been verified by a couple of users.',
      verified: 'This stream has been verified by the community.',
      verified_by_user: 'This stream has been verified by you.'
    }}
    streamStatusStrings={{
      unknown: 'Unknown',
      unverified: 'Unverified',
      weakly_verified: 'Weakly verified',
      verified: 'Verified',
      verified_by_user: 'Verified by you'
    }}
    textVerify='Verify'
  />
</div>;

export const UnknownStatus = Template.bind({});
UnknownStatus.args = {
  status: 'unknown'
};

export const WeaklyVerified = Template.bind({});
WeaklyVerified.args = {
  status: 'weakly_verified'
};

export const Verified = Template.bind({});
Verified.args = {
  status: 'verified'
};

export const VerifiedByUser = Template.bind({});
VerifiedByUser.args = {
  status: 'verified_by_user'
};

export const Loading = Template.bind({});
Loading.args = {
  status: 'unknown',
  isLoading: true
};
