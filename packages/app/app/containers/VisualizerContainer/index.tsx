import React from 'react';

import styles from './styles.scss';

const VisualizerContainer: React.FC = () => {

  // The id is a hack to allow the visualizer to render in a portal in the correct place
  return <div
    id='visualizer_node'
    className={styles.visualizer_container}
  />;
};

export default VisualizerContainer;
