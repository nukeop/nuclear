import type { Meta, StoryObj } from '@storybook/react-vite';
import { MusicIcon } from 'lucide-react';

import { Button } from '@nuclearplayer/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'secondary',
        'tertiary',
        'noShadow',
        'text',
        'ghost',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<Meta<typeof Button>>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary',
  },
};

export const NoShadow: Story = {
  args: {
    variant: 'noShadow',
    children: 'No Shadow',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <MusicIcon />,
  },
};

export const IconSmall: Story = {
  args: {
    size: 'icon-sm',
    children: <MusicIcon />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="noShadow">No Shadow</Button>
        <Button variant="text">Text</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <MusicIcon />
        </Button>
        <Button size="icon-sm">
          <MusicIcon />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
};
