import React from 'react';
import cx from 'classnames';
import _, { isEmpty, take } from 'lodash';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import AlbumList from '../AlbumList';
import SimilarArtists from './SimilarArtists';
import PopularTracks from './PopularTracks';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { ArtistDetailsState } from '../../reducers/search';
import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';
import { ArtistHeader } from './ArtistHeader';

type ReleaseTypeProps = 'master' | 'release'

type ArtistViewProps = {
  artist: ArtistDetailsState
  isFavorite: boolean;
  addTrackToQueue: (item: any) => Promise<void>;
  artistInfoSearchByName: (artistName: string) => Promise<void>;
  albumInfoSearch: (albumId: string, releaseType: ReleaseTypeProps, release: SearchResultsAlbum) => Promise<void>;
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
                <ArtistHeader 
                  isOnTour={isOnTour()}
                  isFavorite={isFavorite}
                  artist={artist}
                  removeFavoriteArtist={removeFavoriteArtist}
                  addFavoriteArtist={addFavoriteArtist}
                />
              </div>
            </div>
            <hr />
          </>
        )}

        {
          (!isEmpty(artist?.topTracks) || !isEmpty(artist?.similar) || isLoading()) &&
          <>
            <div className={
              cx(
                styles.artist_related_container,
                { [styles.loading]: isLoading() }
              )
            }>
              { 
                !isLoading() && artist.topTracks && 
                  <PopularTracks
                    tracks={artist.topTracks}
                    artist={{name: artist.name}}
                    addToQueue={addTrackToQueue}
                  />
              }
              {
                !isLoading() && !isEmpty(artist.similar) &&
                <SimilarArtists
                  artists={take(artist.similar, 5)}
                  artistInfoSearchByName={artistInfoSearchByName}
                />
              }
            </div>
            <hr />
          </>
        }
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
