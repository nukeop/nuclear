import { Meta, StoryObj } from '@storybook/react-vite';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';
import { LineSyncedLyricsLine } from '@nuclearplayer/ui';

import { useSimulatedPlayback } from './hooks/useSimulatedPlayback';

const LINES: SyncedLyricsLineModel<LyricsSegment>[] = [
  {
    startMs: 0,
    endMs: 4000,
    segments: [{ text: 'Lorem ipsum dolor sit amet, consectetur' }],
  },
  {
    startMs: 4000,
    endMs: 8000,
    segments: [{ text: 'Adipiscing elit sed do eiusmod tempor' }],
  },
  {
    startMs: 8000,
    endMs: 12000,
    segments: [{ text: 'Incididunt ut labore et dolore magna aliqua' }],
  },
];

const JAPANESE_LINE: SyncedLyricsLineModel<LyricsSegment> = {
  startMs: 0,
  endMs: 4000,
  segments: [
    { text: '空', ruby: 'そら' },
    { text: 'に' },
    { text: '星', ruby: 'ほし' },
    { text: 'が' },
    { text: '光', ruby: 'ひか' },
    { text: 'る' },
  ],
  background: [{ text: 'ひかる' }],
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
  title: 'Components/Lyrics/LineSyncedLyricsLine',
  component: LineSyncedLyricsLine,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="font-heading flex max-w-3xl flex-col p-10 text-3xl leading-tight font-bold tracking-tight font-stretch-semi-condensed">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LineSyncedLyricsLine>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlayingThroughLines: Story = {
  args: { line: LINES[0], positionMs: 0 },
  render: () => {
    const positionMs = useSimulatedPlayback(12000);
    return (
      <>
        {LINES.map((line) => (
          <LineSyncedLyricsLine
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
      <LineSyncedLyricsLine line={JAPANESE_LINE} positionMs={positionMs} />
    );
  },
};
