import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow } from 'enzyme';
import { beforeEach, describe, it } from 'mocha';

import { NavButtons } from '../app/components/NavButtons';

chai.use(spies);
const { expect } = chai;

describe('<NavButtons />', () => {
  let history;

  beforeEach(() => {
    history = {
      goBack: chai.spy(),
      goForward: chai.spy(),
    };
  });

  it('Test back button', () => {
    history.index = 2;
    const wrapper = shallow(<NavButtons history={history} />);

    wrapper.at(0).childAt(0).simulate('click');
    expect(history.goBack).to.have.been.called;
  });

  it('Test forward button', () => {
    history.index = 2;
    history.length = 4;
    const wrapper = shallow(<NavButtons history={history} />);

    wrapper.at(0).childAt(1).simulate('click');
    expect(history.goForward).to.have.been.called;
  });

  it('Back button should be disabled when there is no previous page', () => {
    history.index = 1;
    const wrapper = shallow(<NavButtons history={history} />);

    expect(wrapper.at(0).childAt(0).hasClass('disable')).to.be.true;
  });

  it('Forward button should be disabled when there is no entry in history stack after current page', () => {
    history.index = 3;
    history.length = 4;
    const wrapper = shallow(<NavButtons history={history} />);

    expect(wrapper.at(0).childAt(1).hasClass('disable')).to.be.true;
  });
});
