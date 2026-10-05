import { Meta, StoryObj } from '@storybook/react-vite';

import type {
  SyncedLyricsLine as SyncedLyricsLineModel,
  TimedLyricsSegment,
} from '@nuclearplayer/model';
import { WordSyncedLyricsLine } from '@nuclearplayer/ui';

import { useSimulatedPlayback } from './hooks/useSimulatedPlayback';

const LINES: SyncedLyricsLineModel<TimedLyricsSegment>[] = [
  {
    startMs: 0,
    endMs: 3200,
    segments: [
      { text: 'Lorem ', startMs: 0, endMs: 350 },
      { text: 'ipsum ', startMs: 400, endMs: 900 },
      { text: 'dolor ', startMs: 950, endMs: 1200 },
      { text: 'sit ', startMs: 1300, endMs: 1500 },
      { text: 'amet, ', startMs: 1550, endMs: 2300 },
      { text: 'consectetur', startMs: 2400, endMs: 3200 },
    ],
  },
  {
    startMs: 3600,
    endMs: 6400,
    segments: [
      { text: 'Adipiscing ', startMs: 3600, endMs: 4500 },
      { text: 'elit ', startMs: 4550, endMs: 4800 },
      { text: 'sed ', startMs: 5000, endMs: 5200 },
      { text: 'do ', startMs: 5250, endMs: 5400 },
      { text: 'eiusmod ', startMs: 5450, endMs: 6000 },
      { text: 'tempor', startMs: 6050, endMs: 6400 },
    ],
  },
  {
    startMs: 6800,
    endMs: 9000,
    segments: [
      { text: 'Incididunt ', startMs: 6800, endMs: 7600 },
      { text: 'ut ', startMs: 7700, endMs: 7850 },
      { text: 'labore ', startMs: 7900, endMs: 8400 },
      { text: 'et ', startMs: 8450, endMs: 8600 },
      { text: 'dolore', startMs: 8650, endMs: 9000 },
    ],
  },
];

const JAPANESE_LINE: SyncedLyricsLineModel<TimedLyricsSegment> = {
  startMs: 0,
  endMs: 4000,
  segments: [
    { text: '空', ruby: 'そら', startMs: 0, endMs: 600 },
    { text: 'に', startMs: 600, endMs: 900 },
    { text: '星', ruby: 'ほし', startMs: 900, endMs: 1500 },
    { text: 'が', startMs: 1500, endMs: 1800 },
    { text: '光', ruby: 'ひか', startMs: 1800, endMs: 2400 },
    { text: 'る', startMs: 2400, endMs: 3000 },
  ],
  background: [{ text: 'ひかる', startMs: 3000, endMs: 4000 }],
  annotations: [
    {
      type: 'romanization',
      language: 'ja-Latn',
      text: 'Sora ni hoshi ga hikaru',
    },
    { type: 'translation', language: 'en', text: 'Stars shine in the sky' },
  ],
};

const meta = {
  title: 'Components/Lyrics/WordSyncedLyricsLine',
  component: WordSyncedLyricsLine,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="font-heading flex max-w-3xl flex-col p-10 text-3xl leading-tight font-bold tracking-tight font-stretch-semi-condensed">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WordSyncedLyricsLine>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlayingThroughLines: Story = {
  args: { line: LINES[0], positionMs: 0 },
  render: () => {
    const positionMs = useSimulatedPlayback(10000);
    return (
      <>
        {LINES.map((line) => (
          <WordSyncedLyricsLine
            key={line.startMs}
            line={line}
            positionMs={positionMs}
          />
        ))}
      </>
    );
  },
};

export const WithFuriganaAndAnnotations: Story = {
  args: { line: JAPANESE_LINE, positionMs: 0 },
  render: () => {
    const positionMs = useSimulatedPlayback(5000);
    return (
      <WordSyncedLyricsLine line={JAPANESE_LINE} positionMs={positionMs} />
    );
  },
};
