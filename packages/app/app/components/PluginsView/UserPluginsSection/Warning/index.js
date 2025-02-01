import React from 'react';
import { Icon, Message } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

import styles from './styles.scss';

const Warning = ({t}) => {
  return (
    <Message warning className={styles.plugins_warning}>
      <Message.Header>
        <Icon name='warning sign' />
        {t('user-plugins-warning-title')}
      </Message.Header>
      <p>
        {t('user-plugins-warning-desc')}
      </p>
    </Message>
  );
};

export default withTranslation('plugins')(Warning);
