import { waitFor } from '@testing-library/react';
import { mountedNavbarFactory, setupI18Next } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';

const URLs = {
  Mastodon: 'https://fosstodon.org/@nuclearplayer',
  Github: 'https://github.com/nukeop/nuclear',
  Twitter: 'https://twitter.com/nuclear_player',
  Author: 'https://github.com/nukeop',
  Discord: 'https://discord.gg/JqPjKxE',
  ReportIssue: 'https://github.com/nukeop/nuclear/issues/new?assignees=&labels=bug&template=bug_report.md&title='
};

describe('Album view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { store } = require('@nuclear/core');
    store.clear();
  });

  it('should show help modal', async () => {
    const { component } = mountComponent();

    await waitFor(() => component.getByTestId('help-button').click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should open external link', async () => {
    const { component } = mountComponent(
      buildStoreState()
        .build()
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const shell = require('electron').shell;

    await waitFor(() => component.getByTestId('help-button').click());

    await waitFor(() => component.getByTestId('github-link').click());
    expect(shell.openExternal).toHaveBeenCalledWith(URLs.Github);

    await waitFor(() => component.getByTestId('author-link').click());
    expect(shell.openExternal).toHaveBeenCalledWith(URLs.Author);

    await waitFor(() => component.getByTestId('issue-link').click());
    expect(shell.openExternal).toHaveBeenCalledWith(URLs.ReportIssue);

    await waitFor(() => component.getByTestId('twitter-link').click());
    expect(shell.openExternal).toHaveBeenCalledWith(URLs.Twitter);

    await waitFor(() => component.getByTestId('mastodon-link').click());
    expect(shell.openExternal).toHaveBeenCalledWith(URLs.Mastodon);

    await waitFor(() => component.getByTestId('discord-link').click());
    expect(shell.openExternal).toHaveBeenCalledWith(URLs.Discord);
  });

  const mountComponent = mountedNavbarFactory(
    ['/dashboard'],
    buildStoreState()
      .build()
  );
});
