import React from 'react';

const Spacer = ({ style }) => (
  <div style={Object.assign({}, { flex: '1 1 auto' }, style)} />
);

export default Spacer;
