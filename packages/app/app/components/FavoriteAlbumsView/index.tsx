import React from 'react';
import _ from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router';
import { Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import AlbumList from '../AlbumList';
import Header from '../Header';

import styles from './styles.scss';

type FavoriteAlbumsViewProps = {
  albums: Array<any>;
  removeFavoriteAlbum: React.MouseEventHandler;
  albumInfoSearch: React.MouseEventHandler;
  history:RouteComponentProps['history']
}

const EmptyState = () => {
  const { t } = useTranslation('favorite-albums');
  return (
    <div className={styles.empty_state}>
      <Icon.Group>
        <Icon name='star' />
        <Icon corner name='dot circle' />
      </Icon.Group>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

const FavoriteAlbumsView:React.FC<FavoriteAlbumsViewProps & RouteComponentProps > = ({
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
                removeFavoriteAlbum={removeFavoriteAlbum}
              />
            </Segment>
          </>
      }
    </div>
  );
};

// FavoriteAlbumsView.propTypes = {
//   albums: PropTypes.array,
//   removeFavoriteAlbum: PropTypes.func,
//   albumInfoSearch: PropTypes.func,
//   history: PropTypes.shape({
//     push: PropTypes.func
//   })
// };

// FavoriteAlbumsView.defaultProps = {
//   albums: [],
//   removeFavoriteAlbum: () => {},
//   albumInfoSearch: () => {},
//   history: {}
// };

export default withRouter(FavoriteAlbumsView);
