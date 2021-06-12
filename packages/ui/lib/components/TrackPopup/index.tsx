/* eslint-disable node/no-missing-import */
import React from 'react';
import _ from 'lodash';
import { Icon, Dropdown } from 'semantic-ui-react';

import ContextPopup, { ContextPopupProps } from '../ContextPopup';
import PopupButton from '../PopupButton';
import PopupDropdown from '../PopupDropdown';

export type TrackPopupProps = {
  trigger: ContextPopupProps['trigger'];
  artist?: ContextPopupProps['artist'];
  title: ContextPopupProps['title'];
  thumb?: ContextPopupProps['thumb'];

  playlists?: Array<{
    name: string;
  }>;

  withAddToQueue?: boolean;
  withPlayNow?: boolean;
  withAddToFavorites?: boolean;
  withAddToPlaylist?: boolean;
  withAddToDownloads?: boolean;

  onAddToQueue?: () => void;
  onPlayNow?: () => void;
  onAddToFavorites?: () => void;
  onAddToPlaylist?: ({name: string}) => void;
  onAddToDownloads?: () => void;
};

const TrackPopup: React.FC<TrackPopupProps> = ({
  trigger,
  artist,
  title,
  thumb,
  playlists,

  withAddToQueue=true,
  withPlayNow=true,
  withAddToFavorites=true,
  withAddToPlaylist=true,
  withAddToDownloads=true,
  onAddToQueue,
  onPlayNow,
  onAddToFavorites,
  onAddToPlaylist,
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
        icon='heart'
        label='Add to favorites'
      />
    }

    {
      withAddToPlaylist && Boolean(playlists) && 
      <PopupDropdown text='Add to playlist'>
        {_.map(playlists, (playlist, i) => (
          <Dropdown.Item
            key={i}
            onClick={() => onAddToPlaylist(playlist)}
          >
            <Icon name='music' />
            {playlist.name}
          </Dropdown.Item>
        ))}
      </PopupDropdown>
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
