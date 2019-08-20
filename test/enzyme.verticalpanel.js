import React from 'react';
import { shallow } from 'enzyme';

import VerticalPanel from '../app/components/VerticalPanel';

describe('<VerticalPanel />', () => {
  it('renders with correct className', () => {
    const className = 'wrapper';
    const wrapper = shallow(<VerticalPanel className={className} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.closest('div').hasClass(className)).toBe(true);
  });

  it('renders with no children', () => {
    const wrapper = shallow(<VerticalPanel />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(0);
  });

  it('renders with children', () => {
    const wrapper = shallow(
      <VerticalPanel>
        <div>First</div>
        <div>Second</div>
      </VerticalPanel>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(2);
  });
});
