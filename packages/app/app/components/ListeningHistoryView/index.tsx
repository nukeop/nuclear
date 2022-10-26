import { TrackTableProps } from '@nuclear/ui/lib/components/TrackTable';
import React from 'react';
import TrackTableContainer from '../../containers/TrackTableContainer';

export type ListeningHistoryView = {
  tracks: TrackTableProps['tracks'];
}

export const ListeningHistoryView: React.FC<ListeningHistoryView> = ({
  tracks
}) => {
  return <div>
    <TrackTableContainer 
      tracks={tracks} 
      displayDeleteButton={false}
      displayThumbnail={false}
      displayAlbum={false}
    />
  </div>;
};
