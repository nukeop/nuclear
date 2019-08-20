import React from 'react';
import { mount } from 'enzyme';
import { Dropdown, Icon } from 'semantic-ui-react';

import QueueMenuMore from '../app/components/PlayQueue/QueueMenu/QueueMenuMore';


describe('<QueueMenuMore /> Clear queue button', () => {
  it('Has trash icon and clearQueue action fired on click', () => {
    const spy = jest.fn();
    const wrapper = mount(<QueueMenuMore clearQueue={spy}/>);
    expect(wrapper).toMatchSnapshot();
    const trashItem = wrapper.find(Dropdown.Item).at(0);

    trashItem.simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(trashItem.find(Icon).prop('name')).toBe('trash');
  });
});

describe('<QueueMenuMore /> Playlist button', () => {
  it('Has music icon and adds track to playlist on click', () => {
    const spy = jest.fn();
    const wrapper = mount(<QueueMenuMore updatePlaylist={spy} playlists={[{name: 'test', tracks: []}]} currentItem={{name: 'test'}}/>);
    expect(wrapper).toMatchSnapshot();
    const trackItem = wrapper.find(Dropdown.Item).at(2);

    trackItem.simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(trackItem.find(Icon).prop('name')).toBe('music');
  });
});

describe('<QueueMenuMore /> Add favorite track button', () => {
  it('Has star icon and addFavoriteTrack fired on click of playlist item', () => {
    const spy = jest.fn();
    const wrapper = mount(<QueueMenuMore addFavoriteTrack={spy} playlists={[{name: 'test', tracks: []}]} currentItem={{name: 'test'}}/>);
    expect(wrapper).toMatchSnapshot();
    const favItem = wrapper.find(Dropdown.Item).at(3);

    favItem.simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(favItem.find(Icon).prop('name')).toBe('star');
  });
});

describe('<QueueMenuMore /> Add to downloads button', () => {
  it('Has download icon and fires addToDownloads on click of playlist item', () => {
    const spy = jest.fn();
    const wrapper = mount(<QueueMenuMore addToDownloads={spy} playlists={[1]}/>);
    expect(wrapper).toMatchSnapshot();
    const downloadItem = wrapper.find(Dropdown.Item).at(4);

    downloadItem.simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(downloadItem.find(Icon).prop('name')).toBe('download');
  });
});
