import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import styles from './styles.scss';

class NavButtons extends React.Component {

  constructor(props) {
    super(props);
    this.enableBackButton = this.enableBackButton.bind(this);
    this.enableForwardButton = this.enableForwardButton.bind(this);
  }

  enableBackButton(currentHistoryIndex) {
    if (currentHistoryIndex == 1) {
      return false;
    } else {
      return true;
    }
  }

  enableForwardButton(currentHistoryIndex, historyLength) {
    if(currentHistoryIndex == (historyLength - 1)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    let { back, forward, historyLength, historyCurrentIndex} = this.props;

    return (
      <div className={styles.nav_buttons}>
        <a href='#' onClick={(this.enableBackButton(historyLength) && back)} 
          className={cx({'disable': !this.enableBackButton(historyLength)})}>
            <FontAwesome name='chevron-left'/>
        </a>
        <a href='#' onClick={(this.enableForwardButton(historyCurrentIndex, historyLength) && forward)} 
          className={cx({'disable': !this.enableForwardButton(historyCurrentIndex, historyLength)})}>
            <FontAwesome name="chevron-right"/>
        </a>
      </div>
    );
  };
}

NavButtons.propTypes = {
  back: PropTypes.func,
  forward: PropTypes.func
};

NavButtons.defaultProps = {
  back: () => {},
  forward: () => {}
};

export default NavButtons;
