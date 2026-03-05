import { Meta, StoryObj } from '@storybook/react-vite';
import {
  BlocksIcon,
  PaletteIcon,
  ScrollTextIcon,
  Settings2Icon,
} from 'lucide-react';
import { useState } from 'react';

import { Button, SettingsPanel, SettingsTab } from '@nuclearplayer/ui';

const SAMPLE_TABS: SettingsTab[] = [
  {
    id: 'general',
    label: 'General',
    icon: <Settings2Icon size={16} />,
    content: () => (
      <div className="p-6">
        <h1 className="font-heading mb-4 text-3xl font-bold">General</h1>
        <p>General settings content goes here.</p>
      </div>
    ),
  },
  {
    id: 'plugins',
    label: 'Plugins',
    icon: <BlocksIcon size={16} />,
    content: () => (
      <div className="p-6">
        <h1 className="font-heading mb-4 text-3xl font-bold">Plugins</h1>
        <p>Plugin management content.</p>
      </div>
    ),
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: <PaletteIcon size={16} />,
    content: () => (
      <div className="p-6">
        <h1 className="font-heading mb-4 text-3xl font-bold">Themes</h1>
        <p>Theme selection content.</p>
      </div>
    ),
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: <ScrollTextIcon size={16} />,
    content: () => (
      <div className="p-6">
        <h1 className="font-heading mb-4 text-3xl font-bold">Logs</h1>
        <p>Log viewer content.</p>
      </div>
    ),
  },
];

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
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => setIsOpen(true)}>Open Settings</Button>
      <SettingsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tabs={SAMPLE_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SettingsPanelDemo />,
};
