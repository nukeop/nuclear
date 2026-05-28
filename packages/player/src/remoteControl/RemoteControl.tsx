import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { NuclearJam } from '@nuclearplayer/ui';

import { useRemoteActions } from './useRemoteActions';
import { useRemoteState } from './useRemoteState';

const RemoteControl: FC = () => {
  const { t } = useTranslation('remote');
  const state = useRemoteState();
  const actions = useRemoteActions();

  if (state.connectionStatus === 'disconnected' || !state.synced) {
    return (
      <NuclearJam>
        <NuclearJam.Connecting
          labels={{
            title: t('connecting.title'),
            subtitle: t('connecting.subtitle'),
          }}
        />
      </NuclearJam>
    );
  }

  return (
    <NuclearJam>
      <NuclearJam.Header connectionStatus={state.connectionStatus} />
      {state.hasQueue && state.currentTrack && (
        <NuclearJam.NowPlaying
          title={state.currentTrack.title}
          artist={state.currentTrack.artist}
          coverUrl={state.currentTrack.coverUrl}
          isLoading={state.isLoading}
        />
      )}
      {state.hasQueue && (
        <NuclearJam.Controls
          isPlaying={state.isPlaying}
          isLoading={state.isLoading}
          shuffleActive={state.settings.shuffle}
          repeatMode={state.settings.repeat}
          isDiscoveryActive={state.settings.discovery}
          progress={state.progress}
          elapsedSeconds={state.elapsedSeconds}
          remainingSeconds={state.remainingSeconds}
          {...actions}
        />
      )}
      <NuclearJam.Queue
        items={state.queue.items}
        currentItemId={state.queue.currentItemId}
        labels={{
          title: t('queue.emptyTitle'),
          subtitle: t('queue.emptySubtitle'),
        }}
      />
    </NuclearJam>
  );
};

export default RemoteControl;
