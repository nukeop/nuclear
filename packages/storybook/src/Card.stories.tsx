import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { ComponentProps, FC, useState } from 'react';

import { Card, Popover } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    imageReveal: { control: 'boolean' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const cover = 'https://picsum.photos/300';

export const Default: Story = {
  args: {
    src: cover,
    title: 'Random Album',
    subtitle: 'Some Artist',
  },
};

export const WithActions: Story = {
  args: {
    src: cover,
    title: 'Random Album',
    subtitle: 'Some Artist',
    onPlay: () => {},
    menuItems: (
      <>
        <Popover.Item icon={<PlusIcon size={16} />}>Add to queue</Popover.Item>
        <Popover.Item intent="danger" icon={<Trash2Icon size={16} />}>
          Delete
        </Popover.Item>
      </>
    ),
    labels: { play: 'Play', menu: 'More actions' },
  },
};

export const Loading: Story = {
  args: {
    ...WithActions.args,
    isLoading: true,
  },
};

const LoadingOnPlayCard: FC<ComponentProps<typeof Card>> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2500);
  };

  return <Card {...props} onPlay={startLoading} isLoading={isLoading} />;
};

export const LoadingOnPlay: Story = {
  args: WithActions.args,
  render: (args) => <LoadingOnPlayCard {...args} />,
};

export const WithLongText: Story = {
  args: {
    src: cover,
    title:
      'An Incredibly, Ridiculously Long Album Title That Should Truncate Nicely',
    subtitle:
      'A Very Long Artist Name Featuring Another Artist With Even More Characters',
  },
};

export const WithoutText: Story = {
  args: {
    src: cover,
  },
};

export const WithoutSubtitle: Story = {
  args: {
    src: cover,
    title: "Joe's Garage",
  },
};

export const WithoutImage: Story = {
  args: {
    src: '',
    title: 'No Image',
    subtitle: 'Some Artist',
  },
};

export const WithoutReveal: Story = {
  args: {
    src: cover,
    title: 'Random Album',
    subtitle: 'Some Artist',
    imageReveal: false,
  },
};
