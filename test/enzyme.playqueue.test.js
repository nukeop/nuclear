import 'jsdom-global/register';
import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow, mount, configure } from 'enzyme';
import { describe, it } from 'mocha';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dropdown, Icon } from 'semantic-ui-react';

import PlayQueue from '../app/components/PlayQueue';
import QueuePopup from '../app/components/QueuePopup';
import QueueMenu from '../app/components/PlayQueue/QueueMenu';
import QueueMenuMore from '../app/components/PlayQueue/QueueMenu/QueueMenuMore'


chai.use(spies);
const { expect } = chai;

import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('Clear queue button', () => {
  it('Clears queue on click of first menu item', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore clearQueue={spy}/>);
    wrapper.find(Dropdown.Item).at(0).simulate('click');
    expect(spy).to.have.been.called;
  })
});

describe('add to playlist button', () => {
  it('Adds track to playlist', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore updatePlaylist={spy} playlists={[1]}/>);
    wrapper.find(Dropdown.Item).at(2).simulate('click');
    expect(spy).to.have.been.called;
  })
});

describe('add favorite track', () => {
  it('Adds track to favorites', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore addFavoriteTrack={spy} playlists={[1]}/>);
    wrapper.find(Dropdown.Item).at(3).simulate('click');
    expect(spy).to.have.been.called;
  })
});

describe('add to downloads', () => {
  it('Adds track to downloads', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore addToDownloads={spy} playlists={[1]}/>);
    wrapper.find(Dropdown.Item).at(4).simulate('click');
    expect(spy).to.have.been.called;
  })
});
