import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from '@nuclearplayer/ui';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Add a description...',
  },
};

export const Secondary: Story = {
  args: {
    tone: 'secondary',
    placeholder: 'Notes...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      'A curated collection of tracks for late night coding sessions.',
  },
};
