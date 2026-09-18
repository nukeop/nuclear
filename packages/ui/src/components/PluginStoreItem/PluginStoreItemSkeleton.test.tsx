import { render } from '@testing-library/react';

import { PluginStoreItem } from '.';

describe('PluginStoreItem.Skeleton', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<PluginStoreItem.Skeleton />);
    expect(container).toMatchSnapshot();
  });
});
