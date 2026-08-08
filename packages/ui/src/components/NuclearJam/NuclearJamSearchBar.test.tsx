import { render } from '@testing-library/react';

import { NuclearJamSearchBar } from './NuclearJamSearchBar';

const labels = {
  placeholder: 'Search for music',
};

describe('NuclearJamSearchBar', () => {
  it('(Snapshot) renders empty', () => {
    const { container } = render(
      <NuclearJamSearchBar value="" onChange={() => {}} labels={labels} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders with a value', () => {
    const { container } = render(
      <NuclearJamSearchBar
        value="Radiohead"
        onChange={() => {}}
        labels={labels}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
