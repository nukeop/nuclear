/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { waitFor } from '@testing-library/react';
import { IpcEvents, store as electronStore } from '@nuclear/core';
import { ipcRenderer } from 'electron';

import { buildElectronStoreState, buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, mountedComponentFactory, setupI18Next } from '../../../test/testUtils';

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

  it('can go to the next page', async () => {
    // @ts-ignore
    ipcRenderer.invoke.mockImplementation((event, payload) => {
      if (payload.afterCursor) {
        return Promise.resolve({
          data: [{
            uuid: 'test1',
            artist: 'test artist1',
            title: 'test title1',
            createdAt: new Date('2020-01-03')
          }],
          cursor: {
            beforeCursor: null,
            afterCursor: null
          }
        });
      } else {
        return Promise.resolve({
          data: [{
            uuid: 'test',
            artist: 'test artist',
            title: 'test title',
            createdAt: new Date('2020-01-03')
          }],
          cursor: {
            beforeCursor: null,
            afterCursor: 'test'
          }
        });
      }
    });
    const { component } = mountComponent();

    waitFor(() => expect(component.getByText('test artist - test title')).toBeInTheDocument());

    component.getByTestId('next-page').click();

    await waitFor(() => expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvents.FETCH_LISTENING_HISTORY, {
      beforeCursor: null,
      afterCursor: 'test'
    }));
  });

  it('can go to the previous page', async () => {
    // @ts-ignore
    ipcRenderer.invoke.mockImplementation((event, payload) => {
      if (payload.beforeCursor) {
        return Promise.resolve({
          data: [{
            uuid: 'test3',
            artist: 'test artist3',
            title: 'test title 3',
            createdAt: new Date('2020-01-03')
          }],
          cursor: {
            beforeCursor: null,
            afterCursor: null
          }
        });
      } else {
        return Promise.resolve({
          data: [],
          cursor: {
            beforeCursor: 'test',
            afterCursor: null
          }
        });
      }
    });
    const { component } = mountComponent();

    component.getByTestId('previous-page').click();

    await waitFor(() => expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvents.FETCH_LISTENING_HISTORY, {
      beforeCursor: 'test',
      afterCursor: null
    }));
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
