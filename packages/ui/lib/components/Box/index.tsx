import React from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

export type BoxProps = {
    className?: string;
    shadow?: boolean;
}

const Box: React.FC<BoxProps> = ({
  className,
  children,
  shadow=false
}) => <div className={cx(
  common.nuclear, 
  styles.box,
  className,
  { [styles.shadow]: shadow }
)}>
  {children}
</div>;

export default Box;
