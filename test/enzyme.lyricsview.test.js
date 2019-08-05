import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';

import { LyricsView } from '../app/components/LyricsView';

describe('<LyricsView />', () => {
  const t = () => '';

  it('Test if there is no track selected', () => {
    const spy = sinon.spy(LyricsView.prototype, 'renderNoSelectedTrack');
    const wrapper = shallow(<LyricsView track={null} t={t} />);
    const instance = wrapper.instance();

    expect(spy.calledOnce).to.be.true;
    expect(wrapper.contains(instance.renderNoSelectedTrack())).to.be.true;
  });
});
