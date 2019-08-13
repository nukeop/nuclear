import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow, mount } from 'enzyme';
import { describe, it } from 'mocha';
import { Dropdown, Icon } from 'semantic-ui-react';

import QueueMenuMore from '../app/components/PlayQueue/QueueMenu/QueueMenuMore'

chai.use(spies);
const { expect } = chai;

describe('Clear queue button', () => {
  const spy = chai.spy();
  const wrapper = mount(<QueueMenuMore clearQueue={spy}/>);

  it('clearQueue action fired', () => {
    wrapper.find(Dropdown.Item).at(0).simulate('click');
    expect(spy).to.have.been.called;
  });

  it('Has the trash icon', () => {
    expect(wrapper.find(Dropdown.Item).at(0).find(Icon).prop('name')).to.equal('trash');
  });
});

describe('Playlist button', () => {
  const spy = chai.spy();
  const wrapper = mount(<QueueMenuMore updatePlaylist={spy} playlists={[1]}/>);

  it('Adds track to playlist on click', () => {
    wrapper.find(Dropdown.Item).at(2).simulate('click');
    expect(spy).to.have.been.called;
  });

  it('Has the music icon', () => {
    expect(wrapper.find(Dropdown.Item).at(2).find(Icon).prop('name')).to.equal('music');
  });
});

describe('Add favorite track button', () => {
  const spy = chai.spy();
  const wrapper = mount(<QueueMenuMore addFavoriteTrack={spy} playlists={[1]}/>);

  it('Fires addFavoriteTrack on click of playlist item', () => {
    wrapper.find(Dropdown.Item).at(3).simulate('click');
    expect(spy).to.have.been.called;
  });

  it('Has the star icon', () => {
    expect(wrapper.find(Dropdown.Item).at(3).find(Icon).prop('name')).to.equal('star');
  });
});

describe('Add to downloads button', () => {
  const spy = chai.spy();
  const wrapper = mount(<QueueMenuMore addToDownloads={spy} playlists={[1]}/>);

  it('Fires addToDownloads on click of playlist item', () => {
    wrapper.find(Dropdown.Item).at(4).simulate('click');
    expect(spy).to.have.been.called;
  });

  it('Has the download icon', () => {
    expect(wrapper.find(Dropdown.Item).at(4).find(Icon).prop('name')).to.equal('download');
  });
});
