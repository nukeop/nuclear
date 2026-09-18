import { render } from '@testing-library/react';

import { Card } from '.';

describe('Card.Skeleton', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<Card.Skeleton />);
    expect(container).toMatchSnapshot();
  });
});
