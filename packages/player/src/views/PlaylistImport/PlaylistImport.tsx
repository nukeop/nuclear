import { useParams, useSearch } from '@tanstack/react-router';
import { SaveIcon } from 'lucide-react';
import { useCallback, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { PlaylistDetailHeader } from '../PlaylistDetail/components/PlaylistDetailHeader';
import { usePlaylistFromProvider } from './usePlaylistFromProvider';
import { useSaveLocally } from './useSaveLocally';

export const PlaylistImport: FC = () => {
  const { t } = useTranslation('playlists');
  const { providerId } = useParams({
    from: '/playlists/import/$providerId',
  });
  const { url } = useSearch({ from: '/playlists/import/$providerId' });

  const { playlist, items, tracks } = usePlaylistFromProvider(providerId, url);
  const { saveLocally } = useSaveLocally(playlist);

  const getItemId = useCallback(
    (_track: unknown, index: number) => items[index]?.id ?? String(index),
    [items],
  );

  return (
    <ViewShell data-testid="playlist-import-view" title={playlist?.name ?? ''}>
      {playlist && <PlaylistDetailHeader playlist={playlist} />}
      {playlist && (
        <Button
          data-testid="save-locally-button"
          variant="default"
          onClick={saveLocally}
        >
          <SaveIcon size={16} />
          {t('saveLocally')}
        </Button>
      )}
      {tracks.length > 0 && (
        <ConnectedTrackTable
          tracks={tracks}
          getItemId={getItemId}
          features={{ header: true, reorderable: false }}
          display={{
            displayThumbnail: true,
            displayArtist: true,
            displayDuration: tracks.some((track) => track.durationMs != null),
            displayQueueControls: true,
            displayDeleteButton: false,
          }}
        />
      )}
    </ViewShell>
  );
};
