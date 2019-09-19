import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Button } from 'semantic-ui-react';

import styles from './styles.scss';

export default ({ enableApi }) => {
  const { t } = useTranslation('library');
  const handleClick = useCallback(() => {
    enableApi('api.enabled', true);
  });

  return  (
    <div className={styles.library_no_api}>
      <h2>
        { t('no-api')}
        <Icon name='frown outline' />
      </h2>
      <div>{ t('no-api-help')}</div>
      <Button onClick={handleClick}>{t('api-enable')}</Button>
    </div>
  );
};
