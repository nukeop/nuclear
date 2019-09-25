import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';

import AlbumCover from '../app/components/AlbumCover';

describe('<AlbumCover />', () => {
  it('renders an album cover', () => {
    const wrapper = shallow(
      <AlbumCover />
    );

    expect(wrapper.containsMatchingElement(
      <div className='album_cover_container' />
    ));
  });
});
