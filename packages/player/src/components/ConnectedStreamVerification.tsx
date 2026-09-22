import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { StreamVerification } from '@nuclearplayer/ui';

import { useStreamVerification } from '../hooks/useStreamVerification';

export const ConnectedStreamVerification: FC = () => {
  const { t } = useTranslation('queue');
  const { isVisible, ...verification } = useStreamVerification();

  if (!isVisible) {
    return null;
  }

  return (
    <StreamVerification
      {...verification}
      labels={{
        unverified: t('streamVerification.unverified'),
        weaklyVerified: t('streamVerification.weaklyVerified'),
        verified: t('streamVerification.verified'),
        verifiedByUser: t('streamVerification.verifiedByUser'),
        verify: t('streamVerification.verify'),
        unverify: t('streamVerification.unverify'),
      }}
    />
  );
};
