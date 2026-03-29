import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ThemeStoreItem } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/ThemeStoreItem',
  component: ThemeStoreItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ThemeStoreItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Gruvbox',
    description: 'Retro groove color scheme. Based on the classic Vim theme.',
    author: 'nukeop',
    palette: [
      'oklch(0.96 0.055 96)',
      'oklch(0.28 0.000 263)',
      'oklch(0.62 0.171 46)',
      'oklch(0.34 0.007 48)',
    ],
    tags: ['retro', 'warm'],
    onInstall: fn(),
  },
};

export const Installed: Story = {
  args: {
    name: 'Rosé Pine',
    description:
      'All natural pine, faux fur and a bit of soho vibes for the classy minimalist.',
    author: 'nukeop',
    palette: [
      'oklch(0.97 0.011 72)',
      'oklch(0.21 0.025 291)',
      'oklch(0.60 0.107 3)',
      'oklch(0.46 0.063 290)',
    ],
    tags: ['warm', 'muted', 'elegant'],
    isInstalled: true,
    onInstall: fn(),
  },
};

export const Installing: Story = {
  args: {
    name: 'YoRHa',
    description: 'Inspired by the UI of NieR:Automata.',
    author: 'nukeop',
    palette: [
      'oklch(0.9112 0.0325 95.42)',
      'oklch(0.3102 0.0113 84.59)',
      'oklch(0.6303 0.0168 90.30)',
      'oklch(0.4058 0.0186 90.39)',
    ],
    tags: ['minimal', 'monochrome'],
    isInstalling: true,
    onInstall: fn(),
  },
};
