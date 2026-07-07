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

  it('shows the last 5 searches in the popover, most recent first', async () => {
    await SearchWrapper.mount();

    const queries = ['one', 'two', 'three', 'four', 'five', 'six'];
    for (const query of queries) {
      await SearchWrapper.search(query);
    }

    await SearchWrapper.searchBox.focus();

    expect(SearchWrapper.searchBox.recentSearches).toEqual([
      'six',
      'five',
      'four',
      'three',
      'two',
    ]);
  });

  it('does not show the popover when there are no recent searches', async () => {
    await SearchWrapper.mount();

    await SearchWrapper.searchBox.focus();

    expect(SearchWrapper.searchBox.popover).not.toBeInTheDocument();
  });

  it('deduplicates recent searches, moving repeats to the top', async () => {
    await SearchWrapper.mount();

    await SearchWrapper.search('nirvana');
    await SearchWrapper.search('pixies');
    await SearchWrapper.search('nirvana');

    await SearchWrapper.searchBox.focus();

    expect(SearchWrapper.searchBox.recentSearches).toEqual([
      'nirvana',
      'pixies',
    ]);
  });

  it('clears the recent searches when clicking the clear history button', async () => {
    await SearchWrapper.mount();

    await SearchWrapper.search('nirvana');
    await SearchWrapper.searchBox.focus();

    await SearchWrapper.searchBox.clearHistoryButton.click();

    expect(SearchWrapper.searchBox.recentSearches).toEqual([]);
    expect(
      SearchWrapper.searchBox.clearHistoryButton.element,
    ).not.toBeInTheDocument();
  });

  it('navigates to a recent search when clicking it', async () => {
    await SearchWrapper.mount();

    await SearchWrapper.search('nirvana');
    await SearchWrapper.search('pixies');

    await SearchWrapper.searchBox.focus();
    await SearchWrapper.searchBox.clickRecentSearch('nirvana');

    expect(await SearchWrapper.findSearchQuery('nirvana')).toBeVisible();
    await waitFor(() => {
      expect(SearchWrapper.searchBox.input).toHaveValue('nirvana');
    });
  });

  it('navigates to a recent search with arrow keys and Enter', async () => {
    await SearchWrapper.mount();

    await SearchWrapper.search('one');
    await SearchWrapper.search('two');
    await SearchWrapper.search('three');

    await SearchWrapper.searchBox.focus();
    await SearchWrapper.searchBox.highlightNext();
    await SearchWrapper.searchBox.highlightNext();

    expect(SearchWrapper.searchBox.highlightedRecentSearch).toBe('two');

    await SearchWrapper.searchBox.selectHighlighted();

    expect(await SearchWrapper.findSearchQuery('two')).toBeVisible();
    await waitFor(() => {
      expect(SearchWrapper.searchBox.input).toHaveValue('two');
    });
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
