import { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon, Trash2Icon } from 'lucide-react';

import { Button, Popover } from '@nuclearplayer/ui';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<Meta<typeof Popover>>;

export const Default: Story = {
  args: {
    trigger: <Button>Open Popover</Button>,
    children: 'Popover content',
    anchor: 'bottom',
  },
};

export const AllAnchors: Story = {
  render: () => (
    <div className="h-full w-full">
      <Popover
        className="relative"
        trigger={<Button className="relative flex">Opens top</Button>}
        children="Popover content"
        anchor="top"
      />
      <Popover
        className="relative"
        trigger={<Button>Opens below</Button>}
        children="Popover content"
        anchor="bottom"
      />
      <Popover
        className="relative"
        trigger={<Button>Opens right</Button>}
        children="Popover content"
        anchor="right"
      />
      <Popover
        className="relative"
        trigger={<Button>Opens left</Button>}
        children="Popover content"
        anchor="left"
      />
    </div>
  ),
};

export const SectionedMenu: Story = {
  render: () => (
    <Popover
      className="relative"
      panelClassName="bg-background px-0 py-0"
      trigger={<Button>Recent</Button>}
      anchor="bottom"
    >
      <Popover.Menu>
        <Popover.Section label="Recent searches">
          <Popover.Item onClick={() => console.log('nirvana')}>
            nirvana
          </Popover.Item>
          <Popover.Item onClick={() => console.log('pixies')}>
            pixies
          </Popover.Item>
        </Popover.Section>
        <Popover.Footer>
          <Popover.Item
            intent="danger"
            align="center"
            icon={<Trash2Icon size={16} />}
            onClick={() => console.log('clear')}
          >
            Clear recent searches
          </Popover.Item>
        </Popover.Footer>
      </Popover.Menu>
    </Popover>
  ),
};

export const DropdownMenu: Story = {
  render: () => (
    <Popover
      className="relative"
      panelClassName="bg-background px-0 py-0"
      trigger={<Button>Actions</Button>}
      anchor="bottom"
    >
      <Popover.Menu>
        <Popover.Item
          icon={<PencilIcon size={16} />}
          onClick={() => console.log('edit')}
        >
          Edit
        </Popover.Item>
        <Popover.Item onClick={() => console.log('duplicate')}>
          Duplicate
        </Popover.Item>
        <Popover.Item
          intent="danger"
          icon={<Trash2Icon size={16} />}
          onClick={() => console.log('delete')}
        >
          Delete
        </Popover.Item>
      </Popover.Menu>
    </Popover>
  ),
};
