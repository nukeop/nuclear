import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import {
  HistoryDayGroup,
  HistoryRow,
  HistoryRowLabels,
} from '@nuclearplayer/ui';

const meta = {
  title: 'Components/HistoryDayGroup',
  component: HistoryDayGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof HistoryDayGroup>;

export default meta;
type Story = StoryObj<typeof HistoryDayGroup>;

const labels: HistoryRowLabels = {
  favorite: 'Add to favorites',
  unfavorite: 'Remove from favorites',
  addToQueue: 'Add to queue',
};

const onToggleFavorite = fn();
const onAddToQueue = fn();
const onPlayNow = fn();

export const GroupedByDay: Story = {
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <HistoryDayGroup marker="Today">
        <HistoryRow
          title="Paranoid Android"
          artist="Radiohead"
          time="11:55 AM"
          artworkUrl="https://picsum.photos/seed/okcomputer/64"
          labels={labels}
          onToggleFavorite={onToggleFavorite}
          onAddToQueue={onAddToQueue}
          onPlayNow={onPlayNow}
        />
        <HistoryRow
          title="Intro"
          artist="The xx"
          time="9:03 AM"
          labels={labels}
          onToggleFavorite={onToggleFavorite}
          onAddToQueue={onAddToQueue}
          onPlayNow={onPlayNow}
        />
      </HistoryDayGroup>
      <HistoryDayGroup marker="July 8, 2026">
        <HistoryRow
          title="Everything in Its Right Place"
          artist="Radiohead"
          time="8:41 PM"
          artworkUrl="https://picsum.photos/seed/kida/64"
          labels={labels}
          onToggleFavorite={onToggleFavorite}
          onAddToQueue={onAddToQueue}
          onPlayNow={onPlayNow}
        />
      </HistoryDayGroup>
    </div>
  ),
};
