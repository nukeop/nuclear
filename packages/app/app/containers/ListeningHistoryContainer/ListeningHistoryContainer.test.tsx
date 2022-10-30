/* eslint-disable @typescript-eslint/ban-ts-comment */
import { waitFor } from '@testing-library/react';
import { IpcEvents, store as electronStore } from '@nuclear/core';

import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, mountedComponentFactory, setupI18Next } from '../../../test/testUtils';
import { ipcRenderer } from 'electron';

jest.mock('electron-store', () => jest.fn().mockImplementation(() => ({
  get: jest.fn(),
  set: jest.fn()
})));

jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn().mockResolvedValue({
      data: [{
        uuid: 'test',
        artist: 'test artist',
        title: 'test title',
        createdAt: new Date('2020-01-01')
      }, {
        uuid: 'test2',
        artist: 'test artist2',
        title: 'test title 2',
        createdAt: new Date('2020-01-02')
      }],
      cursor: {
        beforeCursor: null,
        afterCursor: null
      }
    }),
    send: jest.fn()
  }
}));

describe('Listening history container', () => {

  it('renders the listening history', () => {
    const { component } = mountComponent();

    waitFor(() => expect(component.getByText('test artist - test title')).toBeInTheDocument());
    waitFor(() => expect(component.getByText('test artist2 - test title 2')).toBeInTheDocument());
  });

  it('can refresh history', async () => {
    const { component } = mountComponent();

    component.getByTestId('refresh-history').click();

    expect(ipcRenderer.invoke).toHaveBeenCalledTimes(2);
  });

  it('can clear history', async () => {
    const { component } = mountComponent();

    component.getByText('Clear history').click();
    component.getByText('Confirm').click();

    await waitFor(() => expect(ipcRenderer.send).toHaveBeenCalledWith(IpcEvents.CLEAR_LISTENING_HISTORY));
  });

  const mountComponent = (electronStoreState?: AnyProps) => {
    // @ts-ignore
    electronStore.init({
      ...buildElectronStoreState(electronStoreState)
    });
    setupI18Next();
    return mountedComponentFactory(
      ['/listening-history'],
      buildStoreState()
        .withConnectivity()
        .build()
    )();
  };
});
