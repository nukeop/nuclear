import React from 'react';
import styles from './styles.module.scss';

export const AppLayout: React.FC = ({ children }) => {
  return (
    <div className={styles['app-layout']}>
      {children}
    </div>
  );
};
