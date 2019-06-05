import React, { useCallback } from 'react';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const PluginsView = ({ actions, plugins, defaultMusicSource }) => {
  const selectDefaultMusicSource = useCallback((e, data) => {
    actions.selectDefaultMusicSource(data.value);
  }, []);
  const { t } = useTranslation('plugins');

  const dropdownOptions = plugins.musicSources.map(s => {
    return {
      text: s.name,
      value: s.sourceName
    };
  });

  let defaultOption = _.find(dropdownOptions, { value: defaultMusicSource });
  defaultOption = defaultOption || dropdownOptions[0];

  return (
    <div className={styles.plugins_view_container}>
      <Header>{t('header')}</Header>
      <div className={styles.plugin_settings}>
        <Header>{t('subtitle')}</Header>

        <span>
          {t('placeholder')}
          <Dropdown
            inline
            options={dropdownOptions}
            defaultValue={defaultOption.value}
            onChange={selectDefaultMusicSource}
          />
        </span>
      </div>
    </div>
  );
};

export default PluginsView;
