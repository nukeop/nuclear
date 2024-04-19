import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';

import styles from './styles.scss';

export default () => {
  const { t } = useTranslation('library');
  return  (
    <div className={styles.library_empty_state}>
      <Icon name='file audio outline' />
      <h2>{ t('empty')}</h2>
      <div>{ t('empty-help')}</div>
    </div>
  );
};
