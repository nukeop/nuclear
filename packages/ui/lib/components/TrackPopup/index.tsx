import React, { useState } from 'react';
import _ from 'lodash';

import ContextPopup, { ContextPopupProps } from '../ContextPopup';
import PopupButton from '../PopupButton';
import PopupDropdown from '../PopupDropdown';
import InputDialog from '../InputDialog';
import { PlaylistsDropdown } from './PlaylistsDropdown';

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
  onAddToPlaylist?: ({ name }: { name: string }) => void;
  onCreatePlaylist?: ({ name }: { name: string }) => void;
  onAddToDownloads?: () => void;
};

export type TrackPopupStrings = {
  textAddToQueue: string;
  textPlayNow: string;
  textPlayNext: string;
  textAddToFavorites: string;
  textAddToPlaylist: string;
  textCreatePlaylist: string;
  textAddToDownloads: string;
  createPlaylistDialog: {
    title: string;
    placeholder: string;
    accept: string;
    cancel: string;
  }
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
    textCreatePlaylist: 'Create a new playlist',
    textAddToDownloads: 'Download',
    createPlaylistDialog: {
      title: 'Input playlist name:',
      placeholder: 'Playlist name',
      accept: 'Save',
      cancel: 'Cancel'
    }
  },
  onAddToQueue,
  onPlayNext,
  onPlayNow,
  onAddToFavorites,
  onAddToPlaylist,
  onCreatePlaylist,
  onAddToDownloads
}) => {
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);

  return (
    <>
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
            data-testid='track-popup-play-next'
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
            data-testid='track-popup-add-favorites'
            onClick={onAddToFavorites}
            ariaLabel='Add this track to favorites'
            icon='heart'
            label={strings.textAddToFavorites}
          />
        )}

        {withAddToPlaylist && Boolean(playlists) && (
          <PlaylistsDropdown
            playlists={playlists}
            strings={{
              textAddToPlaylist: strings.textAddToPlaylist,
              textCreatePlaylist: strings.textCreatePlaylist
            }}
            onAddToPlaylist={onAddToPlaylist}
            setIsCreatePlaylistDialogOpen={setIsCreatePlaylistDialogOpen}
          />
        )}

        {withAddToDownloads && (
          <PopupButton
            data-testid='track-popup-download'
            onClick={onAddToDownloads}
            ariaLabel='Download this track'
            icon='download'
            label={strings.textAddToDownloads}
          />
        )}
      </ContextPopup>
      <InputDialog
        isOpen={isCreatePlaylistDialogOpen}
        onClose={() => {
          setIsCreatePlaylistDialogOpen(false);
        }}
        header={<h4>{strings.createPlaylistDialog.title}</h4>}
        placeholder={strings.createPlaylistDialog.placeholder}
        acceptLabel={strings.createPlaylistDialog.accept}
        cancelLabel={strings.createPlaylistDialog.cancel}
        onAccept={(input) => {
          onCreatePlaylist({ name: input });
        }}
        initialString={title}
        testIdPrefix='track-popup-create-playlist-dialog'
      />
    </>
  );
};

export default TrackPopup;
