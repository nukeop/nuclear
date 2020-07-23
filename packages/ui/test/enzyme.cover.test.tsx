import React from 'react';
import { render } from '@testing-library/react'

import { Cover } from '../lib';

it('Cover snapshot', () => {
  const { asFragment } = render(<Cover cover='https://i.imgur.com/4euOws2.jpg' />);
  expect(asFragment()).toMatchSnapshot();
});
