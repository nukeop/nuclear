import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { LyricsTypeBadge, Select } from '@nuclearplayer/ui';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

const OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

const ICON_OPTIONS = [
  {
    id: 'alpha',
    label: 'Alpha Lyrics',
    icon: (
      <LyricsTypeBadge type="wordSynced" variant="icon" label="Word synced" />
    ),
  },
  {
    id: 'beta',
    label: 'Beta Lyrics',
    icon: (
      <LyricsTypeBadge type="lineSynced" variant="icon" label="Line synced" />
    ),
  },
  {
    id: 'gamma',
    label: 'Gamma Lyrics',
    icon: <LyricsTypeBadge type="plain" variant="icon" label="Plain" />,
  },
];

export const Basic: Story = {
  args: {
    label: 'Quality',
    options: OPTIONS,
    defaultValue: 'medium',
    description: 'Choose your preferred playback quality.',
  },
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('low');
    return (
      <div style={{ width: 360 }}>
        <Select
          label="Quality"
          options={OPTIONS}
          value={val}
          onValueChange={setVal}
        />
        <div style={{ marginTop: 12 }}>Current: {val}</div>
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: 'Quality',
    options: OPTIONS,
    error: 'Please make a selection',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Select label="Primary" options={OPTIONS} defaultValue="medium" />
      <Select
        label="Muted"
        options={OPTIONS}
        defaultValue="medium"
        variant="muted"
      />
      <Select
        label="Muted, small"
        options={OPTIONS}
        defaultValue="medium"
        variant="muted"
        size="sm"
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Select label="Primary" options={ICON_OPTIONS} defaultValue="alpha" />
      <Select
        label="Muted, small"
        options={ICON_OPTIONS}
        defaultValue="alpha"
        variant="muted"
        size="sm"
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Quality',
    options: OPTIONS,
    defaultValue: 'medium',
    description: 'Disabled control',
    disabled: true,
  },
};
