import { Meta, StoryObj } from '@storybook/react-vite';

import { LyricsTypeBadge } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Lyrics/LyricsTypeBadge',
  component: LyricsTypeBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof LyricsTypeBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { type: 'wordSynced', variant: 'expanded', label: 'Word synced' },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground font-semibold">Expanded</h3>
        <div className="flex items-center gap-3">
          <LyricsTypeBadge
            type="wordSynced"
            variant="expanded"
            label="Word synced"
          />
          <LyricsTypeBadge
            type="lineSynced"
            variant="expanded"
            label="Line synced"
          />
          <LyricsTypeBadge type="plain" variant="expanded" label="Plain" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground font-semibold">Icon</h3>
        <div className="flex items-center gap-3">
          <LyricsTypeBadge
            type="wordSynced"
            variant="icon"
            label="Word synced"
          />
          <LyricsTypeBadge
            type="lineSynced"
            variant="icon"
            label="Line synced"
          />
          <LyricsTypeBadge type="plain" variant="icon" label="Plain" />
        </div>
      </div>
    </div>
  ),
};
