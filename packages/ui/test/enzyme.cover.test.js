import test from 'ava';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './helpers/setup';
import {Cover} from '..';

configure({ adapter: new Adapter() });

test('shallow', (t) => {
  const wrapper = shallow(<Cover cover='https://i.imgur.com/4euOws2.jpg'/>);
  t.is(wrapper.containsMatchingElement(
    <div>
      <img src='https://i.imgur.com/4euOws2.jpg' />
    </div>
  ), true);
});
