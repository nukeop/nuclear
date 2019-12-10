import React from 'react';
import test from 'ava';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './helpers/setup';
import {Card} from '..';
import {TrackRow} from '..';
import { Icon } from 'semantic-ui-react';


configure({ adapter: new Adapter() });
chai.use(spies);
const { expect } = chai;

test('Should render given image', t => {
  const wrapper = shallow(<Card image='IMG' />);
  t.is(
    wrapper.find('div>div>div:first-child').prop('style').backgroundImage,
    'url(\'IMG\')'
  );
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

test('Test track number hover shows play icon', t => {

  const data = {
    displayTrackNumber: true,
    index: "album-track-1",
    track: {
      name: "track"
    }
  };



  const wrapper = shallow(<TrackRow />);
  wrapper.setState({ hoveringOnTrackNum: false });
  expect(wrapper.containsAnyMatchingElements(<Icon name={"play"} />)).to.equal(true);
  t.pass();
});
