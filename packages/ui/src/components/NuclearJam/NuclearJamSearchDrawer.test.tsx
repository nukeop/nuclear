import { render } from '@testing-library/react';

import { NuclearJamSearchDrawer } from './NuclearJamSearchDrawer';
import { NuclearJamSearchDrawerEmpty } from './NuclearJamSearchDrawerEmpty';
import { NuclearJamSearchDrawerError } from './NuclearJamSearchDrawerError';
import { NuclearJamSearchDrawerResults } from './NuclearJamSearchDrawerResults';

describe('NuclearJamSearchDrawer', () => {
  it('(Snapshot) renders nothing when closed', () => {
    const { container } = render(
      <NuclearJamSearchDrawer open={false}>
        <div>Hidden content</div>
      </NuclearJamSearchDrawer>,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the sheet and backdrop with results', () => {
    const { container } = render(
      <NuclearJamSearchDrawer open>
        <NuclearJamSearchDrawerResults>
          <div>First result</div>
          <div>Second result</div>
        </NuclearJamSearchDrawerResults>
      </NuclearJamSearchDrawer>,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the empty state', () => {
    const { container } = render(
      <NuclearJamSearchDrawer open>
        <NuclearJamSearchDrawerEmpty
          labels={{
            title: 'No results',
            description: 'Try a different search',
          }}
        />
      </NuclearJamSearchDrawer>,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders the error state', () => {
    const { container } = render(
      <NuclearJamSearchDrawer open>
        <NuclearJamSearchDrawerError
          labels={{
            title: 'Search failed',
            description: 'Check the player and try again',
          }}
        />
      </NuclearJamSearchDrawer>,
    );
    expect(container).toMatchSnapshot();
  });
});
