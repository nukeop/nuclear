import { dispatch } from '../services/bridge/bridgeDispatcher';
import { RAW_STATS_VIEW, RAW_TOOLBOX_VIEW } from '../test/fixtures/customViews';
import { CustomViewsWrapper } from './CustomViews.test-wrapper';

describe('Custom views from agents', () => {
  beforeEach(() => {
    CustomViewsWrapper.reset();
  });

  it('shows the default export when the user opens the view', async () => {
    await dispatch('Views.register', { view: RAW_STATS_VIEW });
    await CustomViewsWrapper.mount('/dashboard');

    await CustomViewsWrapper.sidebar.entry('Stats 2026').click();

    expect(await CustomViewsWrapper.statsOverview.find()).toBeVisible();
  });

  it('shows the named export on a route that sets export', async () => {
    await dispatch('Views.register', { view: RAW_STATS_VIEW });
    await CustomViewsWrapper.mount('/plugin/bridge/stats-2026');
    await CustomViewsWrapper.statsOverview.find();

    await CustomViewsWrapper.statsOverview.month(3).click();

    await CustomViewsWrapper.statsMonth.find();
    expect(CustomViewsWrapper.statsMonth.text).toBe('Month 3');
  });

  it('shows a component that the view imports from @nuclearplayer/ui', async () => {
    await dispatch('Views.register', { view: RAW_TOOLBOX_VIEW });
    await CustomViewsWrapper.mount('/dashboard');

    await CustomViewsWrapper.sidebar.entry('Toolbox').click();

    await CustomViewsWrapper.toolboxRefreshButton.find();
    expect(CustomViewsWrapper.toolboxRefreshButton.text).toBe('Refresh stats');
  });
});
