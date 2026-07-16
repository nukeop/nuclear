import { v4 as uuidv4 } from 'uuid';

import type { HistoryEntry } from '../../services/tauri/bindings';

const THREE_MINUTES_MS = 3 * 60 * 1000;

export class HistoryEntryBuilder {
  private entry: HistoryEntry;

  constructor() {
    this.entry = {
      playId: uuidv4(),
      title: 'Test Track',
      artists: ['Test Artist'],
      albumTitle: 'Test Album',
      durationMs: THREE_MINUTES_MS,
      artworkUrl: null,
      provider: 'test',
      providerId: uuidv4(),
      startedAt: Date.now(),
      msPlayed: THREE_MINUTES_MS,
      endReason: 'finished',
      endPositionMs: THREE_MINUTES_MS,
    };
  }

  withTitle(title: string): this {
    this.entry.title = title;
    return this;
  }

  withArtists(artists: string[]): this {
    this.entry.artists = artists;
    return this;
  }

  withArtworkUrl(artworkUrl: string): this {
    this.entry.artworkUrl = artworkUrl;
    return this;
  }

  withStartedAt(startedAt: number): this {
    this.entry.startedAt = startedAt;
    return this;
  }

  build(): HistoryEntry {
    return { ...this.entry, artists: [...this.entry.artists] };
  }
}
