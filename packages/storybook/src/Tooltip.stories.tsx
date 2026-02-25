import { Meta, StoryObj } from '@storybook/react-vite';
import {
  BlocksIcon,
  PaletteIcon,
  ScrollTextIcon,
  SettingsIcon,
} from 'lucide-react';

import { Button, Tooltip } from '@nuclearplayer/ui';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<Meta<typeof Tooltip>>;

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-16 p-20">
      <Tooltip content="Top tooltip" side="top">
        <Button>Top</Button>
      </Tooltip>

      <div className="flex items-center gap-24">
        <Tooltip content="Left tooltip" side="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip content="Right tooltip (default)" side="right">
          <Button>Right</Button>
        </Tooltip>
      </div>

      <Tooltip content="Bottom tooltip" side="bottom">
        <Button>Bottom</Button>
      </Tooltip>
    </div>
  ),
};

export const SidebarIcons: Story = {
  render: () => (
    <div className="bg-background-secondary flex flex-col items-center gap-2 rounded-md p-2">
      <Tooltip content="Settings" side="right">
        <Button variant="text" size="icon">
          <SettingsIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Plugins" side="right">
        <Button variant="text" size="icon">
          <BlocksIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Themes" side="right">
        <Button variant="text" size="icon">
          <PaletteIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Logs" side="right">
        <Button variant="text" size="icon">
          <ScrollTextIcon />
        </Button>
      </Tooltip>
    </div>
  ),
};

export const WithReactNodeContent: Story = {
  render: () => (
    <div className="p-20">
      <Tooltip
        content={
          <span className="flex items-center gap-2">
            <SettingsIcon size={14} />
            Settings
          </span>
        }
        side="right"
      >
        <Button variant="text" size="icon">
          <SettingsIcon />
        </Button>
      </Tooltip>
    </div>
  ),
};
