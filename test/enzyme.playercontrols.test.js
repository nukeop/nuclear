import React from 'react';
import { shallow, mount } from 'enzyme';
import FontAwesome from 'react-fontawesome';

import PlayerControls from '../app/components/PlayerControls'
import PlayPauseButton from '../app/components/PlayerControls/PlayPauseButton';
import PlayerButton from '../app/components/PlayerControls/PlayerButton';


describe('Rendering <PlayerControls /> and its children', () => {
  it('Should render the PlayPauseButton and two PlayerButton ', () => {
    const wrapper = shallow(<PlayerControls />);
    expect(wrapper.containsMatchingElement(<PlayPauseButton />)).toBe(true);
    expect(wrapper.find(PlayerButton)).toHaveLength(2);
    expect(wrapper.find(PlayerButton).first().props().icon).toBe('step-backward');
    expect(wrapper.find(PlayerButton).last().props().icon).toBe('step-forward');
  });
});

describe('Back button onClick', () => {
  it('has an onclick event that gets triggered', () => {
    const spy = jest.fn();
    const wrapper = shallow(<PlayerControls back={spy} />);
    wrapper.find(PlayerButton).first().simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});

describe('Forward button onClick', () => {
  it('has an onclick event that gets triggered', () => {
    const spy = jest.fn();
    const wrapper = shallow(<PlayerControls forward={spy} />);
    wrapper.find(PlayerButton).last().simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});

describe('<PlayPauseButton/> loading', () => {
  it('Loading indicator showing', () => {
    const wrapper = mount(<PlayPauseButton loading={true} playing={false} onClick={undefined} />);
    expect(wrapper.find(FontAwesome).prop('name')).toBe('spinner');
  });
});

describe('<PlayPauseButton/> playing', () => {
  it('Shows pause button', () => {
    const wrapper = mount(<PlayPauseButton loading={false} playing={true} onClick={undefined} />);
    expect(wrapper.find(FontAwesome).prop('name')).toBe('pause');
  });
});

describe('<PlayPauseButton/> ready to play', () => {
  it('Shows play button', () => {
    const wrapper = mount(<PlayPauseButton loading={false} playing={false} onClick={undefined} />);
    expect(wrapper.find(FontAwesome).prop('name')).toEqual('play');
  });
});

describe('<PlayPauseButton/> onClick', () => {
  it('Shows play button', () => {
    const spy = jest.fn();
    const wrapper = mount(<PlayPauseButton loading={false} playing={false} onClick={spy} />);
    wrapper.find('a').simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
