import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { StreamVerificationStatus } from '@nuclearplayer/model';
import {
  StreamVerification,
  type StreamVerificationLabels,
} from '@nuclearplayer/ui';

const labels: StreamVerificationLabels = {
  unverified: 'Unverified',
  weaklyVerified: 'Weakly verified',
  verified: 'Verified',
  verifiedByUser: 'Verified by you',
  verify: 'Verify',
  unverify: 'Unverify',
  help: 'How stream verification works',
  explanation:
    'Nuclear sometimes picks the wrong version of a song. When you hear the right one, press Verify, and other listeners will get that version first.',
  learnMore: 'Learn more',
};

const meta = {
  title: 'Components/StreamVerification',
  component: StreamVerification,
  tags: ['autodocs'],
} satisfies Meta<typeof StreamVerification>;

export default meta;
type Story = StoryObj<typeof StreamVerification>;

const statuses: StreamVerificationStatus[] = [
  'loading',
  'unverified',
  'weaklyVerified',
  'verified',
  'verifiedByUser',
];

export const AllStatuses: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {statuses.map((status) => (
        <StreamVerification
          key={status}
          status={status}
          labels={labels}
          onVerify={fn()}
          onUnverify={fn()}
          onLearnMore={fn()}
        />
      ))}
      <StreamVerification
        status="unverified"
        isDisabled
        labels={labels}
        onVerify={fn()}
        onUnverify={fn()}
        onLearnMore={fn()}
      />
    </div>
  ),
};
