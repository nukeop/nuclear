import React from 'react';
import { Visualizer } from '@nuclear/ui';
import { useLocation } from 'react-router-dom';

import { useVisualizerProps } from './hooks';

export type VisualizerContainerProps = {
  trackName?: string;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  trackName,
  ...rest
}) => {
  const location = useLocation();
  const visualizerProps = useVisualizerProps();
  return <Visualizer
    location={location}
    trackName={trackName}
    {...visualizerProps}
    {...rest}
  />;
};

export default VisualizerContainer;
