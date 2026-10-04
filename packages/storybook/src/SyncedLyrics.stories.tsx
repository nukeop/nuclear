import { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentProps, FC, useRef } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';
import { ScrollableArea, SyncedLyrics } from '@nuclearplayer/ui';

import { useSimulatedPlayback } from './hooks/useSimulatedPlayback';

const LABELS = { currentLine: 'Current line' };

const LINE_SYNCED_LYRICS: LineSyncedLyrics = {
  type: 'lineSynced',
  metadata: {},
  sections: [
    {
      label: 'Verse 1',
      lines: [
        {
          startMs: 0,
          endMs: 3000,
          segments: [{ text: 'Lorem ipsum dolor sit amet' }],
        },
        {
          startMs: 3000,
          endMs: 6000,
          segments: [{ text: 'Consectetur adipiscing elit' }],
        },
        {
          startMs: 6000,
          endMs: 9000,
          segments: [{ text: 'Sed do eiusmod tempor incididunt' }],
        },
        {
          startMs: 9000,
          endMs: 12000,
          segments: [{ text: 'Ut labore et dolore magna aliqua' }],
        },
      ],
    },
    {
      label: 'Chorus',
      lines: [
        {
          startMs: 13000,
          endMs: 16000,
          segments: [{ text: 'Ut enim ad minim veniam' }],
          background: [{ text: 'minim veniam' }],
        },
        {
          startMs: 16000,
          endMs: 19000,
          segments: [{ text: 'Quis nostrud exercitation' }],
        },
        {
          startMs: 19000,
          endMs: 22000,
          segments: [{ text: 'Ullamco laboris nisi ut aliquip' }],
        },
        {
          startMs: 22000,
          endMs: 25000,
          segments: [{ text: 'Ex ea commodo consequat' }],
        },
      ],
    },
    {
      label: 'Verse 2',
      lines: [
        {
          startMs: 26000,
          endMs: 29000,
          segments: [{ text: 'Duis aute irure dolor' }],
        },
        {
          startMs: 29000,
          endMs: 32000,
          segments: [{ text: 'In reprehenderit in voluptate' }],
        },
        {
          startMs: 32000,
          endMs: 35000,
          segments: [{ text: 'Velit esse cillum dolore' }],
        },
        {
          startMs: 35000,
          endMs: 38000,
          segments: [{ text: 'Eu fugiat nulla pariatur' }],
        },
      ],
    },
  ],
};

const WORD_SYNCED_LYRICS: WordSyncedLyrics = {
  type: 'wordSynced',
  metadata: {},
  sections: [
    {
      lines: [
        {
          startMs: 0,
          endMs: 2400,
          segments: [
            { text: 'Lorem ', startMs: 0, endMs: 400 },
            { text: 'ipsum ', startMs: 450, endMs: 900 },
            { text: 'dolor ', startMs: 950, endMs: 1500 },
            { text: 'sit ', startMs: 1550, endMs: 1800 },
            { text: 'amet', startMs: 1850, endMs: 2400 },
          ],
        },
        {
          startMs: 2800,
          endMs: 5000,
          segments: [
            { text: 'Consectetur ', startMs: 2800, endMs: 3700 },
            { text: 'adipiscing ', startMs: 3750, endMs: 4500 },
            { text: 'elit', startMs: 4550, endMs: 5000 },
          ],
        },
        {
          startMs: 5400,
          endMs: 7600,
          segments: [
            { text: 'Sed ', startMs: 5400, endMs: 5700 },
            { text: 'do ', startMs: 5750, endMs: 5950 },
            { text: 'eiusmod ', startMs: 6000, endMs: 6800 },
            { text: 'tempor', startMs: 6850, endMs: 7600 },
          ],
        },
        {
          startMs: 8000,
          endMs: 10400,
          segments: [
            { text: 'Ut ', startMs: 8000, endMs: 8200 },
            { text: 'labore ', startMs: 8250, endMs: 8900 },
            { text: 'et ', startMs: 8950, endMs: 9100 },
            { text: 'dolore ', startMs: 9150, endMs: 9700 },
            { text: 'magna', startMs: 9750, endMs: 10400 },
          ],
        },
        {
          startMs: 10800,
          endMs: 13000,
          segments: [
            { text: 'Ut ', startMs: 10800, endMs: 11000 },
            { text: 'enim ', startMs: 11050, endMs: 11500 },
            { text: 'ad ', startMs: 11550, endMs: 11750 },
            { text: 'minim ', startMs: 11800, endMs: 12400 },
            { text: 'veniam', startMs: 12450, endMs: 13000 },
          ],
        },
        {
          startMs: 13400,
          endMs: 15800,
          segments: [
            { text: 'Quis ', startMs: 13400, endMs: 13800 },
            { text: 'nostrud ', startMs: 13850, endMs: 14600 },
            { text: 'exercitation', startMs: 14650, endMs: 15800 },
          ],
        },
      ],
    },
  ],
};

const meta = {
  title: 'Components/Lyrics/SyncedLyrics',
  component: SyncedLyrics,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex h-96 max-w-3xl flex-col p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SyncedLyrics>;

export default meta;

type Story = StoryObj<typeof meta>;

type ScrollingSyncedLyricsProps = ComponentProps<typeof SyncedLyrics> & {
  durationMs: number;
};

const ScrollingSyncedLyrics: FC<ScrollingSyncedLyricsProps> = ({
  durationMs,
  ...props
}) => {
  const positionMs = useSimulatedPlayback(durationMs);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  return (
    <ScrollableArea
      viewportRef={viewportRef}
      className="text-3xl"
      viewportClassName="scroll-smooth mask-y-from-95%"
    >
      <SyncedLyrics
        {...props}
        positionMs={positionMs}
        viewportRef={viewportRef}
      />
    </ScrollableArea>
  );
};

export const LineSynced: Story = {
  args: {
    lyrics: LINE_SYNCED_LYRICS,
    positionMs: 0,
    onSeek: () => {},
    labels: LABELS,
    viewportRef: { current: null },
  },
  render: (args) => <ScrollingSyncedLyrics {...args} durationMs={39000} />,
};

export const WordSynced: Story = {
  args: {
    lyrics: WORD_SYNCED_LYRICS,
    positionMs: 0,
    onSeek: () => {},
    labels: LABELS,
    viewportRef: { current: null },
  },
  render: (args) => <ScrollingSyncedLyrics {...args} durationMs={16500} />,
};
