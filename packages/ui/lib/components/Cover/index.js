import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

const Cover = props => {
  return (
    <div className={cx(
      common.nuclear,
      styles.cover_container
    )}>
      <img src={props.cover} />
    </div>
  );
};

Cover.propTypes = {
  cover: PropTypes.string.isRequired
};

export default Cover;
