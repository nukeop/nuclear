import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

type SpacerProps = {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}
const Spacer: React.FC<SpacerProps> = ({ className, style }) => (<div
  style={style}
  className={
    cx(
      className,
      styles.spacer
    )
  }
/>);

export default Spacer;
