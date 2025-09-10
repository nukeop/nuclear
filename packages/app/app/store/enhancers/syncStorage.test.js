
import {
  initialStoreState,
  mockElectronStore
} from '../../../test/mockElectronStore';
import { configureMockStore } from '../../../test/testUtils';

describe('Store Initialization and Sync with electronStore', () => {
  let store;
  const mockedStore = mockElectronStore(initialStoreState());


  jest.mock('@nuclear/core', () => ({
    store: mockedStore
  }));

  beforeEach(() => {
    mockedStore.set('queue.queueItems', [{ uuid: 1, title: 'Initial Song' }]);
    mockedStore.set('queue.currentSong', 0);
    mockedStore.set('nuclear.identity', { userId: '123' });

    store = configureMockStore();
  });

  it('loads initial state from electronStore correctly', () => {
    const state = store.getState();
    expect(state.queue.queueItems).toEqual([
      { uuid: 1, title: 'Initial Song' }
    ]);
    expect(state.queue.currentSong).toEqual(0);
    expect(state.nuclear.identity).toEqual({ userId: '123' });
  });

  it('updates electronStore when state changes', () => {
    store.dispatch({
      type: 'UPDATE_QUEUE_ITEMS',
      payload: [{ uuid: 2, title: 'New Song' }]
    });
    store.dispatch({
      type: 'UPDATE_CURRENT_SONG',
      payload: 1
    });

    expect(mockedStore.get('queue.queueItems')).toEqual([
      { uuid: 2, title: 'New Song' }
    ]);
    expect(mockedStore.get('queue.currentSong')).toEqual(1);
  });
});
