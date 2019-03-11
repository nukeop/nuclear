import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

const NavButtons = props => {
  return (
    <div className={styles.nav_buttons}>
      <a href='#' onClick={props.back} >
        <FontAwesome name='chevron-left'/>
      </a>
      <a href='#' onClick={props.forward}>
        <FontAwesome name='chevron-right'/>
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
