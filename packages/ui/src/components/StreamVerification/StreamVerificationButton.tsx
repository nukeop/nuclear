import { FC } from 'react';

import type { StreamVerificationStatus } from '@nuclearplayer/model';

import { Button } from '../Button';
import { Skeleton } from '../Skeleton';
import type { StreamVerificationLabels } from './types';

type Action = 'verify' | 'unverify';

const actionByStatus: Record<
  Exclude<StreamVerificationStatus, 'loading'>,
  Action
> = {
  unverified: 'verify',
  weaklyVerified: 'verify',
  verified: 'verify',
  verifiedByUser: 'unverify',
};

type StreamVerificationButtonProps = {
  status: StreamVerificationStatus;
  isDisabled: boolean;
  onVerify: () => void;
  onUnverify: () => void;
  labels: StreamVerificationLabels;
};

export const StreamVerificationButton: FC<StreamVerificationButtonProps> = ({
  status,
  isDisabled,
  onVerify,
  onUnverify,
  labels,
}) => {
  if (status === 'loading') {
    return <Skeleton className="h-8 w-16" />;
  }

  const action = actionByStatus[status];
  const handlerByAction: Record<Action, () => void> = {
    verify: onVerify,
    unverify: onUnverify,
  };

  return (
    <Button size="xs" disabled={isDisabled} onClick={handlerByAction[action]}>
      {labels[action]}
    </Button>
  );
};
