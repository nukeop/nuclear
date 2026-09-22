import { FC } from 'react';

import type { StreamVerificationStatus } from '@nuclearplayer/model';

import { Badge } from '../Badge';
import { StreamVerificationSkeleton } from './StreamVerificationSkeleton';
import type { StreamVerificationLabels } from './types';

type LoadedStatus = Exclude<StreamVerificationStatus, 'loading'>;

type Indicator = {
  labelKey: keyof StreamVerificationLabels;
  color: 'secondary' | 'yellow' | 'green' | 'blue';
};

const indicatorByStatus: Record<LoadedStatus, Indicator> = {
  unverified: { labelKey: 'unverified', color: 'secondary' },
  weaklyVerified: { labelKey: 'weaklyVerified', color: 'yellow' },
  verified: { labelKey: 'verified', color: 'green' },
  verifiedByUser: { labelKey: 'verifiedByUser', color: 'blue' },
};

type StreamVerificationStatusIndicatorProps = {
  status: StreamVerificationStatus;
  labels: StreamVerificationLabels;
};

export const StreamVerificationStatusIndicator: FC<
  StreamVerificationStatusIndicatorProps
> = ({ status, labels }) => {
  if (status === 'loading') {
    return <StreamVerificationSkeleton />;
  }

  const indicator = indicatorByStatus[status];

  return (
    <span className="text-muted-foreground flex items-center gap-2 text-sm">
      <Badge variant="dot" color={indicator.color} />
      {labels[indicator.labelKey]}
    </span>
  );
};
