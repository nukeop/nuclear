import { useState, type ComponentProps, type FC } from 'react';

import { StreamVerification } from '@nuclearplayer/ui';

type Status = ComponentProps<typeof StreamVerification>['status'];

const labels = {
  unverified: 'Unverified',
  weaklyVerified: 'Weakly verified',
  verified: 'Verified',
  verifiedByUser: 'Verified by you',
  verify: 'Verify',
  unverify: 'Unverify',
  help: 'How stream verification works',
  explanation:
    'Nuclear may sometimes play the wrong version of a song. To fix it, right-click the queue item and pick the right stream, then click Verify. Nuclear saves your verification on your computer and always plays that stream for the track.',
  learnMore: 'Learn more',
};

export const StreamVerificationDemo: FC = () => {
  const [status, setStatus] = useState<Status>('unverified');
  const [isBusy, setIsBusy] = useState(false);

  const changeStatus = (next: Status) => {
    setIsBusy(true);
    setTimeout(() => {
      setStatus(next);
      setIsBusy(false);
    }, 600);
  };

  return (
    <div className="themed-border border-border shadow-shadow surface-sidebar-right mx-auto w-full max-w-sm rounded-md">
      <StreamVerification
        status={status}
        isBusy={isBusy}
        onVerify={() => changeStatus('verifiedByUser')}
        onUnverify={() => changeStatus('unverified')}
        onLearnMore={() =>
          window.open(
            'https://docs.nuclearplayer.com/nuclear/core-concepts/stream-verification',
            '_blank',
          )
        }
        labels={labels}
        className="border-t-0"
      />
    </div>
  );
};
