import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';

import Navbar from '../app/components/Navbar';

describe('<Navbar />', () => {
  it('renders with no children', () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper.children()).to.have.lengthOf(0);
  });

  it('renders with children', () => {
    const wrapper = shallow(
      <Navbar>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Navbar>
    );
    expect(wrapper.children()).to.have.lengthOf(3);
  });
});
