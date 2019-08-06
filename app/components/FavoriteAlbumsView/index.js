import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import AlbumList from '../AlbumList';
import Card from '../Card';
import Header from '../Header';

import styles from './styles.scss';

const EmptyState = () => {
  const { t } = useTranslation('favorite-albums');
  return (
    <div className={styles.empty_state}>
      <Icon name='star'/>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

const FavoriteAlbumsView = ({
  albums,
  removeFavoriteAlbum,
  albumInfoSearch,
  history
}) => {
  const { t } = useTranslation('favorite-albums');

  return (
    <div className={styles.favorite_albums_view}>
      {
        _.isEmpty(albums) &&
          <EmptyState />
      }
      {
        !_.isEmpty(albums) &&
          <>
            <Header>
              {t('header')}
            </Header>
            <Segment className={styles.favorite_albums_segment}>
              <AlbumList
                albums={albums}
                albumInfoSearch={albumInfoSearch}
                history={history}
              />
            </Segment>
          </>
      }
    </div>
  );
};

FavoriteAlbumsView.propTypes = {
  albums: PropTypes.array,
  removeFavoriteAlbum: PropTypes.func,
  albumInfoSearch: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

FavoriteAlbumsView.defaultProps = {
  albums: [],
  removeFavoriteAlbum: () => {},
  albumInfoSearch: () => {},
  history: {}
};

export default withRouter(FavoriteAlbumsView);
