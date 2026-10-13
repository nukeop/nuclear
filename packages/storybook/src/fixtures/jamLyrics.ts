import type { LineSyncedLyrics, PlainLyrics } from '@nuclearplayer/model';
import type { NuclearJamLyricsLabels } from '@nuclearplayer/ui';

export const LYRIC_LINES = [
  'Neon rain on the overpass',
  'Counting static in the glass',
  'Every signal fades too fast',
  'Hold the frequency, hold it still',
  'Batteries dying on the windowsill',
  'Turn the dial past the hiss and hum',
  'Waiting for the morning to come',
  'Play it back from the start again',
];

export const LINE_DURATION_MS = 4000;

export const OFFSET_STEP_MS = 100;

export const SYNCED_LYRICS: LineSyncedLyrics = {
  type: 'lineSynced',
  metadata: {},
  sections: [
    {
      lines: LYRIC_LINES.map((text, index) => ({
        startMs: index * LINE_DURATION_MS,
        endMs: (index + 1) * LINE_DURATION_MS,
        segments: [{ text }],
      })),
    },
  ],
};

export const PLAIN_LYRICS: PlainLyrics = {
  type: 'plain',
  metadata: {},
  sections: [{ lines: LYRIC_LINES.map((text) => ({ segments: [{ text }] })) }],
};

const offsetFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

export const formatOffset = (offsetMs: number) =>
  `${offsetFormat.format(offsetMs / 1000)} s`;

export const LYRICS_LABELS: NuclearJamLyricsLabels = {
  nothingPlayingTitle: 'Nothing is playing',
  nothingPlayingSubtitle: 'Play a track to see its lyrics here.',
  notFoundTitle: 'No lyrics for this track',
  notFoundSubtitle: 'No lyrics provider returned results.',
  instrumentalTitle: 'Instrumental',
  instrumentalSubtitle: 'This track has no lyrics.',
  errorTitle: 'Could not load lyrics',
  errorSubtitle: 'Check the connection to Nuclear and try again.',
  currentLine: 'Current line',
};
