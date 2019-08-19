import React from 'react';
import { mount } from 'enzyme';
import { Modal } from 'semantic-ui-react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import HelpButton from '../app/components/HelpButton';
import HelpModal from '../app/components/HelpModal';

describe('<HelpModal />', () => {
  beforeAll(async () => {
    await i18n.use(initReactI18next).init({ lng: 'en' });
  });

  it('Test handleOpen', () => {
    const wrapper = mount(<HelpModal />);
    wrapper.find(HelpButton).simulate('click');  
    expect(wrapper.find(HelpButton)).toExist();
    expect(wrapper.find(Modal).prop('open')).toBe(true);
  });

  it('Test handleClose', () => {
    const wrapper = mount(<HelpModal />);

    wrapper.find(Modal).prop('onClose')();
    expect(wrapper.find(Modal).prop('open')).toBe(false);
  });
});
