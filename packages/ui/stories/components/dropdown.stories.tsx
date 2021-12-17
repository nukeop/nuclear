import React from 'react';
import { Dropdown } from '../..';

export default {
  title: 'Components/Dropdown'
};

export const Search = () => <Dropdown
  search
  selection
  options={[{
    text: 'abc',
    value: 'abc'
  }, {
    text: 'qwe',
    value: 'qwe'
  }, {
    text: 'zxc',
    value: 'zxc'
  }]}
  defaultValue='default'
/>;
