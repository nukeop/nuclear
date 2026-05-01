import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PluginStoreItem } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/PluginStoreItem',
  component: PluginStoreItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PluginStoreItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'YouTube Music',
    description:
      'Stream music directly from YouTube Music with full search and playlist support.',
    author: 'Nuclear Team',
    categories: ['Streaming', 'Metadata'],
    onInstall: fn(),
  },
};

export const Installed: Story = {
  args: {
    name: 'Discogs Metadata',
    description:
      'Fetch album and artist metadata from Discogs, including cover art and release information.',
    author: 'nukeop',
    categories: ['Metadata', 'Streaming'],
    isInstalled: true,
    onInstall: fn(),
  },
};

export const Installing: Story = {
  args: {
    name: 'Genius Lyrics',
    description:
      'Display song lyrics from Genius with support for synced lyrics when available.',
    author: 'Community',
    categories: ['Lyrics', 'Metadata'],
    isInstalling: true,
    onInstall: fn(),
  },
};

export const LongDescription: Story = {
  args: {
    name: 'Advanced Audio Processor',
    description:
      'Professional-grade audio processing plugin that includes a 10-band equalizer, bass boost, treble enhancement, spatial audio effects, and real-time spectrum analysis. Perfect for audiophiles who want complete control over their listening experience.',
    author: 'AudioTech Solutions',
    categories: ['Other'],
    onInstall: fn(),
  },
};
