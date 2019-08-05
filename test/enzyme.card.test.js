import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import Img from 'react-image-smooth-loading';

import Card from '../app/components/Card';

describe('<Card />', () => {
  it('Should render given image', () => {
    const wrapper = shallow(<Card image='IMG' />);
    expect(wrapper.find(Img).prop('src')).to.equals('IMG');
  });

  it('Check onClick event', () => {
    const callback = sinon.spy();
    const wrapper = shallow(<Card onClick={callback} />);

    wrapper.find('div[onClick]').simulate('click');
    expect(callback.called).to.be.true;
  });

  it('Should display given header', () => {
    const wrapper = shallow(<Card header='HEADER' />);

    expect(wrapper.find('h4').text()).to.be.equal('HEADER');
  });

  it('Should display given content', () => {
    const wrapper = shallow(<Card content='TEXT' />);

    expect(wrapper.find('p').text()).to.be.equal('TEXT');
  });
});
