import React from 'react';
import cx from 'classnames';

import common from '../../common.module.scss';
import styles from './styles.module.scss';

type LoaderProps = {
  type: 'default' | 'circle' | 'small';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  type='default',
  className
}) => {
  return (
    <span className={cx(
      common.nuclear,
      type,
      styles.loader,
      className
    )}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
};

export default Loader;
