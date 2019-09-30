import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import { Dropdown, Icon } from 'semantic-ui-react';

import QueueMenuMore from '../app/components/PlayQueue/QueueMenu/QueueMenuMore'

chai.use(spies);
const { expect } = chai;

describe('<QueueMenuMore /> Clear queue button', () => {
  it('Has trash icon and clearQueue action fired on click', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore clearQueue={spy}/>);
    const trashItem = wrapper.find(Dropdown.Item).at(0);

    trashItem.simulate('click');
    expect(spy).to.have.been.called;
    expect(trashItem.find(Icon).prop('name')).to.equal('trash');
  });
});

describe('<QueueMenuMore /> Playlist button', () => {
  it('Has music icon and adds track to playlist on click', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore updatePlaylist={spy} playlists={[1]}/>);
    const trackItem = wrapper.find(Dropdown.Item).at(2)

    trackItem.simulate('click');
    expect(spy).to.have.been.called;
    expect(trackItem.find(Icon).prop('name')).to.equal('music');
  });
});

describe('<QueueMenuMore /> Add favorite track button', () => {
  it('Has star icon and addFavoriteTrack fired on click of playlist item', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore addFavoriteTrack={spy} playlists={[1]}/>);
    const favItem = wrapper.find(Dropdown.Item).at(3);

    favItem.simulate('click');
    expect(spy).to.have.been.called;
    expect(favItem.find(Icon).prop('name')).to.equal('star');
  });
});

describe('<QueueMenuMore /> Add to downloads button', () => {
  it('Has download icon and fires addToDownloads on click of playlist item', () => {
    const spy = chai.spy();
    const wrapper = mount(<QueueMenuMore addToDownloads={spy} playlists={[1]}/>);
    const downloadItem = wrapper.find(Dropdown.Item).at(4)

    downloadItem.simulate('click');
    expect(spy).to.have.been.called;
    expect(downloadItem.find(Icon).prop('name')).to.equal('download');
  });
});
