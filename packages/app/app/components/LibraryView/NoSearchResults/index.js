import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';

import styles from './styles.scss';

export default () => {
  const { t } = useTranslation('library');
  return  (
    <div className={styles.library_no_search_results}>
      <Icon name='file audio outline' />
      <h2>{ t('no-search-results')}</h2>
      <div>{ t('no-search-results-help')}</div>
    </div>
  );
};
