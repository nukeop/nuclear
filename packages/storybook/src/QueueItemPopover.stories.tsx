import type { Meta, StoryObj } from '@storybook/react-vite';

import { QueueItemPopover } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/QueueItemPopover',
  component: QueueItemPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QueueItemPopover>;

export default meta;
type Story = StoryObj<Meta<typeof QueueItemPopover>>;

export const Default: Story = {
  render: () => (
    <QueueItemPopover
      content={
        <div className="p-4">
          <p className="text-sm">Stream info will go here</p>
        </div>
      }
    >
      <div className="bg-primary rounded-md border border-2 px-4 py-2">
        Right click me
      </div>
    </QueueItemPopover>
  ),
};
