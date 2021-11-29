import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

describe('Settings view container', () => {
  beforeAll(() => {
    setupI18Next();
  });
  it('should render settings', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountComponent = mountedComponentFactory(
    ['/settings'],
    buildStoreState()
      .withConnectivity()
      .build()
  );
});
