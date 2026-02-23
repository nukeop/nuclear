import { render } from '@testing-library/react';
import {
  BlocksIcon,
  PaletteIcon,
  ScrollTextIcon,
  Settings2Icon,
} from 'lucide-react';

import { SettingsPanel, SettingsTab } from './SettingsPanel';

const TABS: SettingsTab[] = [
  {
    id: 'general',
    label: 'General',
    icon: <Settings2Icon />,
    content: () => <div>General content</div>,
  },
  {
    id: 'plugins',
    label: 'Plugins',
    icon: <BlocksIcon />,
    content: () => <div>Plugins content</div>,
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: <PaletteIcon />,
    content: () => <div>Themes content</div>,
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: <ScrollTextIcon />,
    content: () => <div>Logs content</div>,
  },
];

describe('SettingsPanel', () => {
  it('(Snapshot) renders when open', () => {
    const { asFragment } = render(
      <SettingsPanel
        isOpen
        onClose={() => {}}
        tabs={TABS}
        activeTab="general"
        onTabChange={() => {}}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
