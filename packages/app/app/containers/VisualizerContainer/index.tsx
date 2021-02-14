import React from 'react';
import { Visualizer } from '@nuclear/ui';
import { useLocation } from 'react-router-dom';

export type VisualizerContainerProps = {
  trackName?: string;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  trackName,
  ...rest
}) => {
  const location = useLocation();
  return <Visualizer
    location={location}
    trackName={trackName}
    presetName={'$$$ Royal - Mashup (431)'}
    {...rest}
  />;
};

export default VisualizerContainer;
