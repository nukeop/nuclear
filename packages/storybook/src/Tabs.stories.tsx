import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Box, Card, CardGrid, Loader, Tabs } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  {
    id: 'artists',
    label: 'Artists',
    content: (
      <div className="text-foreground">
        <CardGrid>
          {[
            'Frank Zappa',
            'Ozzy Osbourne',
            'David Bowie',
            'Kurt Cobain',
            'John Lennon',
          ].map((item) => (
            <Card
              key={item}
              title={item}
              src={`https://picsum.photos/seed/${item}/300`}
            />
          ))}
        </CardGrid>
      </div>
    ),
  },
  {
    id: 'tracks',
    label: 'Tracks',
    content: (
      <div className="text-foreground">
        <Loader /> Still loading!
      </div>
    ),
  },
  {
    id: 'about',
    label: 'About',
    content: (
      <div className="text-foreground">
        <Box>Section in a box.</Box>
      </div>
    ),
  },
];

export const Basic: Story = {
  args: {
    items: ITEMS,
  },
};

export const WithCustomClasses: Story = {
  args: {
    items: ITEMS,
    listClassName: 'border-b-(length:--border-width) border-border pb-1',
    tabClassName: 'rounded-t',
    panelsClassName: 'mt-4',
  },
};

export const Controlled: Story = {
  render: () => {
    const [index, setIndex] = useState(1);
    return (
      <div style={{ width: 480 }}>
        <Tabs items={ITEMS} selectedIndex={index} onChange={setIndex} />
        <div className="text-foreground mt-2 text-sm">
          Selected index: {index}
        </div>
      </div>
    );
  },
};

export const ManualActivation: Story = {
  args: {
    items: ITEMS,
    manual: true,
  },
};

export const Composition: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Tab>First</Tabs.Tab>
          <Tabs.Tab>Second</Tabs.Tab>
          <Tabs.Tab disabled>Disabled</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>
            <div className="text-foreground">First panel content</div>
          </Tabs.Panel>
          <Tabs.Panel>
            <div className="text-foreground">Second panel content</div>
          </Tabs.Panel>
          <Tabs.Panel>
            <div className="text-foreground">Disabled panel content</div>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>
    </div>
  ),
};
