import { useState } from 'react';

import type { Playlist } from '@nuclearplayer/model';

import { usePlaylistStore } from '../../../stores/playlistStore';

export const usePlaylistDetailHeader = (playlist: Playlist) => {
  const updatePlaylist = usePlaylistStore((state) => state.updatePlaylist);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editDescription, setEditDescription] = useState(
    playlist.description ?? '',
  );

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
    startEditing,
    save,
    cancel,
  };
};
