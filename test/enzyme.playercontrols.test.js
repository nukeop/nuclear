import 'jsdom-global/register';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render, configure } from 'enzyme';
import { describe, it, before } from 'mocha';
import Adapter from 'enzyme-adapter-react-16';
import FontAwesome from 'react-fontawesome';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import PlayerControls from '../app/components/PlayerControls'
import PlayPauseButton from '../app/components/PlayerControls/PlayPauseButton';
import PlayerButton from '../app/components/PlayerControls/PlayerButton';

configure({ adapter: new Adapter() });

describe('Rendering <PlayerControls /> and its children', () => {
  before(() => {
    return i18n.use(initReactI18next).init({ lng: 'en' });
  });

  it('Should render the PlayPauseButton and two PlayerButton ', () => {
    const wrapper = shallow(<PlayerControls />);
    expect(wrapper.containsMatchingElement(<PlayPauseButton />)).to.equal(true);
    expect(wrapper.find(PlayerButton)).to.have.lengthOf(2);
    expect(wrapper.find(PlayerButton).first().props().icon).to.equal('step-backward');
    expect(wrapper.find(PlayerButton).last().props().icon).to.equal('step-forward');
  })
});

describe('<PlayPauseButton/> loading', () => {
  before(() => {
    return i18n.use(initReactI18next).init({ lng: 'en' });
  });

  it('Loading indicator showing', () => {
    const onClick = () => {
      testVal = 'clicked';
    };
    const wrapper = mount(<PlayPauseButton loading={true} playing={false} onClick={undefined} />)
    expect(wrapper.find(FontAwesome)).to.have.lengthOf(1)
  })
})
