import { useParams } from '@tanstack/react-router';
import { FC } from 'react';

import { ScrollableArea } from '@nuclearplayer/ui';

import { AlbumHeader } from './components/AlbumHeader';
import { AlbumTrackList } from './components/AlbumTrackList';

type AlbumProps = Record<string, never>;

export const Album: FC<AlbumProps> = () => {
  const { providerId, albumId } = useParams({
    from: '/album/$providerId/$albumId',
  });

  return (
    <ScrollableArea className="bg-background" data-testid="album-view">
      <AlbumHeader providerId={providerId} albumId={albumId} />
      <div className="h-full p-6">
        <AlbumTrackList providerId={providerId} albumId={albumId} />
      </div>
    </ScrollableArea>
  );
};
