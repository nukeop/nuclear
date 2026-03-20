import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { SearchWrapper } from './Search.test-wrapper';

describe('Search view', () => {
  beforeEach(() => {
    providersHost.clear();
  });

  it('(Snapshot) renders the search view', async () => {
    const { asFragment } = await SearchWrapper.mount();
    expect(asFragment()).toMatchSnapshot();
  });

  it('executes search when navigating via url search query', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/search?q=hello'],
    });
    const router = createRouter({ routeTree, history });

    render(<App routerProp={router} />);

    expect(await screen.findByTestId('search-view')).toBeVisible();
    expect(await screen.findByText('Query: "hello"')).toBeVisible();
  });

  it('shows empty state when no metadata provider is available', async () => {
    await SearchWrapper.mount();
    expect(SearchWrapper.emptyState).toBeInTheDocument();
  });

  it('opens the plugin store when clicking the search empty state action', async () => {
    await SearchWrapper.mount();
    await SearchWrapper.emptyStateAction.click();
    expect(await SearchWrapper.settingsDialog()).toBeInTheDocument();
    expect(await SearchWrapper.pluginsHeading()).toBeInTheDocument();
  });
});
