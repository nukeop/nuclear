import { render } from '@testing-library/react';

import { LyricsSectionLabel } from '.';

describe('LyricsSectionLabel', () => {
  it('(Snapshot) renders the label', () => {
    const { container } = render(
      <LyricsSectionLabel>Verse 1</LyricsSectionLabel>,
    );
    expect(container).toMatchSnapshot();
  });
});
