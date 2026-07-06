import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { SearchWrapper } from './Search.test-wrapper';

const user = userEvent.setup();

describe('Search view', () => {
  beforeEach(() => {
    providersHost.clear();
  });

  it('(Snapshot) renders the search view', async () => {
    const { asFragment } = await SearchWrapper.mount('test');
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
    await SearchWrapper.mount('test');
    expect(SearchWrapper.emptyState).toBeInTheDocument();
  });

  it('opens the plugin store when clicking the search empty state action', async () => {
    await SearchWrapper.mount('test');
    await SearchWrapper.emptyStateAction.click();
    expect(await SearchWrapper.settingsDialog()).toBeInTheDocument();
    expect(await SearchWrapper.pluginsHeading()).toBeInTheDocument();
  });
});

describe('Search box', () => {
  it('shows the clear button only when there is text', async () => {
    await SearchWrapper.mount();

    expect(SearchWrapper.searchBox.clearButton.element).not.toBeInTheDocument();

    await SearchWrapper.searchBox.type('nirvana');

    expect(SearchWrapper.searchBox.clearButton.element).toBeInTheDocument();
  });

  it('clears the text and refocuses the input when clicking the clear button', async () => {
    await SearchWrapper.mount();
    await SearchWrapper.searchBox.type('nirvana');

    await SearchWrapper.searchBox.clearButton.click();

    expect(SearchWrapper.searchBox.input).toHaveValue('');
    expect(SearchWrapper.searchBox.clearButton.element).not.toBeInTheDocument();
    expect(SearchWrapper.searchBox.input).toHaveFocus();
  });

  it('clears the text on Escape, then blurs on a second Escape', async () => {
    await SearchWrapper.mount();
    await SearchWrapper.searchBox.type('nirvana');

    await SearchWrapper.searchBox.clear();

    expect(SearchWrapper.searchBox.input).toHaveValue('');
    expect(SearchWrapper.searchBox.input).toHaveFocus();

    await SearchWrapper.searchBox.clear();

    expect(SearchWrapper.searchBox.input).not.toHaveFocus();
  });

  it('reflects the query from the URL', async () => {
    await SearchWrapper.mount();

    await SearchWrapper.navigateToSearch('aphex twin');

    await waitFor(() => {
      expect(SearchWrapper.searchBox.input).toHaveValue('aphex twin');
    });
  });

  it('restores the previous query when navigating back', async () => {
    await SearchWrapper.mount('boards of canada');

    await SearchWrapper.searchBox.replaceText('autechre');
    SearchWrapper.searchBox.input.focus();
    await user.keyboard('{Enter}');
    await screen.findByTestId('search-view');

    SearchWrapper.goBack();

    await waitFor(() => {
      expect(SearchWrapper.searchBox.input).toHaveValue('boards of canada');
    });
  });
});
