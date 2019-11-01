import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';

import VerticalPanel from '../app/components/VerticalPanel';

describe('<VerticalPanel />', () => {
  it('renders with correct className', () => {
    const className = 'wrapper';
    const wrapper = shallow(<VerticalPanel className={className} />);
    expect(wrapper.closest('div').hasClass(className)).to.equal(true);
  });

  it('renders with no children', () => {
    const wrapper = shallow(<VerticalPanel />);
    expect(wrapper.children()).to.have.lengthOf(0);
  });

  it('renders with children', () => {
    const wrapper = shallow(
      <VerticalPanel>
        <div>First</div>
        <div>Second</div>
      </VerticalPanel>
    );
    expect(wrapper.children()).to.have.lengthOf(2);
  });
});
