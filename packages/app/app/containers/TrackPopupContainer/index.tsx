import React from 'react';

import { TrackPopup } from '@nuclear/ui';
import { ContextPopupProps } from '@nuclear/ui/lib/types';
import { useTrackPopupProps } from './hooks';
import { Track } from '@nuclear/core';

export type TrackPopupContainerProps = {
  track: Track;
  trigger: ContextPopupProps['trigger'];
  artist?: ContextPopupProps['artist'];
  title: ContextPopupProps['title'];
  thumb?: ContextPopupProps['thumb'];

  withAddToQueue?: boolean;
  withPlayNext?: boolean;
  withPlayNow?: boolean;
  withAddToFavorites?: boolean;
  withAddToPlaylist?: boolean;
  withAddToDownloads?: boolean;
};

const TrackPopupContainer: React.FC<TrackPopupContainerProps> = ({
  track=null,
  trigger=null,
  artist='',
  title='',
  thumb=null,
  withAddToQueue=true,
  withPlayNext=true,
  withPlayNow=true,
  withAddToFavorites=true,
  withAddToPlaylist=true,
  withAddToDownloads=true
}) => {
  const props = useTrackPopupProps(track, thumb);

  return <TrackPopup
    trigger={trigger}
    artist={artist}
    title={title}
    thumb={thumb}

    withAddToQueue={withAddToQueue}
    withPlayNext={withPlayNext}
    withPlayNow={withPlayNow}
    withAddToFavorites={withAddToFavorites}
    withAddToPlaylist={withAddToPlaylist}
    withAddToDownloads={withAddToDownloads}

    {...props}
  />;
};

export default TrackPopupContainer;
