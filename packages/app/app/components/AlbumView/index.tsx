import React, { useState } from 'react';
import Img from 'react-image';
import _ from 'lodash';
import { Dimmer, Icon, Loader, Dropdown } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Loader as NuclearLoader, ContextPopup, PopupButton, PopupDropdown, InputDialog } from '@nuclear/ui';
import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import TrackTableContainer from '../../containers/TrackTableContainer';
import { AlbumDetailsState } from '../../reducers/search';

type AlbumViewProps = {
  album?: AlbumDetailsState 
  isFavorite: boolean;
  searchAlbumArtist: React.MouseEventHandler;
  addAlbumToDownloads: React.MouseEventHandler;
  addAlbumToQueue: React.MouseEventHandler;
  playAll: React.MouseEventHandler;
  removeFavoriteAlbum: React.MouseEventHandler;
  addFavoriteAlbum: React.MouseEventHandler;
  addAlbumToPlaylist: (playlistName: string) => void;
  playlistNames: string[];
  addAlbumToNewPlaylist?: (playlistName: string) => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  album,
  isFavorite,
  searchAlbumArtist,
  addAlbumToDownloads,
  addAlbumToQueue,
  playAll,
  removeFavoriteAlbum,
  addFavoriteAlbum,
  addAlbumToPlaylist,
  playlistNames,
  addAlbumToNewPlaylist
}) => {
  const { t } = useTranslation('album');
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const displayPlaylistCreationDialog = () => setIsCreatePlaylistDialogOpen(true);
  const hidePlaylistCreationDialog = () => setIsCreatePlaylistDialogOpen(false);

  const displayArtistColumn = () => {
    if (!album.artist || !album.tracklist) {
      return false;
    }

    for (const track of album.tracklist) {
      if (!track.artists) {
        return false;
      }

      if (track.artists.length > 1) {
        return true;
      }

      if (album.artist !== track.artists?.[0]) {
        return true;
      }
    }

    return false;
  };

  const release_date: Date = new Date(album.year);
  return <div className={styles.album_view_container}>
    <Dimmer.Dimmable>
      <Dimmer active={album?.loading}>
        <Loader />
      </Dimmer>
      {
        Boolean(album) && !album.loading && (
          <div className={styles.album}>
            <div className={styles.album_info_box}>
              <Img
                src={album.coverImage}
                loader={<NuclearLoader type='small' />}
                unloader={<img src={String(artPlaceholder)} />}
              />
              <div className={styles.album_details}>
                <div className={styles.album_title}>
                  <div className={styles.album_text}>{album.title}</div>
                  <a
                    href='#'
                    className={styles.album_favorites_button_wrap}
                    data-testid='add-remove-favorite'
                    onClick={
                      isFavorite ? removeFavoriteAlbum : addFavoriteAlbum
                    }
                  >
                    <Icon
                      name={isFavorite ? 'heart' : 'heart outline'}
                      size='big'
                    />
                  </a>
                </div>
                <div className={styles.album_artist}>
                  by{' '}
                  <a
                    href='#'
                    onClick={searchAlbumArtist}
                  >
                    {album?.artist}
                  </a>
                </div>
                {
                  !_.isEmpty(album.genres) &&
                  <div className={styles.album_genre}>
                    <label>{t('genre')}</label>
                    {album.genres.join(', ')}
                  </div>
                }
                {
                  album.year &&
                  <div className={styles.album_year}>
                    <label>{t('year')}</label>
                    {release_date.getFullYear()}
                  </div>
                }
                <div className={styles.album_tracks}>
                  <label>{t('tracks')}</label>
                  {album.tracklist.length}
                </div>
                <div className={styles.album_buttons}>
                  <a
                    onClick={playAll}
                    href='#'
                    className={styles.play_button}
                  >
                    <Icon name='play' /> {t('play')}
                  </a>
                  <ContextPopup
                    trigger={
                      <a
                        href='#'
                        className={styles.more_button}
                        data-testid='more-button'
                      >
                        <Icon name='ellipsis horizontal' />
                      </a>
                    }
                    artist={album.artist}
                    title={album.title}
                    thumb={album.coverImage}
                  >
                    <PopupButton
                      onClick={addAlbumToQueue}
                      ariaLabel={t('queue')}
                      icon='plus'
                      label={t('queue')}
                    />
                    <PopupButton
                      onClick={addAlbumToDownloads}
                      ariaLabel={t('download')}
                      icon='download'
                      label={t('download')}
                    />
                    <PopupDropdown
                      text={t('add-to-playlist')}
                      data-testid='add-album-to-playlist'
                    >
                      {
                        playlistNames?.map((playlistName, i) => (
                          <Dropdown.Item
                            key={i}
                            onClick={() => addAlbumToPlaylist(playlistName)}
                          >
                            <Icon name='music'/>
                            {playlistName}
                          </Dropdown.Item>
                        ))
                      }
                      <Dropdown.Item
                        onClick={() => displayPlaylistCreationDialog()}
                        data-testid='playlist-popup-create-playlist'
                      >
                        <Icon name='plus'/>
                        {t('create-playlist')}
                      </Dropdown.Item>
                    </PopupDropdown>
                  </ContextPopup>
                  <InputDialog
                    isOpen={isCreatePlaylistDialogOpen}
                    onClose={() => hidePlaylistCreationDialog()}
                    header={<h4>{t('create-playlist-dialog-title')}</h4>}
                    placeholder={t('create-playlist-dialog-placeholder')}
                    acceptLabel={t('create-playlist-dialog-accept')}
                    cancelLabel={t('create-playlist-dialog-cancel')}
                    onAccept={(input) => {
                      addAlbumToNewPlaylist(input);
                    }}
                    initialString={`${album.artist} - ${album.title}`}
                    testIdPrefix='create-playlist-dialog'
                  />
                </div>
              </div>
            </div>
            <TrackTableContainer 
              tracks={album.tracklist}
              displayDeleteButton={false}
              displayThumbnail={false}
              displayArtist={displayArtistColumn()}
              displayAlbum={false}
            />
          </div>
        )
      }
    </Dimmer.Dimmable>
  </div>;
};

export default AlbumView;
