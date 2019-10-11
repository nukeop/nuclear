import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { describe, it, before } from 'mocha';
import { Modal } from 'semantic-ui-react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import HelpButton from '../app/components/HelpButton';
import HelpModal from '../app/components/HelpModal';

describe('<HelpModal />', () => {
  before(() => {
    return i18n.use(initReactI18next).init({ lng: 'en' });
  });

  it('Test handleOpen', () => {
    const wrapper = mount(<HelpModal />);

    wrapper.find(HelpButton).simulate('click');
    expect(wrapper.find(Modal).prop('open')).to.be.true;
  });

  it('Test handleClose', () => {
    const wrapper = mount(<HelpModal />);

    wrapper.find(Modal).prop('onClose')();
    expect(wrapper.find(Modal).prop('open')).to.be.false;
  });

  it('Has 3 Icons', () => {
    const wrapper = mount(<HelpModal open={true}/>);
    const modalChildren = wrapper.find(Modal).prop('children');
    const lastModalContent = modalChildren[modalChildren.length -1].props.children.props.children

    expect(lastModalContent.length).to.equal(3)
  })
});
