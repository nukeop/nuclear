import { render } from '@testing-library/react';

import { StatChip } from '.';

describe('StatChip.Skeleton', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<StatChip.Skeleton />);
    expect(container).toMatchSnapshot();
  });
});
