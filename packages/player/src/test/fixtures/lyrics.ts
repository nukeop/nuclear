import type {
  InstrumentalLyrics,
  LineSyncedLyrics,
  LyricsCandidate,
  PlainLyrics,
  WordSyncedLyrics,
} from '@nuclearplayer/model';

export const FIRST_CANDIDATE: LyricsCandidate = {
  id: 'candidate-1',
  title: 'Test Song',
  artist: 'Test Artist',
};

export const SECOND_CANDIDATE: LyricsCandidate = {
  id: 'candidate-2',
  title: 'Test Song (Live)',
  artist: 'Test Artist',
};

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
