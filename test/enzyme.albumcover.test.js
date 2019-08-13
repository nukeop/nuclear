import React from 'react';
import { shallow } from 'enzyme';

import AlbumCover from '../app/components/AlbumCover';

describe('<AlbumCover />', () => {
  it('renders an album cover', () => {
    const wrapper = shallow(
      <AlbumCover />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement(
      <div className='album_cover_container' />
    ));
  });
});
