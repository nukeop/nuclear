import React from 'react';
import Img from 'react-image';
import _ from 'lodash';
import { Dimmer, Icon, Loader } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Loader as NuclearLoader, ContextPopup, PopupButton } from '@nuclear/ui';
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
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  album,
  isFavorite,
  searchAlbumArtist,
  addAlbumToDownloads,
  addAlbumToQueue,
  playAll,
  removeFavoriteAlbum,
  addFavoriteAlbum
}) => {
  const { t } = useTranslation('album');
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
                      name={isFavorite ? 'star' : 'star outline'}
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
                  </ContextPopup>
                </div>
              </div>
            </div>
            <TrackTableContainer 
              tracks={album.tracklist}
              displayDeleteButton={false}
              displayThumbnail={false}
              displayArtist={false}
              displayAlbum={false}
            />
          </div>
        )
      }
    </Dimmer.Dimmable>
  </div>;
};

export default AlbumView;
