import { render } from '@testing-library/react';

import { NuclearJamConnecting } from './NuclearJamConnecting';

const labels = {
  title: 'Connecting to Nuclear...',
  subtitle: 'Make sure Nuclear is running',
};

describe('NuclearJamConnecting', () => {
  it('(Snapshot) renders with labels', () => {
    const { container } = render(<NuclearJamConnecting labels={labels} />);
    expect(container).toMatchSnapshot();
  });
});
