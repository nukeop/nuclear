import React from 'react';
import { render } from '@testing-library/react';

import WindowControls from '.';

describe('Window controls', () => {
  it('minimizes the program on clicking maximize', () => {
    const { component, props } = mountComponent();
    
    component.getByTestId('minimize-button').click();

    expect(props.onMinClick).toHaveBeenCalled();
  });

  it('maximizes the program on clicking maximize', () => {
    const { component, props } = mountComponent();
    
    component.getByTestId('maximize-button').click();

    expect(props.onMaxClick).toHaveBeenCalled();
  });

  it('closes the program on clicking close', () => {
    const { component, props } = mountComponent();
    
    component.getByTestId('close-button').click();

    expect(props.onCloseClick).toHaveBeenCalled();
  });

  const mountComponent = () => {
    const props = {
      onCloseClick: jest.fn(),
      onMaxClick: jest.fn(),
      onMinClick: jest.fn()
    };
    const component = render(<WindowControls {...props} />);
    return { component, props };
  };
});
