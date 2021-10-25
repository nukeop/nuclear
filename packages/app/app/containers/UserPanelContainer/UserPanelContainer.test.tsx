import { waitFor } from '@testing-library/dom';
import React from 'react';
import { UserPanelContainer } from '.';
import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, mountComponent, setupI18Next } from '../../../test/testUtils';

describe('User panel container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should render the user panel', () => {
    const { component } = mountUserPanel();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should render the sign in form', async () => {
    const { component } = mountUserPanel();

    await waitFor(() => component.getByText(/Sign up \/ Sign in/i).click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should render the sign up form', async () => {
    const { component } = mountUserPanel();

    await waitFor(() => component.getByText(/Sign up \/ Sign in/i).click());
    await waitFor(() => component.getAllByText(/Sign up/i)[1].click());

    expect(component.asFragment()).toMatchSnapshot();
  });

  const mountUserPanel = (initialStore?: AnyProps) => {
    return mountComponent(
      <UserPanelContainer />,
      ['/'],
      initialStore,
      buildStoreState()
        .build()
    );
  };
});
