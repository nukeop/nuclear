import { Meta, StoryObj } from '@storybook/react-vite';

import { InstrumentalBreak } from '@nuclearplayer/ui';

import { useSimulatedPlayback } from './hooks/useSimulatedPlayback';

const meta = {
  title: 'Components/Lyrics/InstrumentalBreak',
  component: InstrumentalBreak,
  tags: ['autodocs'],
} satisfies Meta<typeof InstrumentalBreak>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playing: Story = {
  args: { startMs: 0, endMs: 5000, positionMs: 0 },
  render: () => {
    const positionMs = useSimulatedPlayback(5000);
    return (
      <InstrumentalBreak startMs={0} endMs={5000} positionMs={positionMs} />
    );
  },
};
