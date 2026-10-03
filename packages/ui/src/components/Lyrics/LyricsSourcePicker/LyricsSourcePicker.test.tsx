import { render } from '@testing-library/react';

import { LyricsSourcePicker } from '.';

describe('LyricsSourcePicker', () => {
  it('(Snapshot) renders the selected source with its lyrics type', () => {
    const { container } = render(
      <LyricsSourcePicker
        sources={[
          { id: 'alpha', name: 'Alpha Lyrics', type: 'wordSynced' },
          { id: 'beta', name: 'Beta Lyrics', type: 'plain' },
        ]}
        value="alpha"
        onValueChange={() => {}}
        typeLabels={{
          wordSynced: 'Word synced',
          lineSynced: 'Line synced',
          plain: 'Plain',
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
