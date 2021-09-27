import React from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

type LoaderProps = {
  type: string;
}

const Loader: React.FC<LoaderProps> = ({type}) => {
  return (
    <span className={cx(
      common.nuclear,
      type,
      styles.loader
    )}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
};

Loader.defaultProps = {
  type: 'default'
};

export default Loader;
