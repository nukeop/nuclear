import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollableArea } from '@nuclearplayer/ui';

const meta: Meta<typeof ScrollableArea> = {
  title: 'Components/ScrollableArea',
  component: ScrollableArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const VerticalContent = () => (
  <div className="w-64 space-y-4">
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="bg-primary border-border text-foreground flex h-16 items-center justify-center rounded-md border-(length:--border-width) p-4"
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

const HorizontalContent = () => (
  <div className="flex h-64 space-x-4">
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="bg-primary border-border text-foreground flex w-32 flex-shrink-0 items-center justify-center rounded-md border-(length:--border-width) p-4"
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

const BothScrollContent = () => (
  <div className="space-y-4">
    {Array.from({ length: 20 }, (_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: 10 }, (_, j) => (
          <div
            key={j}
            className="bg-primary border-border text-foreground flex h-16 w-32 flex-shrink-0 items-center justify-center rounded-md border-(length:--border-width) p-2 text-sm"
          >
            {i + 1}-{j + 1}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const VerticalScroll: Story = {
  render: () => (
    <div className="border-border h-96 w-80 border-(length:--border-width)">
      <ScrollableArea>
        <VerticalContent />
      </ScrollableArea>
    </div>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <div className="border-border h-80 w-80 border-(length:--border-width)">
      <ScrollableArea>
        <HorizontalContent />
      </ScrollableArea>
    </div>
  ),
};

export const BothScrolls: Story = {
  render: () => (
    <div className="border-border h-96 w-96 border-(length:--border-width)">
      <ScrollableArea>
        <BothScrollContent />
      </ScrollableArea>
    </div>
  ),
};
