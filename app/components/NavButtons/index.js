import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

const NavButtons = props => {

  let enableBackButton = true;
  let enableForwardButton = true;

  if (props.historyCurrentIndex == 1) {
    enableBackButton = false;
  }

  if (props.historyCurrentIndex == (props.historyLength - 1)) {
    enableForwardButton = false;
  }

  return (
    <div className={styles.nav_buttons}>
      <a href='#' onClick={(enableBackButton ? props.back : null)} className={(enableBackButton ? null : 'disable' )}>
        {enableBackButton ? <FontAwesome name='chevron-left'/> : <FontAwesome name='chevron-left'/>}
      </a>
      <a href='#' onClick={(enableForwardButton ? props.forward : null)} className={(enableForwardButton ? null : 'disable')}>
        {enableForwardButton ? <FontAwesome name="chevron-right"/> : <FontAwesome name='chevron-right'/>}
      </a>
    </div>
  );
};

NavButtons.propTypes = {
  back: PropTypes.func,
  forward: PropTypes.func
};

NavButtons.defaultProps = {
  back: () => {},
  forward: () => {}
};

export default NavButtons;
