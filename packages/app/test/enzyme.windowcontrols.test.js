import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';

import FontAwesome from 'react-fontawesome';

import WindowButton from '../app/components/WindowControls/WindowButton';
import WindowControls from '../app/components/WindowControls';

describe('<WindowControls />', () => {
  it('renders with window buttons', () => {
    const wrapper = shallow(<WindowControls />);
    expect(wrapper.containsMatchingElement(<WindowButton />)).to.equal(true);
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

    wrapper.simulate('click');
    expect(testVal).to.equal('clicked');
  });

  it('displays correct icon', () => {
    const wrapper = shallow(
      <WindowButton color={color} icon={icon} onClick={() => {}} />
    );

    expect(
      wrapper
        .find(FontAwesome)
        .at(0)
        .prop('name')
    ).to.equal(icon);
  });
});
