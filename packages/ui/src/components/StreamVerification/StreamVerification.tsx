import { FC } from 'react';

import type { StreamVerificationStatus } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { StreamVerificationButton } from './StreamVerificationButton';
import { StreamVerificationStatusIndicator } from './StreamVerificationStatusIndicator';
import type { StreamVerificationLabels } from './types';

type StreamVerificationProps = {
  status: StreamVerificationStatus;
  isBusy?: boolean;
  isDisabled?: boolean;
  onVerify: () => void;
  onUnverify: () => void;
  labels: StreamVerificationLabels;
  className?: string;
};

export const StreamVerification: FC<StreamVerificationProps> = ({
  status,
  isBusy = false,
  isDisabled = false,
  onVerify,
  onUnverify,
  labels,
  className,
}) => (
  <div
    data-testid="stream-verification"
    className={cn(
      'border-border flex items-center justify-between border-t-(length:--border-width) px-3 py-2',
      className,
    )}
  >
    <StreamVerificationStatusIndicator status={status} labels={labels} />
    <StreamVerificationButton
      status={status}
      isDisabled={isBusy || isDisabled}
      onVerify={onVerify}
      onUnverify={onUnverify}
      labels={labels}
    />
  </div>
);
