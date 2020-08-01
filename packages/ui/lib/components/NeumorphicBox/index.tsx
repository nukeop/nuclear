import React from 'react';

import styles from './styles.scss';

const NeumorphicBox: React.FC = ({
  children
}) => <div className={styles.neumorphic_box}>
    {children}
  </div>;

export default NeumorphicBox;