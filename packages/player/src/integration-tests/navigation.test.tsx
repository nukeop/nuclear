import { createPluginAPI } from '../services/plugins/createPluginAPI';
import { DashboardWrapper } from '../views/Dashboard/Dashboard.test-wrapper';
import { SearchWrapper } from '../views/Search/Search.test-wrapper';
import { SourcesWrapper } from '../views/Sources/Sources.test-wrapper';
import { NavigationWrapper } from './Navigation.test-wrapper';

const navigation = createPluginAPI(
  'navigation-test',
  'Navigation Test',
).Navigation;

describe('Navigation API', () => {
  it('renders the page at the path given to navigate', async () => {
    await NavigationWrapper.mount('/dashboard');

    await navigation.navigate('/sources');

    expect(await SourcesWrapper.view.find()).toBeVisible();
  });

  it('passes the search string of the path to the page', async () => {
    await NavigationWrapper.mount('/dashboard');

    await navigation.navigate('/search?q=radiohead');

    expect(await SearchWrapper.findSearchQuery('radiohead')).toBeVisible();
  });

  it('returns the current location with parsed search params', async () => {
    await NavigationWrapper.mount('/dashboard');

    await navigation.navigate('/search?q=radiohead');

    expect(navigation.current()).toEqual({
      href: '/search?q=radiohead',
      pathname: '/search',
      search: { q: 'radiohead' },
      hash: '',
    });
  });

  it('returns to the previous page on back', async () => {
    await NavigationWrapper.mount('/dashboard');
    await navigation.navigate('/sources');
    await SourcesWrapper.view.find();

    navigation.back();

    expect(await DashboardWrapper.view.find()).toBeVisible();
  });

  it('returns to the next page on forward after back', async () => {
    await NavigationWrapper.mount('/dashboard');
    await navigation.navigate('/sources');
    await SourcesWrapper.view.find();
    navigation.back();
    await DashboardWrapper.view.find();

    navigation.forward();

    expect(await SourcesWrapper.view.find()).toBeVisible();
  });
});
