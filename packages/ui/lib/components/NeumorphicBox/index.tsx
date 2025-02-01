import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export type NeumorphicBoxProps = {
  borderRadius?: string;
  small?: boolean;
  pressed?: boolean;
  children?: React.ReactNode;
};

const NeumorphicBox: React.FC<NeumorphicBoxProps> = ({
  children,
  borderRadius,
  small,
  pressed
}) => <div
  className={cx(
    styles.neumorphic_box,
    { [styles.small]: small },
    { [styles.pressed]: pressed }
  )}
  style={{ borderRadius }}
>
  {children}
</div>;

export default NeumorphicBox;
