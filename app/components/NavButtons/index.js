import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

const NavButtons = props => {

  let enableBackButton = true;
  let enableForwardButton = true;

  // Check to see if we are at the dashbashboard of if we cannot go forward anymore to disable buttons
  console.log("Current index: " + props.historyCurrentIndex)
  if (props.historyCurrentIndex == 1) {
    // We need to disable the back button because we can't go back anymore
    enableBackButton = false;
  }

  console.log("historyLength: " + props.historyLength)
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
