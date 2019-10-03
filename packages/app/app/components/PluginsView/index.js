import React, { useCallback } from 'react';
import { Dropdown, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import Header from '../Header';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const PluginsView = ({ actions, plugins, defaultMusicSource }) => {
  const selectDefaultMusicSource = useCallback((e, data) => {
    actions.selectDefaultMusicSource(data.value);
  }, [actions]);
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
      <div className={styles.plugin_settings_section}>
        <Header>{t('stream-providers')}</Header>
        <hr />
        <Segment>
          <label>
            {t('placeholder')}
          </label>
          <Dropdown
            selection
            options={dropdownOptions}
            defaultValue={defaultOption.value}
            onChange={selectDefaultMusicSource}
          />
        </Segment>
      </div>

      <div className={styles.plugin_settings_section}>
        <Header>{t('meta-providers')}</Header>
        <hr />
      </div>

      <div className={styles.plugin_settings_section}>
        <Header>{t('lyric-providers')}</Header>
        <hr />
      </div>

      <div className={styles.plugin_settings_section}>
        <Header>{t('user-plugins')}</Header>
        <hr />
      </div>
    </div>
  );
};

export default PluginsView;
