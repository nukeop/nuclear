import React from 'react';
import FontAwesome from 'react-fontawesome';

import Spacer from '../../Spacer';

import styles from './styles.scss';

class QueueMenu extends React.Component {
  constructor(props){
    super(props);
  }

  handleAddPlaylist(fun, items) {
    return () => {
      fun(items, Date.now());
    }
  }
  
  render() {
    let {
      addPlaylist,
      clearQueue,
      items
    } = this.props;

    return (
      <div className={styles.queue_menu_container}>
        <div className={styles.queue_menu_buttons}>
          <a href='#' onClick={clearQueue}><FontAwesome name="trash-o" /></a>
          <a href='#' onClick={this.handleAddPlaylist(addPlaylist, items)}><FontAwesome name="save" /></a>
          <a href='#'><FontAwesome name="random" /></a>
        </div>
        <hr />
      </div>
    );
  }
}

export default QueueMenu;
