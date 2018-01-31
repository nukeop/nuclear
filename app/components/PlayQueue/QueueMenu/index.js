import React from 'react';
import FontAwesome from 'react-fontawesome';

import InputDialog from '../../InputDialog';
import Spacer from '../../Spacer';

import styles from './styles.scss';
import globalStyles from '../../../app.global.scss';

class QueueMenu extends React.Component {
  constructor(props){
    super(props);
  }

  handleAddPlaylist(fun, items) {
    return name => {
      fun(items, name);
    };
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

	  <InputDialog
	     header={<h4>Input playlist name:</h4>}
	     placeholder='Playlist name...'
	     accept='Save'
	     onAccept={this.handleAddPlaylist(addPlaylist, items)}
	     trigger={
		 <a href='#'><FontAwesome name="save" /></a>
	     }
          >
            
	    </InputDialog>
          <a className={globalStyles.disabled} href='#'><FontAwesome name="random" /></a>
        </div>
        <hr />
      </div>
    );
  }
}

export default QueueMenu;
