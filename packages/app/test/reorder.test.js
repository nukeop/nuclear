/* eslint-disable @typescript-eslint/no-var-requires */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

describe('Reorder Reducer Test', () => {
  const QueueReducer = require('../app/reducers/queue').default;
  const { REPOSITION_SONG } = require('../app/actions/queue');

  it('should not change anything for a queue of length 1', () => {
    const initialState = { currentSong: 0, queueItems: [{ uuid: 'first'}]};
    const action = {
      type: REPOSITION_SONG,
      payload: {
        itemFrom: 0,
        itemTo: 0
      }
    };
    const finalState = QueueReducer(initialState, action);

    expect(finalState.currentSong).to.equal(0);
    expect(finalState.queueItems.length).to.equal(1);
    expect(finalState.queueItems[0].uuid).to.equal('first');

  });


  it('should move the current song to where it is dragged', () => {
    const initialState = { 
      currentSong: 0, 
      queueItems: [{uuid: 'first'},  {uuid: 'second'},  {uuid: 'third'}]
    };
    const moveToLastAction = {
      type: REPOSITION_SONG,
      payload: {
        itemFrom: 0,
        itemTo: 2
      }
    };

    const intermediateState = QueueReducer(initialState, moveToLastAction);
    expect(intermediateState.currentSong).to.equal(2);

    const moveToMiddleAction = {
      type: REPOSITION_SONG,
      payload: {
        itemFrom: 2,
        itemTo: 1
      }
    };

    const finalState = QueueReducer(intermediateState, moveToMiddleAction);
    expect(finalState.currentSong).to.equal(1);
        
  });

  it('should reposition the current song if adjacent songs are moved', () => {
    const initialState = { 
      currentSong: 1, 
      queueItems: [{uuid: 'first'},  {uuid: 'second'},  {uuid: 'third'}]
    };
    const action = {
      type: REPOSITION_SONG,
      payload: {
        itemFrom: 0,
        itemTo: 2
      }
    };
    const finalState = QueueReducer(initialState, action);
    expect(finalState.currentSong).to.equal(0);
  });

});
