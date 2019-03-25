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
    return currentHistoryIndex > 1;
  }

  enableForwardButton(currentHistoryIndex, historyLength) {
    return currentHistoryIndex < (historyLength - 1);
  }

  render() {
    let { back, forward, historyLength, historyCurrentIndex} = this.props;

    return (
      <div className={styles.nav_buttons}>
        <a href='#' onClick={this.enableBackButton(historyCurrentIndex) ? back : undefined} 
          className={cx({'disable': !this.enableBackButton(historyCurrentIndex)})}>
          <FontAwesome name='chevron-left'/>
        </a>
        <a href='#' onClick={this.enableForwardButton(historyCurrentIndex, historyLength) ? forward : undefined} 
          className={cx({'disable': !this.enableForwardButton(historyCurrentIndex, historyLength)})}>
          <FontAwesome name='chevron-right'/>
        </a>
      </div>
    );
  }
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
