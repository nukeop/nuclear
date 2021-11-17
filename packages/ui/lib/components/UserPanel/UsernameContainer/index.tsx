import React from 'react';
import { Icon } from 'semantic-ui-react';

import styles from './styles.scss';

export type UsernameContainerProps = {
    username?: string;
    displayName?: string;
}

const UsernameContainer: React.FC<UsernameContainerProps> = ({
  username,
  displayName
}) => <span className={styles.username_container}>
  <Icon size='large' name='user circle outline' />

  <div className={styles.names}>
    <span className={styles.displayname}>
      {username ? displayName : 'Logged out'}
    </span>
    {/* <span className={styles.username}>
      {username ?? username}
    </span> */}
  </div>
</span>;

export default UsernameContainer;
