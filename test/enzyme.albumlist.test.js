import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'semantic-ui-react';

import Card from '../app/components/Card';
import AlbumList from '../app/components/AlbumList';

describe('<AlbumList />', () => {
  const mockedAlbums = [
    {
      id: 'ID1',
      type: 'TYPE1',
      title: 'TITLE1',
      thumb: 'THUMB1'
    },
    {
      id: 'ID2',
      type: 'TYPE2',
      title: 'TITLE2',
      thumb: 'THUMB2'
    },
    {
      id: 'ID3',
      type: 'TYPE3',
      title: 'TITLE3',
      thumb: 'THUMB3'
    }
  ];

  it('Should render loader when there is no album', () => {
    const wrapper = shallow(<AlbumList />);

    expect(wrapper.exists(Loader)).toBe(true);
  });

  it('Should render given albums', () => {
    const wrapper = shallow(<AlbumList albums={mockedAlbums} />);
    const cardsProps = wrapper.find(Card).map(card => card.props());

    expect(mockedAlbums.every(({ title, thumb }, i) =>
      cardsProps[i].header === title && cardsProps[i].image === thumb
    )).toBe(true);
  });

  it('Test albumInfoSearch method', () => {
    const fakeHistory = { push: jest.fn() };
    const albumInfoSearch = jest.fn();
    const wrapper = shallow(
      <AlbumList history={fakeHistory} albumInfoSearch={albumInfoSearch} />
    );
    const instance = wrapper.instance();

    instance.albumInfoSearch('ALBUM_ID', 'RELEASE_TYPE');
    expect(albumInfoSearch).toHaveBeenCalledWith('ALBUM_ID', 'RELEASE_TYPE');
    expect(fakeHistory.push).toHaveBeenCalledWith('/album/ALBUM_ID');
  });
});
