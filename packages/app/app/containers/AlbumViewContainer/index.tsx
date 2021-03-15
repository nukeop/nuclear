import React from 'react';

import AlbumView from '../../components/AlbumView';
import { useAlbumViewProps } from './hooks';


const AlbumViewContainer: React.FC = () => {
  const props = useAlbumViewProps();

  return <AlbumView
    {...props}
  />;
};

export default AlbumViewContainer;
