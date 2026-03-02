import { useState } from 'react';

import type { Playlist } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';

import { usePlaylistStore } from '../../../stores/playlistStore';

const getCoverUrl = (playlist: Playlist): string | undefined => {
  const playlistCover = pickArtwork(playlist.artwork, 'cover', 600);
  if (playlistCover) {
    return playlistCover.url;
  }

  const firstTrackArt = playlist.items[0]?.track.artwork;
  return pickArtwork(firstTrackArt, 'cover', 600)?.url;
};

export const usePlaylistDetailHeader = (playlist: Playlist) => {
  const updatePlaylist = usePlaylistStore((state) => state.updatePlaylist);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editDescription, setEditDescription] = useState(
    playlist.description ?? '',
  );

  const coverUrl = getCoverUrl(playlist);

  const startEditing = () => setIsEditing(true);

  const save = () => {
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();

    if (trimmedName && trimmedName !== playlist.name) {
      updatePlaylist(playlist.id, { name: trimmedName });
    }
    if (trimmedDescription !== (playlist.description ?? '')) {
      updatePlaylist(playlist.id, {
        description: trimmedDescription || undefined,
      });
    }

    setIsEditing(false);
  };

  const cancel = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description ?? '');
    setIsEditing(false);
  };

  return {
    isEditing,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    coverUrl,
    startEditing,
    save,
    cancel,
  };
};
