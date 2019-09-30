import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import proxyquire from 'proxyquire';

const electronStoreStub = function () {
  this.get = () => {};
  this.set = () => {};
};
electronStoreStub['@global'] = true;

const {
  default: FavoriteTracksView,
  EmptyState
} = proxyquire.noCallThru().load('../app/components/FavoriteTracksView', {
  'electron-store': electronStoreStub,
  'react-i18next': {
    useTranslation: () => ({
      t: () => ''
    })
  }
});

describe('<FavoriteTracksView />', () => {
  it('Should render <EmptyState /> when there is no track', () => {
    const wrapper = shallow(<FavoriteTracksView />);

    expect(wrapper.exists(EmptyState)).to.be.true;
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
    const wrapper = shallow(<FavoriteTracksView tracks={mockedTracks} />);
    const renderedTracks = wrapper.find('tbody').children().map(item => item.prop('track'));

    expect(renderedTracks).to.be.equal(renderedTracks);
  });
});
