import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { LyricsView } from '../app/components/LyricsView';

describe('<LyricsView />', () => {
  const t = () => '';

  it('Test if there is no track selected', () => {
    const wrapper = shallow(<LyricsView track={null} t={t} />);
    const instance = wrapper.instance();

    expect(wrapper.contains(instance.renderNoSelectedTrack())).to.be.true;
  });

  it('Test if there is selected track', () => {
    const track = {
      name: 'NAME',
      artist: 'ARTIST'
    };
    const lyrics = {
      lyricsSearchResults: 'LYRICS_SEARCH_RESULTS',
      type: 'TYPE'
    };
    const wrapper = shallow(<LyricsView t={t} track={track} lyrics={lyrics} />);
    const instance = wrapper.instance();

    expect(wrapper.contains(instance.renderLyricsHeader()));
    expect(wrapper.contains(instance.renderLyrics()));
  });
});
