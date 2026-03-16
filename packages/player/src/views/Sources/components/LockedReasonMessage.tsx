import { HeadphonesIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';
import { Trans } from 'react-i18next';

import { ProviderPill } from './ProviderPill';

type LockedReasonMessageProps = {
  metadataName: string;
  streamingName: string;
};

export const LockedReasonMessage: FC<LockedReasonMessageProps> = ({
  metadataName,
  streamingName,
}) => (
  <Trans
    i18nKey="sources:lockedReason"
    values={{ metadataName, streamingName }}
    components={{
      metadata: (
        <ProviderPill
          Icon={SearchIcon}
          color="yellow"
          className="mx-1 align-middle"
        />
      ),
      streaming: (
        <ProviderPill
          Icon={HeadphonesIcon}
          color="cyan"
          className="mx-1 align-middle"
        />
      ),
    }}
  />
);
