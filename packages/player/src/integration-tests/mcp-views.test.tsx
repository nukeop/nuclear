import { dispatch } from '../services/bridge/bridgeDispatcher';
import { RAW_STATS_VIEW, RAW_TOOLBOX_VIEW } from '../test/fixtures/pluginViews';
import { PluginViewsWrapper } from './PluginViews.test-wrapper';

describe('Views registered over MCP', () => {
  beforeEach(() => {
    PluginViewsWrapper.reset();
  });

  it('shows the default export when the user opens the view', async () => {
    await dispatch('Views.register', { view: RAW_STATS_VIEW });
    await PluginViewsWrapper.mount('/dashboard');

    await PluginViewsWrapper.sidebar.entry('Stats 2026').click();

    expect(await PluginViewsWrapper.statsOverview.find()).toBeVisible();
  });

  it('shows the named export on a route that sets export', async () => {
    await dispatch('Views.register', { view: RAW_STATS_VIEW });
    await PluginViewsWrapper.mount('/plugin/bridge/stats-2026');
    await PluginViewsWrapper.statsOverview.find();

    await PluginViewsWrapper.statsOverview.month(3).click();

    await PluginViewsWrapper.statsMonth.find();
    expect(PluginViewsWrapper.statsMonth.text).toBe('Month 3');
  });

  it('shows a component that the view imports from @nuclearplayer/ui', async () => {
    await dispatch('Views.register', { view: RAW_TOOLBOX_VIEW });
    await PluginViewsWrapper.mount('/dashboard');

    await PluginViewsWrapper.sidebar.entry('Toolbox').click();

    await PluginViewsWrapper.toolboxRefreshButton.find();
    expect(PluginViewsWrapper.toolboxRefreshButton.text).toBe('Refresh stats');
  });
});
