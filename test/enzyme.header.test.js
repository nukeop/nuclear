import React from 'react';
import { shallow } from 'enzyme';

import Header from '../app/components/Header';

describe('<Header />', () => {
  it('renders a header with no children', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement(
      <div className='header_container' />
    ));
  });

  it('renders a header with children', () => {
    const wrapper = shallow(<Header>test</Header>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement(
      <div className='header_container' />
    ));
  });
});
