import { render } from '@testing-library/react';
import { BlocksIcon, PaletteIcon } from 'lucide-react';

import { SettingsNavigationSection, SettingsPanel } from './SettingsPanel';

const sections: SettingsNavigationSection[] = [
  {
    id: 'general',
    label: 'Settings',
    items: [
      { id: 'general', label: 'General' },
      { id: 'plugins', label: 'Plugins' },
    ],
    activeItemId: 'general',
    onSelect: () => {},
  },
  {
    id: 'app',
    label: 'App',
    items: [
      { id: 'plugins', label: 'Plugins', icon: <BlocksIcon /> },
      { id: 'themes', label: 'Themes', icon: <PaletteIcon /> },
    ],
    activeItemId: null,
    onSelect: () => {},
  },
];

describe('SettingsPanel', () => {
  it('(Snapshot) renders when open', () => {
    const { asFragment } = render(
      <SettingsPanel isOpen onClose={() => {}} sections={sections}>
        <div>General content</div>
      </SettingsPanel>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
