import { render } from '@testing-library/react';

import { LyricsSkeleton } from '.';

describe('LyricsSkeleton', () => {
  it('(Snapshot) renders placeholder sections and lines', () => {
    const { container } = render(<LyricsSkeleton />);
    expect(container).toMatchSnapshot();
  });
});
