import React from 'react';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';
import settingsConst from '../../constants/settings';

function renderOptionControl(props, settingName, fontAwesomeName, title) {
  return (
    <div
      className={classnames(styles.icon, {
        active: props.settings[settingName]
      })}
      title={title}
      onClick={() =>
        props.toggleOption(
          _.find(settingsConst, { name: settingName }),
          props.settings
        )
      }
    >
      <FontAwesome name={fontAwesomeName} />
    </div>
  );
}

const PlayOptionsControls = props => {
  const { t } = useTranslation('option-control');
  
  return (
    <div className={styles.play_options_controls}>
      {renderOptionControl(props, 'loopAfterQueueEnd', 'repeat', t('loop'))}
      {renderOptionControl(props, 'shuffleQueue', 'random', t('shuffle'))}
      {renderOptionControl(props, 'autoradio', 'magic', t('autoradio'))}
    </div>
  );
};

PlayOptionsControls.propTypes = {};
PlayOptionsControls.defaultProps = {};

export default PlayOptionsControls;
