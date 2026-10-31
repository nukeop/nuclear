import { createPluginAPI } from '../services/plugins/createPluginAPI';
import {
  createPodcastsView,
  REDESIGNED_PODCASTS_VIEW,
} from '../test/fixtures/pluginViews';
import { DashboardWrapper } from '../views/Dashboard/Dashboard.test-wrapper';
import { SourcesWrapper } from '../views/Sources/Sources.test-wrapper';
import { PluginViewsWrapper } from './PluginViews.test-wrapper';

const PLUGIN_ID = 'nuclear-podcasts';
const views = createPluginAPI(PLUGIN_ID, 'Nuclear Podcasts').Views;

describe('Plugin views', () => {
  beforeEach(() => {
    PluginViewsWrapper.reset();
  });

  it('shows a sidebar entry with the title of a registered view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));

    await PluginViewsWrapper.mount('/dashboard');

    expect(PluginViewsWrapper.sidebar.entry('Podcasts').element).toBeVisible();
  });

  it('opens the root page of a view when the user clicks its sidebar entry', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await PluginViewsWrapper.mount('/dashboard');

    await PluginViewsWrapper.sidebar.entry('Podcasts').click();

    expect(await PluginViewsWrapper.findPage('All podcasts')).toBeVisible();
  });
  it('opens a sub-page with its params when the user clicks a link in the view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await PluginViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await PluginViewsWrapper.findPage('All podcasts');

    await PluginViewsWrapper.link('Latest episode').click();

    expect(
      await PluginViewsWrapper.findPage('Show 7, episode 42'),
    ).toBeVisible();
  });
  it('returns to the previous page of the view when the user clicks back in the top bar', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await PluginViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await PluginViewsWrapper.link('Latest episode').click();
    await PluginViewsWrapper.findPage('Show 7, episode 42');

    await PluginViewsWrapper.topBar.back();

    expect(await PluginViewsWrapper.findPage('All podcasts')).toBeVisible();
  });
  it('opens a sub-page directly from its URL', async () => {
    views.register(createPodcastsView(PLUGIN_ID));

    await PluginViewsWrapper.mount(
      `/plugin/${PLUGIN_ID}/podcasts/show/7/episode/42`,
    );

    expect(
      await PluginViewsWrapper.findPage('Show 7, episode 42'),
    ).toBeVisible();
  });

  it('opens a player page from a link in the view, and back returns to the view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await PluginViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await PluginViewsWrapper.link('Manage sources').click();
    await SourcesWrapper.view.find();

    await PluginViewsWrapper.topBar.back();

    expect(await PluginViewsWrapper.findPage('All podcasts')).toBeVisible();
  });
  it('shows the new version of the open view when the plugin registers it again', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await PluginViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await PluginViewsWrapper.findPage('All podcasts');

    views.register(REDESIGNED_PODCASTS_VIEW);

    expect(
      await PluginViewsWrapper.findPage('All podcasts, redesigned'),
    ).toBeVisible();
  });

  it('shows the dashboard when the plugin unregisters the open view', async () => {
    views.register(createPodcastsView(PLUGIN_ID));
    await PluginViewsWrapper.mount(`/plugin/${PLUGIN_ID}/podcasts`);
    await PluginViewsWrapper.findPage('All podcasts');

    views.unregister('podcasts');

    expect(await DashboardWrapper.view.find()).toBeVisible();
  });
});
