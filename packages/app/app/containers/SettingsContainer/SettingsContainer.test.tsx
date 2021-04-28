import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory } from '../../../test/testUtils';

describe('Settings view container', () => {
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
