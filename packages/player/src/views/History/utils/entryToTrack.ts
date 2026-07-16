import type { ArtworkSet, Track } from '@nuclearplayer/model';

import type { HistoryEntry } from '../../../services/tauri/bindings';

const artworkFrom = (url: string | null): ArtworkSet | undefined => {
  if (url === null) {
    return undefined;
  }
  return { items: [{ url, purpose: 'thumbnail' }] };
};

export const entryToTrack = (entry: HistoryEntry): Track | null => {
  if (entry.provider === null || entry.providerId === null) {
    return null;
  }

  return {
    title: entry.title,
    artists: entry.artists.map((name) => ({ name, roles: [] })),
    durationMs: entry.durationMs ?? undefined,
    artwork: artworkFrom(entry.artworkUrl),
    source: { provider: entry.provider, id: entry.providerId },
  };
};
