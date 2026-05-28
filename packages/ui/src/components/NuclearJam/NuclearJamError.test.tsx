import { render } from '@testing-library/react';

import { NuclearJamError } from './NuclearJamError';

const labels = {
  title: 'Could not connect',
  subtitle: 'Make sure Nuclear is running',
};

describe('NuclearJamError', () => {
  it('(Snapshot) renders with labels', () => {
    const { container } = render(<NuclearJamError labels={labels} />);
    expect(container).toMatchSnapshot();
  });
});
