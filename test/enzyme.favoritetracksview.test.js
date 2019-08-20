import React from 'react';
import {Provider} from 'react-redux';
import { mount } from 'enzyme';
jest.mock('../app/persistence/store', () => {
  return null;
});
import FavoriteTracksView,  {EmptyState} from '../app/components/FavoriteTracksView';

const mockStore = () => ({
  getState: jest.fn(() => ({plugin: {plugins: {musicSources: []}}})),
  subscribe: jest.fn(),
  dispatch: jest.fn()
});

describe('<FavoriteTracksView />', () => {  
  it('Should render <EmptyState /> when there is no track', () => {
    const wrapper = mount(<Provider store={mockStore()}><FavoriteTracksView /></Provider>);
    expect(wrapper.find(FavoriteTracksView)).toMatchSnapshot();
    expect(wrapper.exists(EmptyState)).toBe(true);
  });

  it('Should display given tracks', () => {
    const mockedTracks = [
      {
        artist: { name: 'ARTIST1' },
        name: 'TRACK1'
      },
      {
        artist: { name: 'ARTIST2' },
        name: 'TRACK2'
      },
      {
        artist: { name: 'ARTIST3' },
        name: 'TRACK3'
      }
    ];
    const wrapper = mount(<Provider store={mockStore()}><FavoriteTracksView tracks={mockedTracks} /></Provider>);
    const renderedTracks = wrapper.find('tbody').children().map(item => item.prop('track'));
    expect(wrapper.find(FavoriteTracksView)).toMatchSnapshot();
    expect(renderedTracks).toEqual(mockedTracks);
  });
});
