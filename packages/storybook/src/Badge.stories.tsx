import { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['dot', 'pill'],
    },
    color: {
      control: { type: 'select' },
      options: ['green', 'cyan', 'orange', 'red', 'yellow'],
    },
    animated: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground font-semibold">Dots</h3>
        <div className="flex items-center gap-3">
          <Badge variant="dot" color="green" />
          <Badge variant="dot" color="cyan" />
          <Badge variant="dot" color="orange" />
          <Badge variant="dot" color="red" />
          <Badge variant="dot" color="yellow" />
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="dot" color="green" animated />
          <Badge variant="dot" color="cyan" animated />
          <Badge variant="dot" color="orange" animated />
          <Badge variant="dot" color="red" animated />
          <Badge variant="dot" color="yellow" animated />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground font-semibold">Pills</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="pill" color="green">
            NEW
          </Badge>
          <Badge variant="pill" color="cyan">
            Update
          </Badge>
          <Badge variant="pill" color="orange">
            Beta
          </Badge>
          <Badge variant="pill" color="red">
            Error
          </Badge>
          <Badge variant="pill" color="yellow">
            Warning
          </Badge>
          <Badge variant="pill" color="inverted">
            Inverted
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="pill" color="green" animated>
            Live
          </Badge>
          <Badge variant="pill" color="cyan" animated>
            Updating
          </Badge>
        </div>
      </div>
    </div>
  ),
};
