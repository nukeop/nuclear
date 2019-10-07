import React from 'react';
import { Icon, Message } from 'semantic-ui-react';

import styles from './styles.scss';

const Warning = () => {
  return (
    <Message warning className={styles.plugins_warning}>
      <Message.Header>
        <Icon name='warning sign' />
        Danger zone!
      </Message.Header>
      <p>
        Plugins work by running code on your computer. Load plugins only from sources you trust!
      </p>
    </Message>
  );
};

export default Warning;
