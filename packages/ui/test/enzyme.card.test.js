import React from 'react';
import Img from 'react-image-smooth-loading';
import test from 'ava';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './helpers/setup';
import {Card} from '..';

configure({ adapter: new Adapter() });
chai.use(spies);
const { expect } = chai;

test('Should render given image', t => {
  const wrapper = shallow(<Card image='IMG' />);
  t.is(wrapper.find(Img).prop('src'), 'IMG');
});

test('Check onClick event', t => {
  const spy = chai.spy();
  const wrapper = shallow(<Card onClick={spy} />);

  wrapper.find('div[onClick]').simulate('click');
  expect(spy).to.have.been.called();
  t.pass();
});

test('Should display given header', t => {
  const wrapper = shallow(<Card header='HEADER' />);
  t.is(wrapper.find('h4').text(), 'HEADER');
});

test('Should display given content', t => {
  const wrapper = shallow(<Card content='TEXT' />);
  t.is(wrapper.find('p').text(), 'TEXT');
});
