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
        createdAt: new Date('2020-01-01, 12:00')
      }, {
        uuid: 'test2',
        artist: 'test artist2',
        title: 'test title 2',
        createdAt: new Date('2020-01-02, 12:00')
      }],
      cursor: {
        beforeCursor: null,
        afterCursor: null
      }
    }),
    send: jest.fn()
  }
}));

const makeLocal = (dateString, timeString?) => {
  const date = new Date(dateString).toLocaleDateString();

  if (timeString) {
    const time = new Date(`${dateString}, ${timeString}`).toLocaleTimeString();
    return `${date}, ${time}`;
  } else {
    return date;
  }
};

describe('Listening history container', () => {

  it.each([
    makeLocal('2020-01-01'),
    'test title',
    'test artist',
    makeLocal('2020-01-02'),
    'test title 2',
    'test artist2'
  ])('renders the listening history text: %s', async (text) => {
    const { component } = mountComponent();
    
    expect(await component.findByText(text)).toBeInTheDocument();
  });

  it('can refresh history', async () => {
    const { component } = mountComponent();

    component.getByTestId('refresh-history').click();
    expect(ipcRenderer.invoke).toHaveBeenNthCalledWith(2, IpcEvents.FETCH_LISTENING_HISTORY, { limit: 10 });
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
            afterCursor: btoa('createdAt:1000')
          }
        });
      }
    });
    const { component } = mountComponent();

    expect(await component.findByText('test artist')).toBeInTheDocument();
    expect(await component.findByText('test title')).toBeInTheDocument();
    
    component.getByTestId('next-page').click();
    
    await waitFor(() => expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvents.FETCH_LISTENING_HISTORY, {
      limit: 10,
      afterCursor: btoa('createdAt:999')
    }));
    expect(await component.findByText('test artist1')).toBeInTheDocument();
    expect(await component.findByText('test title1')).toBeInTheDocument();
  });

  it('can go to the previous page', async () => {
    // @ts-ignore
    ipcRenderer.invoke.mockImplementation((event, payload) => {
      if (payload.beforeCursor) {
        return Promise.resolve({
          data: [{
            uuid: 'test3',
            artist: 'test artist3',
            title: 'test title3',
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
            beforeCursor: btoa('createdAt:1000'),
            afterCursor: null
          }
        });
      }
    });
    const { component } = mountComponent();

    expect(await component.findByText('test artist')).toBeInTheDocument();
    expect(await component.findByText('test title')).toBeInTheDocument();
    
    component.getByTestId('previous-page').click();
    
    await waitFor(() => expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvents.FETCH_LISTENING_HISTORY, {
      beforeCursor: btoa('createdAt:1000'),
      limit: 10
    }));
    expect(await component.findByText('test artist3')).toBeInTheDocument();
    expect(await component.findByText('test title3')).toBeInTheDocument();
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
