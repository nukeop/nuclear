import { render } from '@testing-library/react';

import {
  NuclearJamLyricsToolbar,
  NuclearJamLyricsToolbarProps,
} from './NuclearJamLyricsToolbar';

const baseProps: NuclearJamLyricsToolbarProps = {
  sources: [
    { id: 'synced', name: 'Synced Lyrics', type: 'lineSynced' },
    { id: 'plain', name: 'Plain Lyrics', type: 'plain' },
  ],
  selectedSourceId: 'synced',
  onSelectSource: vi.fn(),
  offsetValue: '+0.3 s',
  onShowEarlier: vi.fn(),
  onShowLater: vi.fn(),
  labels: {
    types: {
      wordSynced: 'Word synced',
      lineSynced: 'Line synced',
      plain: 'Plain',
    },
    showEarlier: 'Show lyrics earlier',
    showLater: 'Show lyrics later',
  },
};

describe('NuclearJamLyricsToolbar', () => {
  it('(Snapshot) renders with a synced source selected', () => {
    const { container } = render(<NuclearJamLyricsToolbar {...baseProps} />);
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders with a plain source selected', () => {
    const { container } = render(
      <NuclearJamLyricsToolbar {...baseProps} selectedSourceId="plain" />,
    );
    expect(container).toMatchSnapshot();
  });
});
