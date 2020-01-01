import React from 'react';
import { Provider } from 'react-redux';
import { compose, withProps } from 'recompose';
import  PlayerReducer  from '../../app/reducers/player';
import { resetPlayer } from '../../app/actions/player';
import { QueueMenuMore, enhance as MenuEnhance } from '../../app/components/PlayQueue/QueueMenu/QueueMenuMore';
import Seekbar from '../../app/components/Seekbar';
import {QueueItem, enhance as ItemEnhance } from '@nuclear/ui/lib/components/QueueItem';


import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import spies from 'chai-spies';
import chai from 'chai';
chai.use(spies);
const { expect } = chai;

import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import { Dropdown } from 'semantic-ui-react';

describe('Queue and Player Integration', () => {

  const createFakeStore = () => {
    const initialState = { 
      playbackProgress: 50
    };
        
    const store = createStore(
      PlayerReducer,
      initialState,
      applyMiddleware(thunk)
    );

    return store;
  };

  it('resets the player if the queue is cleared', () => {

    // create store
    const store = createFakeStore();

    // mount player with 50% fill
    const ConnectedSeekbar = connect(
      state => ({ fill: state.playbackProgress + '%' })
    )(Seekbar);
            
    // mount queue menu
    const ConnectedQueueMenuMore = compose(
      withProps({ 
        sendPaused: chai.spy(),
        clearQueue: chai.spy() 
      }),
      connect(
        null, dispatch => bindActionCreators({resetPlayer}, dispatch)
      )
    )(MenuEnhance(QueueMenuMore));

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedQueueMenuMore />
        <ConnectedSeekbar /> 
      </Provider>
    );
        
    // expect player with 50% fill
    expect(wrapper.find(Seekbar).prop('fill')).to.equal('50%');
        
    // simulate click clear queue
    const clearQueueAction = wrapper.find(QueueMenuMore).find(Dropdown.Item).at(0);
    clearQueueAction.simulate('click');

    // expect player with 0% fill
    wrapper.update();
    expect(wrapper.find(Seekbar).prop('fill')).to.equal('0%');

    wrapper.unmount();
  });

  it('resets the player if the last song is removed', () => {

    // create store 
    const store = createFakeStore();
        
    // mount player with 50% fill
    const ConnectedSeekbar = connect(
      state => ({ fill: state.playbackProgress + '%' })
    )(Seekbar);
            
    // mount song
    const ConnectedQueueItem = compose(
      withProps({
        track: {name: '1', thumbnail: '2', artist: '3'},
        resetPlayer,
        sendPaused: chai.spy(),
        removeFromQueue: chai.spy()
      }),
      connect(
        null,
        dispatch => bindActionCreators( {resetPlayer}, dispatch)
      )
    )(ItemEnhance(QueueItem));

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedSeekbar />
        <ConnectedQueueItem />
      </Provider>
    ); 

    // expect player with 50% fill
    expect(wrapper.find(Seekbar).prop('fill')).to.equal('50%');
        
    // click remove song
    const removeSongAction = wrapper.find(QueueItem).prop('handleRemoveFromQueue');
    removeSongAction();

    // expect player with 0% fill
    wrapper.update();
    expect(wrapper.find(Seekbar).prop('fill')).to.equal('0%');
        
    wrapper.unmount();
  });

});
