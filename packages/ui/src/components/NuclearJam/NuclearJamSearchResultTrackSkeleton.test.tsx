import { render } from '@testing-library/react';

import { NuclearJam } from '.';

describe('NuclearJam.SearchResultTrack.Skeleton', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<NuclearJam.SearchResultTrack.Skeleton />);
    expect(container).toMatchSnapshot();
  });
});
