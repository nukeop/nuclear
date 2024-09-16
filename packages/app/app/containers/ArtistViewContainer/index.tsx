import React from 'react';

import ArtistView from '../../components/ArtistView';
import { useArtistViewProps } from './hooks';

const ArtistViewContainer: React.FC = () => {
  const props = useArtistViewProps();
  return <ArtistView
    {...props}
  />;
};

export default ArtistViewContainer;
