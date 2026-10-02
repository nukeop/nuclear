import { Meta, StoryObj } from '@storybook/react-vite';
import { FC, ReactNode, useEffect, useState } from 'react';

import type {
  LyricsSegment,
  SyncedLyricsLine as SyncedLyricsLineModel,
} from '@nuclearplayer/model';
import { SyncedLyricsLine } from '@nuclearplayer/ui';

const LINE_DURATION_MS = 4000;
const TICK_MS = 250;

const line = (
  text: string,
  index: number,
): SyncedLyricsLineModel<LyricsSegment> => ({
  startMs: index * LINE_DURATION_MS,
  endMs: (index + 1) * LINE_DURATION_MS,
  segments: [{ text }],
});

const LINES = [
  'Lorem ipsum dolor sit amet, consectetur',
  'Adipiscing elit sed do eiusmod tempor',
  'Incididunt ut labore et dolore magna aliqua',
].map(line);

const JAPANESE_LINE: SyncedLyricsLineModel<LyricsSegment> = {
  startMs: 0,
  endMs: LINE_DURATION_MS,
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

const useLoopingPosition = (durationMs: number) => {
  const [positionMs, setPositionMs] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPositionMs((position) => (position + TICK_MS) % durationMs),
      TICK_MS,
    );
    return () => clearInterval(interval);
  }, [durationMs]);

  return positionMs;
};

const LyricsText: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="font-heading flex max-w-3xl flex-col p-10 text-3xl leading-tight font-bold tracking-tight font-stretch-semi-condensed">
    {children}
  </div>
);

const meta = {
  title: 'Components/Lyrics/SyncedLyricsLine',
  component: SyncedLyricsLine,
  tags: ['autodocs'],
} satisfies Meta<typeof SyncedLyricsLine>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlayingThroughLines: Story = {
  args: { line: LINES[0], positionMs: 0 },
  render: () => {
    const positionMs = useLoopingPosition(LINES.length * LINE_DURATION_MS);
    return (
      <LyricsText>
        {LINES.map((lyricsLine) => (
          <SyncedLyricsLine
            key={lyricsLine.startMs}
            line={lyricsLine}
            positionMs={positionMs}
          />
        ))}
      </LyricsText>
    );
  },
};

export const WithFuriganaAndAnnotations: Story = {
  args: { line: JAPANESE_LINE, positionMs: 0 },
  render: () => {
    const positionMs = useLoopingPosition(LINE_DURATION_MS);
    return (
      <LyricsText>
        <SyncedLyricsLine line={JAPANESE_LINE} positionMs={positionMs} />
      </LyricsText>
    );
  },
};
