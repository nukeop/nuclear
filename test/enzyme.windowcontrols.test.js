import React from 'react';
import { shallow } from 'enzyme';

import FontAwesome from 'react-fontawesome';

import WindowButton from '../app/components/WindowControls/WindowButton';
import WindowControls from '../app/components/WindowControls';

describe('<WindowControls />', () => {
  it('renders with window buttons', () => {
    const wrapper = shallow(<WindowControls />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement(<WindowButton />)).toBe(true);
  });
});

describe('<WindowButton />', () => {
  const color = '#fff';
  const icon = 'icon';

  it('fires onClick func', () => {
    let testVal = null;
    const onClick = () => {
      testVal = 'clicked';
    };
    const wrapper = shallow(
      <WindowButton color={color} icon={icon} onClick={onClick} />
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.simulate('click');
    expect(testVal).toBe('clicked');
  });

  it('displays correct icon', () => {
    const wrapper = shallow(
      <WindowButton color={color} icon={icon} onClick={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(
      wrapper
        .find(FontAwesome)
        .at(0)
        .prop('name')
    ).toBe(icon);
  });
});
