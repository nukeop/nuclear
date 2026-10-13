import { Outlet } from '@tanstack/react-router';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { NuclearJam } from '@nuclearplayer/ui';

import { useRemoteStore } from './remoteStore';
import { useRemoteConnection } from './useRemoteConnection';
import { useRemoteLanguage } from './useRemoteLanguage';
import { useRemoteTheme } from './useRemoteTheme';

const RemoteRootContent: FC = () => {
  const { t } = useTranslation('remote');
  const connectionStatus = useRemoteStore((state) => state.connectionStatus);
  const synced = useRemoteStore((state) => state.synced);

  if (connectionStatus === 'failed') {
    return (
      <NuclearJam.Error
        labels={{
          title: t('error.title'),
          subtitle: t('error.subtitle'),
        }}
      />
    );
  }

  if (!synced || connectionStatus === 'connecting') {
    return (
      <NuclearJam.Connecting
        labels={{
          title: t('connecting.title'),
          subtitle: t('connecting.subtitle'),
        }}
      />
    );
  }

  return <Outlet />;
};

export const RemoteRoot: FC = () => {
  useRemoteConnection();
  useRemoteTheme();
  useRemoteLanguage();

  return (
    <NuclearJam>
      <RemoteRootContent />
    </NuclearJam>
  );
};
