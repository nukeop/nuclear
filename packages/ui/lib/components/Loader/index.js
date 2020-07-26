import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

const Loader = props => {

  console.log({common, styles})
  return (
    <span className={cx(
      common.nuclear,
      props.type,
      styles.loader
    )}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
};

Loader.propTypes = {
  type: PropTypes.string
};

Loader.defaultProps = {
  type: 'default'
};

export default Loader;
