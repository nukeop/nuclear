import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import { Dropdown, Icon } from 'semantic-ui-react';

import QueueMenuMore from '../app/components/PlayQueue/QueueMenu/QueueMenuMore'

chai.use(spies);
const { expect } = chai;

describe('Clear queue button', () => {
  it('Has trash icon and clearQueue action fired on click', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore clearQueue={spy}/>);
    wrapper.find(Dropdown.Item).at(0).simulate('click');

    expect(spy).to.have.been.called;
    expect(wrapper.find(Dropdown.Item).at(0).find(Icon).prop('name')).to.equal('trash');
  });
});

describe('Playlist button', () => {
  it('Has music icon and adds track to playlist on click', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore updatePlaylist={spy} playlists={[1]}/>);

    wrapper.find(Dropdown.Item).at(2).simulate('click');
    expect(spy).to.have.been.called;
    expect(wrapper.find(Dropdown.Item).at(2).find(Icon).prop('name')).to.equal('music');
  });
});

describe('Add favorite track button', () => {
  it('Has star icon and addFavoriteTrack fired on click of playlist item', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore addFavoriteTrack={spy} playlists={[1]}/>);
    wrapper.find(Dropdown.Item).at(3).simulate('click');
    expect(spy).to.have.been.called;
    expect(wrapper.find(Dropdown.Item).at(3).find(Icon).prop('name')).to.equal('star');
  });
});

describe('Add to downloads button', () => {
  it('Has download icon and fires addToDownloads on click of playlist item', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore addToDownloads={spy} playlists={[1]}/>);
    wrapper.find(Dropdown.Item).at(4).simulate('click');
    expect(spy).to.have.been.called;
    expect(wrapper.find(Dropdown.Item).at(4).find(Icon).prop('name')).to.equal('download');
  });
});
