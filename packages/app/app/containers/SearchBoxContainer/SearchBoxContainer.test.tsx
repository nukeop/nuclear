import React from 'react';
import { render } from '@testing-library/react';

import SearchBoxContainer from '.';
import { AnyProps, configureMockStore, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import { buildStoreState } from '../../../test/storeBuilders';

describe('Search box container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should render the search box', () => {
    const { component } = mountComponent();

    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const initialState = initialStore ||
            buildStoreState()
              .withPlugins()
              .build();
    const store = configureMockStore(initialState);
    const component = render(
      <TestStoreProvider store={store}>
        <SearchBoxContainer />
      </TestStoreProvider>
    );

    return {
      component,
      store
    };
  };
});
