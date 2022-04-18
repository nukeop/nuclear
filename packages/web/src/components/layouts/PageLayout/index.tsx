import React from 'react';

import styles from './styles.module.scss';

export const PageLayout: React.FC = ({children}) => <div className={styles['page-layout']}>
  {children}
</div>;
