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

    expect(await PluginViewsWrapper.findPage('Listening stats')).toBeVisible();
  });

  it('shows the named export on a route that sets export', async () => {
    await dispatch('Views.register', { view: RAW_STATS_VIEW });
    await PluginViewsWrapper.mount('/dashboard');
    await PluginViewsWrapper.sidebar.entry('Stats 2026').click();
    await PluginViewsWrapper.findPage('Listening stats');

    await PluginViewsWrapper.link('March').click();

    expect(await PluginViewsWrapper.findPage('Month 3')).toBeVisible();
  });

  it('shows a component that the view imports from @nuclearplayer/ui', async () => {
    await dispatch('Views.register', { view: RAW_TOOLBOX_VIEW });
    await PluginViewsWrapper.mount('/dashboard');

    await PluginViewsWrapper.sidebar.entry('Toolbox').click();

    expect(await PluginViewsWrapper.findButton('Refresh stats')).toBeVisible();
  });
});
