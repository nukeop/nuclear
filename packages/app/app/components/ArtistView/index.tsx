import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import AlbumList from '../AlbumList';
import ArtistTags from './ArtistTags';
import SimilarArtists from './SimilarArtists';
import PopularTracks from './PopularTracks';
import { Artist } from '@nuclear/core';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

type ArtistViewProps = {
  artist: Artist & {
    loading?: boolean;
  };
  isFavorite: boolean;
  addTrackToQueue: (item: any) => Promise<void>;
  artistInfoSearchByName: (artistName: any) => Promise<void>;
  albumInfoSearch: (albumId: any, releaseType: any, release: any) => Promise<void>;
  removeFavoriteArtist: React.MouseEventHandler;
  addFavoriteArtist: React.MouseEventHandler;
}

const ArtistView: React.FC<ArtistViewProps> = ({
  artist,
  isFavorite,
  addTrackToQueue,
  artistInfoSearchByName,
  albumInfoSearch,
  removeFavoriteArtist,
  addFavoriteArtist
}) => {
  const { t }= useTranslation('artist');
  const history = useHistory();
  
  const isLoading = () => artist.loading || false;
  
  const isOnTour = () => artist.onTour || false;

  function renderArtistHeader() {
    return (
      <div className={styles.artist_header_overlay}>
        <div className={styles.artist_header_container}>
          {
            artist.images &&
            <div
              className={styles.artist_avatar}
              style={{
                background: `url('${_.get(artist, 'images[1]', artPlaceholder)
                }')`,
                backgroundRepeat: 'noRepeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />
          }

          <div className={styles.artist_name_container}>
            <div className={styles.artist_name_line}>
              <h1>{artist.name}</h1>
              {
                isOnTour() &&
                <span
                  className={styles.on_tour}
                >
                  { t('tour') }
                </span>
              }

              <a
                href='#'
                className={styles.artist_favorites_button_wrap}
                data-testid='add-remove-favorite'
                onClick={
                  isFavorite
                    ? removeFavoriteArtist
                    : addFavoriteArtist
                }
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart outline'}
                  size='big'
                />
              </a>
            </div>

            <ArtistTags
              tags={artist.tags}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderPopularTracks() {
    return (
      !isLoading() &&
      artist.topTracks && (
        <PopularTracks
          tracks={artist.topTracks}
          artist={{name: artist.name}}
          addToQueue={addTrackToQueue}
        />
      )
    );
  }

  function renderSimilarArtists() {
    return (
      !isLoading() &&
      <SimilarArtists
        artists={_.get(artist, 'similar', [])}
        artistInfoSearchByName={artistInfoSearchByName}
      />
    );
  }

  function renderHeaderBanner() {
    return (
      <div
        style={{
          background: `url('${_.get(artist, 'coverImage', artPlaceholder)
          }')`,
          backgroundRepeat: 'noRepeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className={styles.artist_header}
      >
        {renderArtistHeader()}
      </div>
    );
  }

  return (
    <div className={styles.artist_view_container}>
      <Dimmer.Dimmable className={cx({ [styles.loading]: isLoading() })}>
        <Dimmer active={isLoading()}>
          <Loader />
        </Dimmer>

        {!isLoading() && (
          <>
            <div
              className={styles.artist}
            >
              {renderHeaderBanner()}
            </div>
            <hr />
          </>
        )}

        <div className={
          cx(
            styles.artist_related_container,
            { [styles.loading]: isLoading() }
          )
        }>
          {renderPopularTracks()}

          {renderSimilarArtists()}
        </div>
        <hr />
        <AlbumList
          albums={_.get(artist, 'releases', []).sort((a, b) => {
            return b.year - a.year;
          })}
          albumInfoSearch={albumInfoSearch}
          history={history}
          loading={isLoading()}
        />
      </Dimmer.Dimmable>
    </div>
  );
};
export default ArtistView;
