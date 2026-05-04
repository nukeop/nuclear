import type { Meta, StoryObj } from '@storybook/react-vite';
import { Music, Palette } from 'lucide-react';
import { fn } from 'storybook/test';

import { PluginItem, Toggle } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/PluginItem',
  component: PluginItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onViewDetails: { action: 'view details clicked' },
  },
} satisfies Meta<typeof PluginItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'YouTube Music',
    author: 'Nuclear Team',
    description:
      'Stream music directly from YouTube Music with full search and playlist support.',
    version: '1.2.0',
    icon: <Music size={24} />,
    loadTimeMs: 150,
    rightAccessory: (
      <Toggle
        defaultChecked={false}
        aria-label="Enable plugin"
        onChange={fn()}
      />
    ),
  },
};

export const WithoutIcon: Story = {
  args: {
    name: 'Last.fm Scrobbler',
    author: 'Community',
    description:
      'Automatically scrobble your listening history to Last.fm and discover new music based on your taste.',
  },
};

export const LongDescription: Story = {
  args: {
    name: 'Advanced Equalizer',
    author: 'AudioTech Solutions',
    description:
      'Professional-grade 10-band equalizer with presets for different music genres, custom curve editing, and real-time spectrum analysis. Includes bass boost, treble enhancement, and spatial audio effects.',
    icon: <Palette size={24} />,
  },
};

// New variants showcasing the enhanced API

export const Disabled: Story = {
  args: {
    name: 'Disabled Plugin',
    author: 'Nuclear Team',
    description: 'This plugin is currently disabled.',
    icon: <Music size={24} />,
    disabled: true,
  },
};

export const Warning: Story = {
  args: {
    name: 'Warned Plugin',
    author: 'Nuclear Team',
    description: 'This plugin has warnings.',
    icon: <Music size={24} />,
    warning: true,
    warningText: 'Unknown permissions',
  },
};

export const WithRightAccessory: Story = {
  args: {
    name: 'Toggleable Plugin',
    author: 'Nuclear Team',
    description: 'This plugin shows a right accessory toggle.',
    icon: <Music size={24} />,
    rightAccessory: (
      <Toggle
        defaultChecked={false}
        aria-label="Enable plugin"
        onChange={fn()}
      />
    ),
  },
};

export const UpdateAvailable: Story = {
  args: {
    name: 'Discogs Metadata',
    author: 'nukeop',
    description:
      'Fetch album and artist metadata from Discogs, including cover art and release information.',
    version: '1.3.0',
    updateAvailable: true,
    loadTimeMs: 200,
    icon: <Music size={24} />,
    rightAccessory: (
      <Toggle
        defaultChecked={false}
        aria-label="Enable plugin"
        onChange={fn()}
      />
    ),
  },
};

export const WithActions: Story = {
  args: {
    name: 'Dev Plugin',
    author: 'Nuclear Team',
    description:
      'Reload and remove controls are available for development plugins.',
    version: '0.5.0',
    icon: <Music size={24} />,
    onReload: fn(),
    onRemove: fn(),
  },
};

export const WarningWithRightAccessory: Story = {
  args: {
    name: 'Warned + Toggle',
    author: 'Nuclear Team',
    description: 'Warned plugin with a right accessory toggle.',
    icon: <Music size={24} />,
    warning: true,
    warningText: 'Requires network permission',
    rightAccessory: (
      <Toggle
        defaultChecked={true}
        aria-label="Enable plugin"
        onChange={(checked) => console.log('Toggle changed:', checked)}
      />
    ),
  },
};

export const DisabledWarningWithRightAccessory: Story = {
  args: {
    name: 'Disabled + Warned + Toggle',
    author: 'Nuclear Team',
    description: 'Disabled plugin with warnings and a toggle in the top-right.',
    icon: <Music size={24} />,
    disabled: true,
    warning: true,
    warningText: 'Unknown permissions',
    rightAccessory: (
      <Toggle
        defaultChecked={false}
        aria-label="Enable plugin"
        onChange={(checked) => console.log('Toggle changed:', checked)}
      />
    ),
  },
};

export const Loading: Story = {
  args: {
    name: 'Updating Plugin',
    author: 'Nuclear Team',
    description: 'An operation is running in the background.',
    icon: <Music size={24} />,
    isLoading: true,
  },
};
