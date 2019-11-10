import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Card from '../Card';
import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

const getThumbnail = album => {
  return _.get(album, 'images[0].uri', _.get(album, 'thumb'));
};

const AlbumGrid = ({
  albums,
  onAlbumClick,
  loading,
  withArtistNames
}) => (
  <div className={cx(
    common.nuclear,
    styles.album_grid,
    {[styles.loading]: loading}
  )} >
    {
      !_.isEmpty(albums) && albums.map((album, i) => (
        <Card
          key={i}
          header={album.title}
          content={withArtistNames && _.get(album, 'artist.name')}
          image={getThumbnail(album)}
          onClick={() => onAlbumClick(album)}
        />
      ))
    }
    { loading && <Loader /> }
  </div>
);

AlbumGrid.propTypes = {
  albums: PropTypes.array,
  onAlbumClick: PropTypes.func,
  loading: PropTypes.bool,
  withArtistNames: PropTypes.bool
};

export default AlbumGrid;
