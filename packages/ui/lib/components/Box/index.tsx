import React, { forwardRef, PropsWithChildren } from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

export type BoxProps = PropsWithChildren<{
  className?: string;
  shadow?: boolean;
}>;

const Box = forwardRef<HTMLDivElement, BoxProps>(({
  className,
  children,
  shadow=false
}, ref) => <div
  ref={ref}
  className={cx(
    common.nuclear,
    styles.box,
    className,
    { [styles.shadow]: shadow }
  )}
>
  {children}
</div>);

export default Box;
