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

    const updates: Partial<Pick<Playlist, 'name' | 'description'>> = {};
    if (trimmedName && trimmedName !== playlist.name) {
      updates.name = trimmedName;
    }
    if (trimmedDescription !== (playlist.description ?? '')) {
      updates.description = trimmedDescription || undefined;
    }

    if (Object.keys(updates).length > 0) {
      updatePlaylist(playlist.id, updates);
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
