import { render } from '@testing-library/react';

import { Skeleton } from '.';

describe('Skeleton', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    expect(container).toMatchSnapshot();
  });
});
