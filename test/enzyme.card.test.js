import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import spies from 'chai-spies';
import Img from 'react-image-smooth-loading';

import Card from '../app/components/Card';

chai.use(spies);
const { expect } = chai;

describe('<Card />', () => {
  it('Should render given image', () => {
    const wrapper = shallow(<Card image='IMG' />);
    expect(wrapper.find(Img).prop('src')).to.equals('IMG');
  });

  it('Check onClick event', () => {
    const spy = chai.spy();
    const wrapper = shallow(<Card onClick={spy} />);

    wrapper.find('div[onClick]').simulate('click');
    expect(spy).to.have.been.called;
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
