import React from 'react';

import { Loader } from '../..';

export default {
  title: 'Components/Loader'
};

export const Default = () => {
  return (
    <div style={{
      background: '#282a36',
      height: '100%',
      width: '100%',
      padding: '1em',
      boxSizing: 'border-box'
    }}>
      <Loader />
    </div>
  );
};

export const Circle = () => {
  return (
    <div style={{
      background: '#282a36',
      height: '100%',
      width: '100%',
      padding: '1em',
      boxSizing: 'border-box'
    }}>
      <Loader type='circle'/>
    </div>
  );
};

export const Small = () => {
  return (
    <div style={{
      background: '#282a36',
      height: '100%',
      width: '100%',
      padding: '1em',
      boxSizing: 'border-box'
    }}>
      <Loader type='small'/>
    </div>
  );
};

export const SmallOverflowingItsBox = () => {
  return (
    <div style={{
      background: '#282a36',
      height: '4em',
      width: '4em',
      padding: '1em',
      boxSizing: 'border-box'
    }}>
      <div
        style={{
          height: '1em',
          width: '1em'
        }}
      >
        <Loader type='small'/>
      </div>
    </div>
  );
};
