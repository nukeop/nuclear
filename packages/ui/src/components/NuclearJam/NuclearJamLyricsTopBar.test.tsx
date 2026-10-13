import { render } from '@testing-library/react';

import { NuclearJamLyricsTopBar } from './NuclearJamLyricsTopBar';

const labels = { back: 'Back' };

describe('NuclearJamLyricsTopBar', () => {
  it('(Snapshot) renders the back button, title, and artist', () => {
    const { container } = render(
      <NuclearJamLyricsTopBar
        title="Placeholder Song"
        artist="Test Artist"
        onBack={vi.fn()}
        labels={labels}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
