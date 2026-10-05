import type {
  InstrumentalLyrics,
  LineSyncedLyrics,
  PlainLyrics,
  WordSyncedLyrics,
} from '@nuclearplayer/model';

export const PLAIN_LYRICS: PlainLyrics = {
  type: 'plain',
  metadata: {},
  sections: [{ lines: [{ segments: [{ text: 'Plain line' }] }] }],
};

export const LINE_SYNCED_LYRICS: LineSyncedLyrics = {
  type: 'lineSynced',
  metadata: {},
  sections: [
    {
      lines: [
        { startMs: 1000, endMs: 4000, segments: [{ text: 'Synced line' }] },
      ],
    },
  ],
};

export const WORD_SYNCED_LYRICS: WordSyncedLyrics = {
  type: 'wordSynced',
  metadata: {},
  sections: [
    {
      lines: [
        {
          startMs: 1000,
          endMs: 2000,
          segments: [{ text: 'Word', startMs: 1000, endMs: 2000 }],
        },
      ],
    },
  ],
};

export const INSTRUMENTAL_LYRICS: InstrumentalLyrics = {
  type: 'instrumental',
  metadata: {},
};
