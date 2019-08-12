import React from 'react';
import { shallow } from 'enzyme';
import Img from 'react-image-smooth-loading';

import Card from '../app/components/Card';


describe('<Card />', () => {
  it('Should render given image', () => {
    const wrapper = shallow(<Card image='IMG' />);
    expect(wrapper.find(Img).prop('src')).toBe('IMG');
  });

  it('Check onClick event', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Card onClick={spy} />);

    wrapper.find('div[onClick]').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('Should display given header', () => {
    const wrapper = shallow(<Card header='HEADER' />);

    expect(wrapper.find('h4').text()).toEqual('HEADER');
  });

  it('Should display given content', () => {
    const wrapper = shallow(<Card content='TEXT' />);

    expect(wrapper.find('p').text()).toBe('TEXT');
  });
});
