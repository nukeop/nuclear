import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { NuclearJam } from '@nuclearplayer/ui';

import { SearchDrawerContent } from './SearchDrawerContent';
import { useRemoteActions } from './useRemoteActions';
import { useRemoteSearch } from './useRemoteSearch';
import { useRemoteState } from './useRemoteState';

const RemoteControl: FC = () => {
  const { t } = useTranslation('remote');
  const state = useRemoteState();
  const actions = useRemoteActions();
  const search = useRemoteSearch();

  if (state.connectionStatus === 'failed') {
    return (
      <NuclearJam>
        <NuclearJam.Error
          labels={{
            title: t('error.title'),
            subtitle: t('error.subtitle'),
          }}
        />
      </NuclearJam>
    );
  }

  if (!state.synced || state.connectionStatus === 'connecting') {
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
      <NuclearJam.Header
        connectionStatus={state.connectionStatus}
        connectionStatusLabels={{
          connecting: t('connection.connecting'),
          connected: t('connection.connected'),
          reconnecting: t('connection.reconnecting'),
          failed: t('connection.failed'),
        }}
      >
        <NuclearJam.SearchBar
          value={search.query}
          onChange={search.setQuery}
          labels={{ placeholder: t('search.placeholder') }}
        />
      </NuclearJam.Header>
      <NuclearJam.Content>
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
          onRemove={actions.onRemoveFromQueue}
          labels={{
            upNext: t('queue.upNext'),
            title: t('queue.emptyTitle'),
            subtitle: t('queue.emptySubtitle'),
          }}
        />
        <NuclearJam.SearchDrawer
          open={search.query.length > 0}
          onBackdropClick={() => search.setQuery('')}
        >
          <SearchDrawerContent
            isError={search.isError}
            isSuccess={search.isSuccess}
            tracks={search.tracks}
            onAdd={(track: Track) => {
              actions.onAddToQueue(track);
              search.setQuery('');
            }}
          />
        </NuclearJam.SearchDrawer>
      </NuclearJam.Content>
    </NuclearJam>
  );
};

export default RemoteControl;
