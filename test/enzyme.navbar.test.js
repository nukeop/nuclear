import React from 'react';
import { shallow } from 'enzyme';

import Navbar from '../app/components/Navbar';

describe('<Navbar />', () => {
  it('renders with no children', () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(0);
  });

  it('renders with children', () => {
    const wrapper = shallow(
      <Navbar>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Navbar>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(3);
  });
});
