import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { HistoryRow, HistoryRowLabels } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/HistoryRow',
  component: HistoryRow,
  tags: ['autodocs'],
} satisfies Meta<typeof HistoryRow>;

export default meta;
type Story = StoryObj<typeof HistoryRow>;

const labels: HistoryRowLabels = {
  favorite: 'Add to favorites',
  unfavorite: 'Remove from favorites',
  addToQueue: 'Add to queue',
};

const onAddToQueue = fn();
const onPlayNow = fn();
const onToggleFavorite = fn();

const InteractiveFavoriteRow = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <HistoryRow
      title="Paranoid Android"
      artist="Radiohead"
      time="11:55 AM"
      artworkUrl="https://picsum.photos/seed/okcomputer/64"
      labels={labels}
      isFavorite={isFavorite}
      onToggleFavorite={() => setIsFavorite((favorite) => !favorite)}
      onAddToQueue={onAddToQueue}
      onPlayNow={onPlayNow}
    />
  );
};

export const AllVariants: Story = {
  render: () => (
    <div className="border-border w-full max-w-3xl border-(length:--border-width) border-b-0">
      <InteractiveFavoriteRow />
      <HistoryRow
        title="Sit Down. Stand Up. (Snakes & Ladders)"
        artist="Radiohead"
        time="9:03 AM"
        artworkUrl="https://picsum.photos/seed/hail/64"
        labels={labels}
        onToggleFavorite={onToggleFavorite}
        onAddToQueue={onAddToQueue}
        onPlayNow={onPlayNow}
      />
      <HistoryRow
        title="Intro"
        artist="The xx"
        time="12:00 PM"
        labels={labels}
        onToggleFavorite={onToggleFavorite}
        onAddToQueue={onAddToQueue}
        onPlayNow={onPlayNow}
      />
      <HistoryRow
        title="Everything in Its Right Place"
        artist="A Very Long Artist Name That Should Truncate Somewhere"
        time="8:41 PM"
        artworkUrl="https://picsum.photos/seed/kida/64"
        labels={labels}
        onToggleFavorite={onToggleFavorite}
        onAddToQueue={onAddToQueue}
        onPlayNow={onPlayNow}
      />
    </div>
  ),
};
