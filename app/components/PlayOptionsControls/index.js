import React from 'react';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import styles from './styles.scss';
import settingsConst from '../../constants/settings';

function renderOptionControl(props, settingName, fontAwesomeName) {
  return (
    <div
      className={classnames(styles.icon, {
        active: props.settings[settingName]
      })}
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
  return (
    <div className={styles.play_options_controls}>
      {renderOptionControl(props, 'loopAfterQueueEnd', 'repeat')}
      {renderOptionControl(props, 'shuffleQueue', 'random')}
      {renderOptionControl(props, 'autoradio', 'magic')}
    </div>
  );
};

PlayOptionsControls.propTypes = {};
PlayOptionsControls.defaultProps = {};

export default PlayOptionsControls;
