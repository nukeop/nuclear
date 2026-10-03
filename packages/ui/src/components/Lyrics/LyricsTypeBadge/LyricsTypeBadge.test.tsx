import { render } from '@testing-library/react';

import { LyricsTypeBadge } from '.';

describe('LyricsTypeBadge', () => {
  it('(Snapshot) renders the expanded variant for each lyrics type', () => {
    const { container } = render(
      <>
        <LyricsTypeBadge
          type="wordSynced"
          variant="expanded"
          label="Word synced"
        />
        <LyricsTypeBadge
          type="lineSynced"
          variant="expanded"
          label="Line synced"
        />
        <LyricsTypeBadge type="plain" variant="expanded" label="Plain" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the icon variant for each lyrics type', () => {
    const { container } = render(
      <>
        <LyricsTypeBadge type="wordSynced" variant="icon" label="Word synced" />
        <LyricsTypeBadge type="lineSynced" variant="icon" label="Line synced" />
        <LyricsTypeBadge type="plain" variant="icon" label="Plain" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
