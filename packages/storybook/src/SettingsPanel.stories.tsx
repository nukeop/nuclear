import { Meta, StoryObj } from '@storybook/react-vite';
import { BlocksIcon, PaletteIcon, ScrollTextIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  SettingsNavigationSection,
  SettingsPanel,
} from '@nuclearplayer/ui';

const GENERAL_ITEMS = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
];

const APP_ITEMS = [
  { id: 'plugins', label: 'Plugins', icon: <BlocksIcon size={16} /> },
  { id: 'themes', label: 'Themes', icon: <PaletteIcon size={16} /> },
  { id: 'logs', label: 'Logs', icon: <ScrollTextIcon size={16} /> },
];

const SAMPLE_CONTENT: Record<string, { title: string; body: string }> = {
  general: {
    title: 'General',
    body: 'General settings content goes here.',
  },
  appearance: {
    title: 'Appearance',
    body: 'Appearance settings content goes here.',
  },
  plugins: { title: 'Plugins', body: 'Plugin management content.' },
  themes: { title: 'Themes', body: 'Theme selection content.' },
  logs: { title: 'Logs', body: 'Log viewer content.' },
};

const meta: Meta<typeof SettingsPanel> = {
  title: 'Components/SettingsPanel',
  component: SettingsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<Meta<typeof SettingsPanel>>;

const SettingsPanelDemo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeGeneralItem, setActiveGeneralItem] = useState<string | null>(
    'general',
  );
  const [activeAppItem, setActiveAppItem] = useState<string | null>(null);
  const content =
    SAMPLE_CONTENT[activeAppItem ?? activeGeneralItem ?? 'general'];

  const selectGeneralItem = (id: string) => {
    setActiveGeneralItem(id);
    setActiveAppItem(null);
  };

  const selectAppItem = (id: string) => {
    setActiveAppItem(id);
    setActiveGeneralItem(null);
  };

  const sections: SettingsNavigationSection[] = [
    {
      id: 'general',
      label: 'Settings',
      items: GENERAL_ITEMS,
      activeItemId: activeGeneralItem,
      onSelect: selectGeneralItem,
    },
    {
      id: 'app',
      label: 'App',
      items: APP_ITEMS,
      activeItemId: activeAppItem,
      onSelect: selectAppItem,
    },
  ];

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => setIsOpen(true)}>Open Settings</Button>
      <SettingsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sections={sections}
      >
        <div className="p-6">
          <h1 className="font-heading mb-4 text-3xl font-bold">
            {content.title}
          </h1>
          <p>{content.body}</p>
        </div>
      </SettingsPanel>
    </div>
  );
};

export const Default: Story = {
  render: () => <SettingsPanelDemo />,
};
