import React from 'react';
import { Provider } from 'react-redux';
import { compose, withProps } from 'recompose';
import  PlayerReducer  from '../../app/reducers/player';
import { resetPlayer } from '../../app/actions/player';
import  QueueReducer  from '../../app/reducers/queue';
import { QueueMenuMore } from '../../app/components/PlayQueue/QueueMenu/QueueMenuMore';
import Seekbar from '../../app/components/Seekbar';



import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import spies from 'chai-spies';
import chai from 'chai';
chai.use(spies);
const { expect } = chai;

import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import { Dropdown } from 'semantic-ui-react';

describe('Queue and Player Integration', () => {
    const createFakeStore = () => {
        const initialState = { 
            playbackProgress: 50
         }
        
        const store = createStore(
            PlayerReducer,
            initialState,
            applyMiddleware(thunk)
        )

        return store;
    }
    it.only('resets the player if the queue is cleared', () => {
        // create store 
        // mount queue menu
        // mount player with 50% fill
        // simulate click clear queue
        // expect player with 0% fill

        const store = createFakeStore();
        const ConnectedSeekbar = connect(
            state => ({ fill: state.playbackProgress + '%' })
            )(Seekbar);

        const ConnectedQueueMenuMore = compose(
            connect(), 
            withProps({ resetPlayer: resetPlayer(chai.spy())})
        )(QueueMenuMore)

        const wrapper = mount(
            <Provider store={store}>
                <ConnectedQueueMenuMore />
                <ConnectedSeekbar /> 
            </Provider>
        );

        expect(wrapper.find(Seekbar).prop('fill')).to.equal('50%');
        const clearQueueAction = wrapper.find(QueueMenuMore).find(Dropdown.Item).at(0);

        clearQueueAction.simulate('click');

        // store.dispatch(resetPlayer(() => {}));

        wrapper.update();
        expect(wrapper.find(Seekbar).prop('fill')).to.equal('0%');
    })

    it('resets the player if the last song is removed', () => {
        // create store 
        // mount queue with songs
        // mount player with 50% fill
        // click remove song
        // expect player with 0% fill
    })
})