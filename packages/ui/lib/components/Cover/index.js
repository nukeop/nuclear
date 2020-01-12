import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import artPlaceholder from '../../../resources/media/art_placeholder.png';

import common from '../../common.scss';
import styles from './styles.scss';

const Cover = ({ cover }) => (
  <div className={cx(
    common.nuclear,
    styles.cover_container
  )}>
    <img src={cover} />
  </div>
);

Cover.propTypes = {
  cover: PropTypes.string
};

Cover.defaultProps = {
  cover: artPlaceholder
};

export default Cover;
