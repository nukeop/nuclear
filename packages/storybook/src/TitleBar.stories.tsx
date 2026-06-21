import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TitleBar } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/TitleBar',
  component: TitleBar,
  tags: ['autodocs'],
  args: {
    onMinimize: fn(),
    onMaximize: fn(),
    onClose: fn(),
    onStartDrag: fn(),
    labels: {
      minimize: 'Minimize',
      maximize: 'Maximize',
      close: 'Close',
    },
  },
} satisfies Meta<typeof TitleBar>;

export default meta;
type Story = StoryObj<typeof TitleBar>;

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-foreground/50 mb-2 text-sm">macOS</p>
        <TitleBar
          {...args}
          title="Nuclear Music Player"
          styleOverride="macos"
        />
      </div>
      <div>
        <p className="text-foreground/50 mb-2 text-sm">Windows / Linux</p>
        <TitleBar
          {...args}
          title="Nuclear Music Player"
          styleOverride="windows"
        />
      </div>
    </div>
  ),
};
