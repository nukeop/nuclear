import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import styles from './styles.scss';
import {withRouter} from 'react-router';

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
    const history = this.props.history;
    
    return (
      <div className={styles.nav_buttons}>
        <a href='#' onClick={this.enableBackButton(history.index) ? history.goBack : undefined} 
          className={cx({'disable': !this.enableBackButton(history.index)})}>
          <FontAwesome name='chevron-left'/>
        </a>
        <a href='#' onClick={this.enableForwardButton(history.index, history.length) ? history.goForward : undefined} 
          className={cx({'disable': !this.enableForwardButton(history.index, history.length)})}>
          <FontAwesome name='chevron-right'/>
        </a>
      </div>
    );
  }
}

NavButtons.propTypes = {
  history: PropTypes.object.isRequired
};


export default withRouter(NavButtons);
