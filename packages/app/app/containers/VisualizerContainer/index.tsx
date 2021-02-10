import React from 'react';

const VisualizerContainer: React.FC = () => {
  // The id is a hack to allow the visualizer to render in a portal in the correct place
  return <div
    id='visualizer_node'
    style={{height: '100%', width: '100%'}}
  />;
};

export default VisualizerContainer;
