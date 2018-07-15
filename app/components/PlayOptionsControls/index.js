import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import settingsConst from '../../constants/settings';

import styles from './styles.scss';

const PlayOptionsControls = props => {
  return (
    <div className="play_options_controls">
      <div className={classnames("icon", {active: props.settings.loopAfterQueueEnd})}
        onClick={() => props.toggleOption(
          _.find(settingsConst, { name: 'loopAfterQueueEnd' }),
          props.settings
          )
        }
      >
        <FontAwesome name="repeat" />
      </div>
      <div className={classnames("icon", {active: props.settings.shuffleQueue})}
        onClick={() => props.toggleOption(
          _.find(settingsConst, { name: 'shuffleQueue' }),
          props.settings
          )
        }
      >
        <FontAwesome name="random" />
      </div>
    </div>
  );
}

PlayOptionsControls.propTypes = {

};

PlayOptionsControls.defaultProps = {

};

export default PlayOptionsControls;
