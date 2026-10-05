import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import {
  LyricsSource,
  LyricsSourcePicker,
  LyricsTypeLabels,
} from '@nuclearplayer/ui';

const SOURCES: LyricsSource[] = [
  { id: 'alpha', name: 'Alpha Lyrics', type: 'wordSynced' },
  { id: 'beta', name: 'Beta Lyrics', type: 'lineSynced' },
  { id: 'gamma', name: 'Gamma Lyrics', type: 'lineSynced' },
  { id: 'delta', name: 'Delta Lyrics', type: 'plain' },
];

const TYPE_LABELS: LyricsTypeLabels = {
  wordSynced: 'Word synced',
  lineSynced: 'Line synced',
  plain: 'Plain',
};

const meta = {
  title: 'Components/Lyrics/LyricsSourcePicker',
  component: LyricsSourcePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof LyricsSourcePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sources: SOURCES,
    value: 'alpha',
    onValueChange: () => {},
    typeLabels: TYPE_LABELS,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div className="p-4">
        <LyricsSourcePicker {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};
