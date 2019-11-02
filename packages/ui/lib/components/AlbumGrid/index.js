import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

const AlbumGrid = () => (
  <div className={cx(
    common.nuclear,
    styles.album_grid
  )} />
);

AlbumGrid.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape({}))
};

export default AlbumGrid;
