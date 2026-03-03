import { useParams, useSearch } from '@tanstack/react-router';
import { useCallback, type FC } from 'react';

import { ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { PlaylistDetailHeader } from '../PlaylistDetail/components/PlaylistDetailHeader';
import { PlaylistImportActions } from './PlaylistImportActions';
import { usePlaylistFromProvider } from './usePlaylistFromProvider';
import { useSaveLocally } from './useSaveLocally';

export const PlaylistImport: FC = () => {
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
    <ViewShell
      data-testid="playlist-import-view"
      classes={{ scrollableArea: '[&>div>:first-child]:mb-2' }}
    >
      {playlist && (
        <PlaylistDetailHeader playlist={playlist}>
          <PlaylistImportActions tracks={tracks} onSaveLocally={saveLocally} />
        </PlaylistDetailHeader>
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
