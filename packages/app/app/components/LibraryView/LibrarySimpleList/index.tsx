import React from 'react';
import { Track } from '@nuclear/core';

import TrackTableContainer from '../../../containers/TrackTableContainer';

type LibrarySimpleListProps = {
  tracks: Track[];
}

const LibrarySimpleList: React.FC<LibrarySimpleListProps> = ({
  tracks
}) => <TrackTableContainer
  tracks={tracks}
  displayDeleteButton={false}
  displayFavorite={false} 
  displayAddToDownloads={false}
/>;

export default LibrarySimpleList;
