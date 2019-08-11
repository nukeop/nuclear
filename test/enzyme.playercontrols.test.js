import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow, mount } from 'enzyme';
import { describe, it } from 'mocha';
import FontAwesome from 'react-fontawesome';

import PlayerControls from '../app/components/PlayerControls'
import PlayPauseButton from '../app/components/PlayerControls/PlayPauseButton';
import PlayerButton from '../app/components/PlayerControls/PlayerButton';

chai.use(spies);
const { expect } = chai;

describe('Rendering <PlayerControls /> and its children', () => {
  it('Should render the PlayPauseButton and two PlayerButton ', () => {
    const wrapper = shallow(<PlayerControls />);
    expect(wrapper.containsMatchingElement(<PlayPauseButton />)).to.equal(true);
    expect(wrapper.find(PlayerButton)).to.have.lengthOf(2);
    expect(wrapper.find(PlayerButton).first().props().icon).to.equal('step-backward');
    expect(wrapper.find(PlayerButton).last().props().icon).to.equal('step-forward');
  })
});

describe('Back button onClick', () => {
  it('has an onclick event that gets triggered', () => {
    const wrapper = shallow(<PlayerControls back={spy} />);
    const spy = chai.spy();
    wrapper.find(PlayerButton).first().simulate('click');
    expect(spy).to.have.been.called;
  })
})

describe('Forward button onClick', () => {
  it('has an onclick event that gets triggered', () => {
    const wrapper = shallow(<PlayerControls forward={spy} />);
    const spy = chai.spy();
    wrapper.find(PlayerButton).last().simulate('click');
    expect(spy).to.have.been.called;
  })
})

describe('<PlayPauseButton/> loading', () => {
  it('Loading indicator showing', () => {
    const wrapper = mount(<PlayPauseButton loading={true} playing={false} onClick={undefined} />)
    expect(wrapper.find(FontAwesome).prop('name')).to.equal('spinner')
  })
})

describe('<PlayPauseButton/> playing', () => {
  it('Shows pause button', () => {
    const wrapper = mount(<PlayPauseButton loading={false} playing={true} onClick={undefined} />)
    expect(wrapper.find(FontAwesome).prop('name')).to.equal('pause')
  })
})

describe('<PlayPauseButton/> ready to play', () => {
  it('Shows play button', () => {
    const wrapper = mount(<PlayPauseButton loading={false} playing={false} onClick={undefined} />)
    expect(wrapper.find(FontAwesome).prop('name')).to.equal('play')
  })
})

describe('<PlayPauseButton/> onClick', () => {
  it('Shows play button', () => {
    const spy = chai.spy();
    const wrapper = mount(<PlayPauseButton loading={false} playing={false} onClick={spy} />);
    wrapper.find('a').simulate('click');
    expect(spy).to.have.been.called;
  })
})
