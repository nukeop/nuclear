import type { Meta, StoryObj } from '@storybook/react-vite';

const Welcome = () => (
  <div className="max-w-2xl p-8">
    <h1 className="text-foreground mb-6 text-4xl font-bold">
      Welcome to Nuclear Storybook! 🎵
    </h1>
    <p className="text-foreground/60 mb-6 text-lg">
      This is the component development environment for the Nuclear music
      player. Here you can develop and test UI components in isolation.
    </p>
  </div>
);

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Welcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
