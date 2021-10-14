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

  strings?: TrackPopupStrings;

  withAddToQueue?: boolean;
  withPlayNow?: boolean;
  withPlayNext?: boolean;
  withAddToFavorites?: boolean;
  withAddToPlaylist?: boolean;
  withAddToDownloads?: boolean;

  onAddToQueue?: () => void;
  onPlayNext?: () => void;
  onPlayNow?: () => void;
  onAddToFavorites?: () => void;
  onAddToPlaylist?: ({ name: string }) => void;
  onAddToDownloads?: () => void;
};

export type TrackPopupStrings = {
  textAddToQueue: string;
  textPlayNow: string;
  textPlayNext: string;
  textAddToFavorites: string;
  textAddToPlaylist: string;
  textAddToDownloads: string;
}

const TrackPopup: React.FC<TrackPopupProps> = ({
  trigger,
  artist,
  title,
  thumb,
  playlists,

  withAddToQueue=true,
  withPlayNow=true,
  withPlayNext=true,
  withAddToFavorites=true,
  withAddToPlaylist=true,
  withAddToDownloads=true,
  strings={
    textAddToQueue: 'Add to queue',
    textPlayNow: 'Play now',
    textPlayNext: 'Play next',
    textAddToFavorites: 'Add to favorites',
    textAddToPlaylist: 'Add to playlist',
    textAddToDownloads: 'Download'
  },
  onAddToQueue,
  onPlayNext,
  onPlayNow,
  onAddToFavorites,
  onAddToPlaylist,
  onAddToDownloads
}) => 
  <ContextPopup
    trigger={trigger}
    artist={artist}
    title={title}
    thumb={thumb}
  >
    {withAddToQueue && (
      <PopupButton
        data-testid='track-popup-add-queue'
        onClick={onAddToQueue}
        ariaLabel='Add track to queue'
        icon='plus'
        label={strings.textAddToQueue}
      />
    )}

    {withPlayNext && (
      <PopupButton
        onClick={onPlayNext}
        ariaLabel='Add track to play next'
        icon='play'
        label={strings.textPlayNext}
      />
    )}

    {withPlayNow && (
      <PopupButton
        data-testid='track-popup-play-now'
        onClick={onPlayNow}
        ariaLabel='Play this track now'
        icon='play'
        label={strings.textPlayNow}
      />
    )}

    {withAddToFavorites && (
      <PopupButton
        onClick={onAddToFavorites}
        ariaLabel='Add this track to favorites'
        icon='heart'
        label={strings.textAddToFavorites}
      />
    )}

    {withAddToPlaylist && Boolean(playlists) && (
      <PopupDropdown text={strings.textAddToPlaylist}>
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
    )}

    {withAddToDownloads && (
      <PopupButton
        onClick={onAddToDownloads}
        ariaLabel='Download this track'
        icon='download'
        label={strings.textAddToDownloads}
      />
    )}
  </ContextPopup>;

export default TrackPopup;
