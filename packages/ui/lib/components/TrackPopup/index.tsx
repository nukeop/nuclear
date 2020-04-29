import React from 'react';

import ContextPopup from '../ContextPopup';
import PopupButton from '../PopupButton';
import { Popup } from 'semantic-ui-react';

const TrackPopup: React.FC<{
  trigger: React.ReactNode;
  artist: string;
  title: string;
  thumb: string;

  withAddToQueue: boolean;
  withPlayNow: boolean;
  withAddToFavorites: boolean;
  withAddToDownloads: boolean;

  onAddToQueue: () => void;
  onPlayNow: () => void;
  onAddToFavorites: () => void;
  onAddToDownloads: () => void;
}> = ({
  trigger,
  artist,
  title,
  thumb,
  withAddToQueue,
  withPlayNow,
  withAddToFavorites,
  withAddToDownloads,
  onAddToQueue,
  onPlayNow,
  onAddToFavorites,
  onAddToDownloads
}) => (
  <ContextPopup
    trigger={trigger}
    artist={artist}
    title={title}
    thumb={thumb}
  >
    {
      withAddToQueue &&
      <PopupButton
        onClick={onAddToQueue}
        ariaLabel='Add track to queue'
        icon='plus'
        label='Add to queue'
      />
    }

    {
      withPlayNow &&
      <PopupButton
        onClick={onPlayNow}
        ariaLabel='Play this track now'
        icon='play'
        label='Play now'
      />
    }

    {
      withAddToFavorites &&
      <PopupButton
        onClick={onAddToFavorites}
        ariaLabel='Add this track to favorites'
        icon='star'
        label='Add to favorites'
      />
    }

    {
      withAddToDownloads &&
      <PopupButton
        onClick={onAddToDownloads}
        ariaLabel='Download this track'
        icon='download'
        label='Download'
      />
    }
  </ContextPopup>
);

export default TrackPopup;
