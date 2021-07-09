import React from 'react';
import Img from 'react-image';
import _ from 'lodash';
import cx from 'classnames';
import { Dimmer, Icon, Loader } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Loader as NuclearLoader, ContextPopup, PopupButton } from '@nuclear/ui';
import { AlbumDetails } from '@nuclear/core/src/plugins/plugins.types';

import TrackRow from '../TrackRow';
import TrackRowHeading from '../TrackRowHeading/index';
import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

type AlbumViewProps = {
  album?: AlbumDetails & {
    loading?: boolean;
  };
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
                    {album.year}
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
            <table className={styles.album_tracklist}>
              <thead>
                <tr>
                  <th className={cx(styles.center, styles.position)}>
                    <Icon name='hashtag' />
                  </th>
                  <th className={styles.left}>{t('tracks')}</th>
                  <th className={cx(styles.center, styles.duration)}>
                    <Icon name='clock outline' />
                  </th>
                </tr>
              </thead>
              <tbody>
                {album.tracklist.map((track, index) => {
                  return (!track.type || track.type === 'track') ? <TrackRow
                    key={'album-track-row-' + index}
                    track={track}
                    displayTrackNumber
                    displayDuration
                  /> : <TrackRowHeading title={track.title} key={'album-track-heading-' + index} />;
                })}
              </tbody>
            </table>
          </div>
        )
      }
    </Dimmer.Dimmable>
  </div>;
};

export default AlbumView;
