import { store as electronStore } from '@nuclear/core';
import { buildStoreState } from '../../../test/storeBuilders';
import { mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

const initialStoreState = 
buildStoreState()
  .withDownloads()
  .withPlugins()
  .withConnectivity()
  .build();

describe('Downloads container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    electronStore.set(
      'downloads',
      initialStoreState.downloads
    );
  });

  it('should display downloads', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountComponent = mountedComponentFactory(
    ['/downloads'],
    initialStoreState
  );
});
