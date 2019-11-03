import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Card from '../Card';
import common from '../../common.scss';
import styles from './styles.scss';

const getThumbnail = album => {
  return _.get(album, 'images[0].uri', _.get(album, 'thumb'));
};

const AlbumGrid = ({ albums, onAlbumClick }) => (
  <div className={cx(
    common.nuclear,
    styles.album_grid
  )} >
    {
      !_.isEmpty(albums) && albums.map((album, i) => (
        <Card
          key={i}
          header={album.title}
          image={getThumbnail(album)}
          onClick={onAlbumClick}
        />
      ))
    }
  </div>
);

AlbumGrid.propTypes = {
  albums: PropTypes.array,
  onAlbumClick: PropTypes.func
};

export default AlbumGrid;
