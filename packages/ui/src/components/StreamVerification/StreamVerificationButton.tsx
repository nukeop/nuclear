import { FC } from 'react';

import type { StreamVerificationStatus } from '@nuclearplayer/model';

import { Button } from '../Button';
import type { StreamVerificationLabels } from './types';

type Action = 'verify' | 'unverify';

const actionByStatus: Record<StreamVerificationStatus, Action> = {
  loading: 'verify',
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
  const action = actionByStatus[status];
  const handlerByAction: Record<Action, () => void> = {
    verify: onVerify,
    unverify: onUnverify,
  };

  return (
    <Button
      size="xs"
      variant="ghost"
      disabled={isDisabled || status === 'loading'}
      onClick={handlerByAction[action]}
    >
      {labels[action]}
    </Button>
  );
};
