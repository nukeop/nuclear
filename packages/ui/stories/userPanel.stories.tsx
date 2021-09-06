import React from 'react';
import { UserPanel } from '..';

import styles from './styles.scss';

export default {
  title: 'User panel'
};

export const LoggedOut = () => (
  <div className={styles.sidebar}>
    <div className='spacer' />
    <UserPanel
      actionsTooltipContent='Settings'
    />
  </div>
);

export const LoggedIn = () => (
  <div className={styles.sidebar}>
    <div className='spacer' />
    <UserPanel
      actionsTooltipContent='Settings'
      user={{
        displayName: 'Display name',
        username: 'username'
      }}
    />
  </div>
);
