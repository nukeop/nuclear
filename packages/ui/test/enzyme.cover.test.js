import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

require('./helpers/setup');
let {Cover} = require('../dist/bundle');

configure({ adapter: new Adapter() });

test('shallow', (t) => {
  const wrapper = shallow(<Cover cover='https://i.imgur.com/4euOws2.jpg'/>);
  t.is(wrapper.containsMatchingElement(
    <div className='nuclear cover_container'>
      <img src="https://i.imgur.com/4euOws2.jpg" />
    </div>
  ), true);
});
