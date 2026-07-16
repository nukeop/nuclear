import { useTrackActions } from '../../../hooks/useTrackActions';
import type { HistoryEntry } from '../../../services/tauri/bindings';
import { entryToTrack } from '../utils/entryToTrack';

export type HistoryRowActions = {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToQueue: () => void;
  onPlayNow: () => void;
};

export const useHistoryRowActions = () => {
  const trackActions = useTrackActions();

  return (entry: HistoryEntry): HistoryRowActions | null => {
    const track = entryToTrack(entry);
    if (track === null) {
      return null;
    }

    return {
      isFavorite: trackActions.isFavorite(track),
      onToggleFavorite: () => trackActions.toggleFavorite(track),
      onAddToQueue: () => trackActions.addToQueue(track),
      onPlayNow: () => trackActions.playNow(track),
    };
  };
};
