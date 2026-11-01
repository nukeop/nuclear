import { waitFor } from '@testing-library/react';

import { createPluginAPI } from '../services/plugins/createPluginAPI';
import {
  CRASHING_VIEW,
  createPodcastsView,
  PORTAL_VIEW,
  REDESIGNED_PODCASTS_VIEW,
  STYLED_VIEW,
  UNKNOWN_ICON_VIEW,
} from '../test/fixtures/customViews';
import { DashboardWrapper } from '../views/Dashboard/Dashboard.test-wrapper';
import { SourcesWrapper } from '../views/Sources/Sources.test-wrapper';
import { CustomViewsWrapper } from './CustomViews.test-wrapper';

const PLUGIN_ID = 'nuclear-podcasts';
const views = createPluginAPI(PLUGIN_ID, 'Nuclear Podcasts').Views;

describe('Custom views from plugins', () => {
  beforeEach(() => {
    CustomViewsWrapper.reset();
  });

  it('shows a sidebar entry with the title of a registered view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));

    await CustomViewsWrapper.mount('/dashboard');

    expect(CustomViewsWrapper.sidebar.entry('Podcasts').element).toBeVisible();
  });

  it('opens the root page of a view when the user clicks its sidebar entry', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await CustomViewsWrapper.mount('/dashboard');

    await CustomViewsWrapper.sidebar.entry('Podcasts').click();

    expect(await CustomViewsWrapper.podcastList.find()).toBeVisible();
  });

  it('opens a sub-page with its params when the user clicks a link in the view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await CustomViewsWrapper.podcastList.find();

    await CustomViewsWrapper.podcastList.latestEpisodeButton.click();

    await CustomViewsWrapper.episodePage.find();
    expect(CustomViewsWrapper.episodePage.text).toBe('Show 7, episode 42');
  });

  it('returns to the previous page of the view when the user clicks back in the top bar', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await CustomViewsWrapper.podcastList.find();
    await CustomViewsWrapper.podcastList.latestEpisodeButton.click();
    await CustomViewsWrapper.episodePage.find();

    await CustomViewsWrapper.topBar.backButton.click();

    expect(await CustomViewsWrapper.podcastList.find()).toBeVisible();
  });

  it('opens a sub-page directly from its URL', async () => {
    views.register(createPodcastsView(PLUGIN_ID));

    await CustomViewsWrapper.mount(
      `/plugin/${PLUGIN_ID}/podcasts/show/7/episode/42`,
    );

    await CustomViewsWrapper.episodePage.find();
    expect(CustomViewsWrapper.episodePage.text).toBe('Show 7, episode 42');
  });

  it('opens a player page from a link in the view, and back returns to the view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await CustomViewsWrapper.podcastList.find();
    await CustomViewsWrapper.podcastList.manageSourcesButton.click();
    await SourcesWrapper.view.find();

    await CustomViewsWrapper.topBar.backButton.click();

    expect(await CustomViewsWrapper.podcastList.find()).toBeVisible();
  });

  it('shows the new version of the open view when the plugin registers it again', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await CustomViewsWrapper.podcastList.find();

    views.register(REDESIGNED_PODCASTS_VIEW);

    expect(await CustomViewsWrapper.redesignedPodcastList.find()).toBeVisible();
  });

  it('shows the dashboard when the plugin unregisters the open view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await CustomViewsWrapper.podcastList.find();

    views.unregister('podcasts');

    expect(await DashboardWrapper.view.find()).toBeVisible();
  });

  it('styles a custom view with Tailwind only once it opens', async () => {
    views.register(STYLED_VIEW);
    await CustomViewsWrapper.mount('/dashboard');
    expect(CustomViewsWrapper.tailwindStyles.element).toBeNull();

    await CustomViewsWrapper.sidebar.entry('Styled').click();
    await CustomViewsWrapper.styledPage.find();

    await waitFor(() => {
      expect(CustomViewsWrapper.tailwindStyles.text).toContain(
        '.bg-accent-orange\\/40',
      );
      expect(CustomViewsWrapper.tailwindStyles.text).toContain('.animate-in');
    });
  });

  it('styles content that a custom view renders in a portal', async () => {
    views.register(PORTAL_VIEW);
    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/portal`);
    await CustomViewsWrapper.portalContent.find();

    await waitFor(() =>
      expect(CustomViewsWrapper.tailwindStyles.text).toContain(
        '.bg-accent-green\\/45',
      ),
    );
  });

  it('removes a crashing view and shows a toast naming the plugin', async () => {
    views.register(CRASHING_VIEW);

    await CustomViewsWrapper.mount(`/plugin/${PLUGIN_ID}/broken`);

    await CustomViewsWrapper.crashToast.find();
    expect(CustomViewsWrapper.crashToast.text).toBe(
      'The view "Broken" from Nuclear Podcasts crashed and was removed.',
    );
    expect(CustomViewsWrapper.sidebar.entryTitles).toEqual([]);
  });

  it('removes a view with an unknown icon and keeps the sidebar working', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    views.register(UNKNOWN_ICON_VIEW);
    await CustomViewsWrapper.mount('/dashboard');
    await CustomViewsWrapper.crashToast.find();

    await CustomViewsWrapper.sidebar.entry('Podcasts').click();

    expect(await CustomViewsWrapper.podcastList.find()).toBeVisible();
    expect(CustomViewsWrapper.sidebar.entryTitles).toEqual(['Podcasts']);
  });
});
