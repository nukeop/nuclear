import { Meta, StoryObj } from '@storybook/react-vite';

import { LyricsSectionLabel } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Lyrics/LyricsSectionLabel',
  component: LyricsSectionLabel,
  tags: ['autodocs'],
} satisfies Meta<typeof LyricsSectionLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-4">
      <LyricsSectionLabel>Verse 1</LyricsSectionLabel>
      <LyricsSectionLabel>Pre-chorus</LyricsSectionLabel>
      <LyricsSectionLabel>Chorus</LyricsSectionLabel>
    </div>
  ),
};
