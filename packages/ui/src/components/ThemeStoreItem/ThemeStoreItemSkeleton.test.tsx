import { render } from '@testing-library/react';

import { ThemeStoreItem } from '.';

describe('ThemeStoreItem.Skeleton', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<ThemeStoreItem.Skeleton />);
    expect(container).toMatchSnapshot();
  });
});
