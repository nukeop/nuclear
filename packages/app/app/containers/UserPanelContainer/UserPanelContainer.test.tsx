import React from 'react';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';

import { UserPanelContainer } from '.';
import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, mountComponent, setupI18Next } from '../../../test/testUtils';

describe('User panel container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
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
    jest.runAllTimers();

    expect(component.container.querySelector('.fullscreen_layer.hidden')).toBeTruthy();

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should validate the sign up form', async () => {
    const { component } = mountUserPanel();

    await waitFor(() => component.getByText(/Sign up \/ Sign in/i).click());
    await waitFor(() => component.getAllByText(/Sign up/i)[1].click());

    userEvent.type(component.queryAllByPlaceholderText(/username/i)[1], 'abc');
    userEvent.type(component.getByPlaceholderText(/email/i), 'not.an.email');
    userEvent.type(component.queryAllByPlaceholderText(/password/i)[1], 'short');

    await act(async () => {
      await waitFor(() => userEvent.tab());
    }); // Needed to flush the microtask queue
    await component.findByText(/Username must be 4 characters or more/i);
    await component.findByText(/Email must be a valid email/i);
    await component.findByText(/Password must be 6 characters or more/i);

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
