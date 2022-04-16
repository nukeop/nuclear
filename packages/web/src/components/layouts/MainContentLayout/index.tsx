import React from 'react';
import styles from './styles.module.scss';

export const MainContentLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.main_content_layout}>
      {children}
    </div>
  );
};
