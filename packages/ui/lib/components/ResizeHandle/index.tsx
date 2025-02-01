import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

type ResizeHandleClasses = {
  root: string;
}

type ResizeHandleProps = {
  classes?: Partial<ResizeHandleClasses>;
  vertical?: boolean;
};

const ResizeHandle = React.forwardRef<HTMLDivElement, ResizeHandleProps>(({ classes, vertical, ...rest }, ref) => <div
  className={cx(
    styles.resize_handle, 
    classes?.root,
    {
      [styles.vertical]: vertical
    })
  }
  ref={ref}
  {...rest}
/>);

export default ResizeHandle;
