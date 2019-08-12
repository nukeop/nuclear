import React from 'react';
import { shallow } from 'enzyme';

import { NavButtons } from '../app/components/NavButtons';

describe('<NavButtons />', () => {
  let history;

  beforeEach(() => {
    history = {
      goBack: jest.fn(),
      goForward: jest.fn()
    };
  });

  it('Test back button', () => {
    history.index = 2;
    const wrapper = shallow(<NavButtons history={history} />);

    wrapper.at(0).childAt(0).simulate('click');
    expect(history.goBack).toHaveBeenCalled();
  });

  it('Test forward button', () => {
    history.index = 2;
    history.length = 4;
    const wrapper = shallow(<NavButtons history={history} />);

    wrapper.at(0).childAt(1).simulate('click');
    expect(history.goForward).toHaveBeenCalled();
  });

  it('Back button should be disabled when there is no previous page', () => {
    history.index = 1;
    const wrapper = shallow(<NavButtons history={history} />);

    expect(wrapper.at(0).childAt(0).hasClass('disable')).toBe(true);
  });

  it('Forward button should be disabled when there is no entry in history stack after current page', () => {
    history.index = 3;
    history.length = 4;
    const wrapper = shallow(<NavButtons history={history} />);

    expect(wrapper.at(0).childAt(1).hasClass('disable')).toBe(true);
  });
});
